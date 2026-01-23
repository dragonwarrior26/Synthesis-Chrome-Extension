import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Rate limits (requests per day)
const RATE_LIMITS = {
    free: 10,
    pro: 1000
} as const

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
            }
        })
    }

    try {
        // Authenticate user
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            })
        }

        // Get user tier
        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_tier')
            .eq('id', user.id)
            .single()

        const tier = (profile?.subscription_tier || 'free') as 'free' | 'pro'

        // Check rate limit
        const today = new Date().toISOString().split('T')[0]
        const { count } = await supabase
            .from('ai_usage')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('date', today)

        const limit = RATE_LIMITS[tier]
        if (count && count >= limit) {
            return new Response(JSON.stringify({
                error: 'Rate limit exceeded',
                limit,
                tier
            }), {
                status: 429,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            })
        }

        // Parse request
        const { prompt } = await req.json()

        // Call Gemini API with server-side key
        const geminiKey = Deno.env.get('GEMINI_API_KEY')
        if (!geminiKey) {
            console.error('Missing GEMINI_API_KEY')
            throw new Error('Server API key not configured')
        }

        console.log(`[Edge] Processing request for user ${user.id} (Tier: ${tier})`)

        const geminiResponse = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + geminiKey,
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
            console.error(`[Edge] Gemini API Error (${geminiResponse.status}):`, errorText)
            throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorText}`)
        }

        const geminiData = await geminiResponse.json()

        // check for errors or safety blocks
        const candidate = geminiData.candidates?.[0]
        const responseText = candidate?.content?.parts?.[0]?.text

        if (!responseText) {
            console.error('Gemini Empty Response:', JSON.stringify(geminiData))

            if (geminiData.promptFeedback?.blockReason) {
                throw new Error(`AI blocked content: ${geminiData.promptFeedback.blockReason}`)
            }

            if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
                throw new Error(`AI finished unexpectedly: ${candidate.finishReason}`)
            }

            if (geminiData.error) {
                throw new Error(`Gemini Error: ${geminiData.error.message}`)
            }

            throw new Error('AI returned no content. Please try a different query.')
        }

        // Log usage
        await supabase.from('ai_usage').insert({
            user_id: user.id,
            date: today,
            tier
        })

        return new Response(JSON.stringify({
            response: responseText,
            usage: { count: (count || 0) + 1, limit, tier }
        }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        })

    } catch (error) {
        console.error('AI Request error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        })
    }
})
