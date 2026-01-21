import { supabase } from '../lib/supabase';

/**
 * LemonSqueezyService - Handles payment integration via Lemon Squeezy
 * 
 * Replaces Stripe for global tax compliance (Merchant of Record).
 */

// Lemon Squeezy Variant IDs (get from Dashboard)
export const LS_VARIANTS = {
    pro_monthly: '1238551',
    pro_yearly: '1238555'
} as const;

export type PlanType = keyof typeof LS_VARIANTS;

export class LemonSqueezyService {
    /**
     * Create a checkout session
     */
    static async createCheckoutSession(planType: PlanType): Promise<string | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('User must be logged in to subscribe');
            }

            // Call Supabase Edge Function
            const { data, error } = await supabase.functions.invoke('create-ls-checkout', {
                body: {
                    variantId: LS_VARIANTS[planType],
                    userId: user.id,
                    email: user.email,
                    redirectUrl: chrome.runtime.getURL('sidepanel.html?payment=success')
                }
            });

            if (error) {
                console.error('[LemonSqueezy] Checkout error:', error);
                throw error;
            }

            return data?.url || null;
        } catch (error) {
            console.error('[LemonSqueezy] Checkout failed:', error);
            return null;
        }
    }

    /**
     * Open Customer Portal
     */
    static async openCustomerPortal(): Promise<string | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User must be logged in');

            const { data, error } = await supabase.functions.invoke('get-ls-portal', {
                body: { userId: user.id }
            });

            if (error) throw error;
            return data?.url || null;
        } catch (error) {
            console.error('[LemonSqueezy] Portal error:', error);
            return null;
        }
    }

    /**
     * Check subscription status (same logic as Stripe, just different DB fields potentially)
     * For now, we reuse the same profiles logic since the schema is generic enough
     * (subscription_tier is what matters).
     */
    static async getSubscriptionStatus() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return { tier: 'free', expiresAt: null };

            const { data } = await supabase
                .from('profiles')
                .select('subscription_tier, subscription_expires_at')
                .eq('id', user.id)
                .single();

            return {
                tier: (data?.subscription_tier || 'free') as 'free' | 'pro',
                expiresAt: data?.subscription_expires_at
            };
        } catch {
            return { tier: 'free', expiresAt: null };
        }
    }
}

export const PRICING = {
    monthly: {
        price: 9.99,
        currency: 'USD',
        interval: 'month',
        label: '$9.99/month'
    },
    yearly: {
        price: 79.99,
        currency: 'USD',
        interval: 'year',
        label: '$79.99/year',
        savings: '33% off'
    }
} as const;
