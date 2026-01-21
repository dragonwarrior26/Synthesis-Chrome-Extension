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
            throw new Error('Server API key not configured')
        }

        const geminiResponse = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + geminiKey,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        )

        if (!geminiResponse.ok) {
            throw new Error(`Gemini API error: ${geminiResponse.status}`)
        }

        const geminiData = await geminiResponse.json()
        const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ''

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
