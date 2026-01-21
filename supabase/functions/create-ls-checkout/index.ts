import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { variantId, redirectUrl } = await req.json()
        const apiKey = Deno.env.get('LS_API_KEY')

        // Create Checkout via Lemon Squeezy API
        const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                data: {
                    type: 'checkouts',
                    attributes: {
                        checkout_data: {
                            email: user.email,
                            custom: { user_id: user.id } // Pass User ID to webhook
                        },
                        product_options: {
                            redirect_url: redirectUrl
                        }
                    },
                    relationships: {
                        store: { data: { type: 'stores', id: '277145' } },
                        variant: { data: { type: 'variants', id: String(variantId) } }
                    }
                }
            })
        })

        const data = await response.json()

        // Error handling from LS API
        if (data.errors) {
            throw new Error(data.errors[0]?.detail || 'Lemon Squeezy API Error');
        }

        return new Response(JSON.stringify({ url: data.data.attributes.url }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
    }
})
