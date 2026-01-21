import { supabase } from '../lib/supabase';

/**
 * StripeService - Handles payment integration
 * 
 * NOTE: Full Stripe integration requires:
 * 1. Stripe account with products configured
 * 2. Supabase Edge Function for checkout session creation
 * 3. Webhook handler for subscription events
 * 
 * This file provides the client-side integration structure.
 */

// Stripe Product IDs (to be configured in Stripe Dashboard)
export const STRIPE_PRODUCTS = {
    pro_monthly: 'price_REPLACE_WITH_MONTHLY_PRICE_ID',
    pro_yearly: 'price_REPLACE_WITH_YEARLY_PRICE_ID'
} as const;

export type PlanType = keyof typeof STRIPE_PRODUCTS;

export class StripeService {
    /**
     * Create a checkout session for subscription
     * This calls a Supabase Edge Function that creates the Stripe checkout session
     */
    static async createCheckoutSession(planType: PlanType): Promise<string | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('User must be logged in to subscribe');
            }

            // Call Supabase Edge Function to create checkout session
            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                body: {
                    priceId: STRIPE_PRODUCTS[planType],
                    userId: user.id,
                    email: user.email,
                    successUrl: chrome.runtime.getURL('sidepanel.html?payment=success'),
                    cancelUrl: chrome.runtime.getURL('sidepanel.html?payment=cancelled')
                }
            });

            if (error) {
                console.error('[StripeService] Checkout session error:', error);
                throw error;
            }

            return data?.url || null;
        } catch (error) {
            console.error('[StripeService] Error creating checkout:', error);
            return null;
        }
    }

    /**
     * Open Stripe Customer Portal for subscription management
     */
    static async openCustomerPortal(): Promise<string | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('User must be logged in');
            }

            const { data, error } = await supabase.functions.invoke('create-portal-session', {
                body: { userId: user.id }
            });

            if (error) throw error;
            return data?.url || null;
        } catch (error) {
            console.error('[StripeService] Portal error:', error);
            return null;
        }
    }

    /**
     * Check subscription status from database
     */
    static async getSubscriptionStatus(): Promise<{
        tier: 'free' | 'pro';
        expiresAt: string | null;
        stripeCustomerId: string | null;
    }> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return { tier: 'free', expiresAt: null, stripeCustomerId: null };
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('subscription_tier, subscription_expires_at, stripe_customer_id')
                .eq('id', user.id)
                .single();

            if (error || !data) {
                return { tier: 'free', expiresAt: null, stripeCustomerId: null };
            }

            return {
                tier: data.subscription_tier as 'free' | 'pro',
                expiresAt: data.subscription_expires_at,
                stripeCustomerId: data.stripe_customer_id
            };
        } catch {
            return { tier: 'free', expiresAt: null, stripeCustomerId: null };
        }
    }

    /**
     * Handle successful payment (called after redirect from Stripe)
     */
    static async handlePaymentSuccess(): Promise<boolean> {
        // Refresh user session to get updated tier
        await supabase.auth.refreshSession();
        return true;
    }
}

/**
 * Pricing configuration for display
 */
export const PRICING = {
    monthly: {
        price: 9,
        currency: 'USD',
        interval: 'month',
        label: '$9/month'
    },
    yearly: {
        price: 79,
        currency: 'USD',
        interval: 'year',
        label: '$79/year',
        savings: '27% off'
    }
} as const;
