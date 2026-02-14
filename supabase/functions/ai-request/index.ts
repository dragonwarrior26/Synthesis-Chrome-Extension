import { createClient } from 'npm:@supabase/supabase-js@2'
// Force deploy update timestamp: 2026-02-14

// Rate limits (requests per day)
const RATE_LIMITS = {
    free: 10,
    pro: 1000
} as const

// Modern Deno.serve API
Deno.serve(async (req: Request) => {
    // CORS Headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
    }

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Authenticate user (MANDATORY)
        const authHeader = req.headers.get('Authorization')
        let user = null;
        let tier: 'free' | 'pro' = 'free';

        if (authHeader) {
            const supabase = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
                { global: { headers: { Authorization: authHeader } } }
            )

            const { data: userData, error: authError } = await supabase.auth.getUser()
            if (!authError && userData) {
                user = userData.user;

                // Get user tier
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('subscription_tier')
                    .eq('id', user.id)
                    .single()

                tier = (profile?.subscription_tier || 'free') as 'free' | 'pro'
            }
        }

        // Reject unauthenticated requests
        if (!user) {
            return new Response(JSON.stringify({
                error: 'Authentication required. Please sign in to use AI features.'
            }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        // Rate limiting logic
        const today = new Date().toISOString().split('T')[0]
        let limit = RATE_LIMITS[tier]
        let count = 0;

        // User-based rate limiting (uses SERVICE_ROLE_KEY to bypass RLS)
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { count: userCount, error: rateError } = await supabase
            .from('ai_usage')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('date', today)

        if (!rateError && userCount !== null) {
            count = userCount;
            if (count >= limit) {
                return new Response(JSON.stringify({
                    error: `Daily limit of ${limit} requests reached. ${tier === 'free' ? 'Sign in or upgrade to Pro for more.' : 'Limit reached for today.'}`,
                    limit,
                    tier
                }), {
                    status: 429, // Too Many Requests
                    headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '86400' }
                })
            }
        }

        // Parse request
        let prompt
        try {
            const body = await req.json()
            prompt = body.prompt
        } catch (e) {
            throw new Error('Invalid JSON body')
        }

        if (!prompt) throw new Error('Prompt is required')

        // Call Gemini API
        const geminiKey = Deno.env.get('GEMINI_API_KEY')
        if (!geminiKey) {
            throw new Error('Configuration Error: GEMINI_API_KEY is not set in Supabase Secrets')
        }

        console.log(`[Edge] Proxying to Gemini for user ${user.id} (${tier})`)

        // Use streamGenerateContent with SSE (Server-Sent Events)
        const geminiResponse = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=' + geminiKey,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        )

        if (!geminiResponse.ok) {
            const errorText = await geminiResponse.text()
            console.error(`Gemini Upstream Error (${geminiResponse.status}):`, errorText)
            throw new Error(`Gemini Provider Error: ${geminiResponse.status} - ${errorText}`)
        }

        if (!geminiResponse.body) {
            throw new Error('Gemini returned no response body')
        }

        // Create a TransformStream to parse SSE events and extract text
        // AND handle usage logging when stream finishes
        // Create a TransformStream to parse SSE events and extract text
        // AND handle usage logging when stream finishes
        let buffer = ''
        const decoder = new TextDecoder()
        const encoder = new TextEncoder()

        const transformer = new TransformStream({
            async transform(chunk, controller) {
                // Decode chunk and append to buffer
                buffer += decoder.decode(chunk, { stream: true })

                // Split by newline
                const lines = buffer.split('\n')

                // The last element is potentially incomplete, keep it in buffer
                buffer = lines.pop() ?? ''

                for (const line of lines) {
                    const trimmedLine = line.trim()
                    if (!trimmedLine) continue

                    if (trimmedLine.startsWith('data: ')) {
                        const jsonStr = trimmedLine.slice(6)
                        if (jsonStr === '[DONE]') continue

                        try {
                            const data = JSON.parse(jsonStr)
                            const textChunk = data.candidates?.[0]?.content?.parts?.[0]?.text
                            if (textChunk) {
                                controller.enqueue(encoder.encode(textChunk))
                            }
                        } catch (e) {
                            // Ignore parse errors for malformed lines
                        }
                    }
                }
            },
            async flush(controller) {
                // Process any remaining complete line in buffer (unlikely for SSE but good practice)
                if (buffer.trim().startsWith('data: ')) {
                    try {
                        const data = JSON.parse(buffer.trim().slice(6))
                        const textChunk = data.candidates?.[0]?.content?.parts?.[0]?.text
                        if (textChunk) {
                            controller.enqueue(encoder.encode(textChunk))
                        }
                    } catch (e) { }
                }

                // Stream finished - Log usage
                try {
                    const supabase = createClient(
                        Deno.env.get('SUPABASE_URL') ?? '',
                        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
                    )
                    // We only log if we are authenticated (sanity check, though we check exact count)
                    // Actually, we must log for rate limiting to work next time
                    if (user && user.id) {
                        await supabase.from('ai_usage').insert({
                            user_id: user.id,
                            date: today,
                            tier
                        })
                    }
                } catch (e) {
                    console.error('Usage logging failed:', e)
                }
            }
        })

        // Return the transformed stream
        return new Response(geminiResponse.body.pipeThrough(transformer), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'text/plain',
                'Transfer-Encoding': 'chunked'
            }
        })

    } catch (error) {
        console.error('Edge Function Crash:', error)
        const msg = error instanceof Error ? error.message : String(error)

        return new Response(JSON.stringify({ error: msg }), {
            status: 500, // Internal Server Error
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        })
    }
})
