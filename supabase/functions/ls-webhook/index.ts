import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
    const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    try {
        const payload = await req.json()
        const eventName = payload.meta.event_name

        // Determine User ID: In test mode, we might need a fallback if custom_data isn't passed,
        // but in our create-ls-checkout we ALWAYS pass user_id in custom.
        const userId = payload.meta.custom_data?.user_id

        if (!userId) {
            // If no user_id, we can't update the profile. Log error or ignore.
            // For test events from dashboard which might not have custom_data:
            console.warn('No user_id found in webhook payload');
            return new Response(JSON.stringify({ received: true, warning: 'No user_id' }), { headers: { 'Content-Type': 'application/json' } })
        }

        if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
            await supabaseAdmin
                .from('profiles')
                .update({
                    subscription_tier: 'pro',
                    stripe_subscription_id: String(payload.data.id), // Reusing column for LS Subscription ID
                    subscription_expires_at: payload.data.attributes.renews_at
                })
                .eq('id', userId)
        }

        if (eventName === 'subscription_expired' || eventName === 'subscription_cancelled') {
            // Optionally check if it's actually expired or just cancelled-but-still-active-until-end
            // For simplicity, if 'expired', we downgrade.
            if (eventName === 'subscription_expired') {
                await supabaseAdmin
                    .from('profiles')
                    .update({ subscription_tier: 'free' })
                    .eq('id', userId)
            }
        }

        return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' } })
    } catch (err) {
        console.error('Webhook processing error:', err)
        return new Response(JSON.stringify({ error: err.message }), { status: 400 })
    }
})
