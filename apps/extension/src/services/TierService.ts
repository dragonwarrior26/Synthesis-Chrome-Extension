import { setTier } from '../config/features';
import { supabase } from '../lib/supabase';

export type UserTier = 'free' | 'pro' | 'byok';

/**
 * TierService - Runtime tier detection for Synthesis
 */
export class TierService {
    private static apiKeyStorageKey = 'gemini_api_key';
    // cachedTier is used to store the last detected tier for performance
    private static cachedTier: UserTier = 'free';

    /**
     * Get current effective tier
     */
    static async getCurrentTier(): Promise<UserTier> {
        // Enforce 5s timeout for tier detection to prevent blocking the UI
        const detectionPromise = (async () => {
            try {
                // 1. FAST PATH: Check for BYOK first (no network calls, instant)
                if (await this.hasValidApiKey()) {
                    this.cachedTier = 'byok';
                    setTier('pro'); // BYOK users get pro-level features
                    return 'byok';
                }

                // 2. CHECK DB: If user is logged in, check profiles
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('subscription_tier')
                        .eq('id', session.user.id)
                        .single();

                    if (profile?.subscription_tier === 'pro') {
                        this.cachedTier = 'pro';
                        setTier('pro');
                        return 'pro';
                    }
                }

                // 3. DEFAULT: Free
                this.cachedTier = 'free';
                setTier('free');
                return 'free';
            } catch (error) {
                console.warn('[TierService] Error detecting tier, defaulting to free:', error);
                this.cachedTier = 'free';
                setTier('free');
                return 'free';
            }
        })();

        // Race against 5s timeout
        const timeoutPromise = new Promise<UserTier>((resolve) => {
            setTimeout(() => {
                console.warn('[TierService] Tier detection timed out (5s), defaulting to free');
                resolve('free');
            }, 5000);
        });

        return Promise.race([detectionPromise, timeoutPromise]);
    }

    /**
     * Quick sync of tier - called after login
     */
    static async syncTierFromDB(): Promise<UserTier> {
        try {
            // 1. Check for BYOK first (highest priority)
            if (await this.hasValidApiKey()) {
                this.cachedTier = 'byok';
                setTier('pro');
                return 'byok';
            }

            // 2. Check Supabase for subscription tier
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('subscription_tier')
                    .eq('id', user.id)
                    .single();

                if (profile?.subscription_tier === 'pro') {
                    console.log('[TierService] User has PRO tier');
                    this.cachedTier = 'pro';
                    setTier('pro');
                    return 'pro';
                }
            }

            // 3. Default to free
            console.log('[TierService] User is on FREE tier');
            this.cachedTier = 'free';
            setTier('free');
            return 'free';

        } catch (error) {
            console.error('[TierService] Sync failed:', error);
            // Fallback to cached or free
            return this.cachedTier;
        }
    }

    /**
     * Check if user has a stored API key
     */
    static async hasValidApiKey(): Promise<boolean> {
        try {
            const result = await chrome.storage.local.get(this.apiKeyStorageKey);
            const apiKey = result[this.apiKeyStorageKey] as string | undefined;
            return !!apiKey && apiKey.length > 0;
        } catch (e) {
            return false;
        }
    }

    /**
     * Get the stored API key
     */
    static async getStoredApiKey(): Promise<string | null> {
        try {
            const result = await chrome.storage.local.get(this.apiKeyStorageKey);
            return (result[this.apiKeyStorageKey] as string) || null;
        } catch (e) {
            return null;
        }
    }

    /**
     * Store the API key
     */
    static async setApiKey(apiKey: string): Promise<void> {
        await chrome.storage.local.set({ [this.apiKeyStorageKey]: apiKey });
        // Invalidate cache to force re-check
        this.cachedTier = 'byok';
        setTier('pro');
    }

    /**
     * Clear the stored API key
     */
    static async clearStoredApiKey(): Promise<void> {
        await chrome.storage.local.remove(this.apiKeyStorageKey);
        this.cachedTier = 'free'; // Default back to free
        setTier('free');
    }

    static getCachedTier(): UserTier {
        return this.cachedTier;
    }
}
