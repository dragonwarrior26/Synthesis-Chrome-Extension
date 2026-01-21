import { supabase } from '../lib/supabase';
import { setTier, type SynthesisTier } from '../config/features';

export type UserTier = 'free' | 'pro' | 'byok';

interface UserProfile {
    id: string;
    subscription_tier: SynthesisTier;
    email?: string;
}

/**
 * TierService - Runtime tier detection for Synthesis
 * 
 * Tier Hierarchy:
 * 1. BYOK (Bring Your Own Key) - User has valid Gemini API key → highest limits
 * 2. Pro - Signed in with active subscription → full features
 * 3. Free - No login required → limited features
 */
export class TierService {
    private static cachedTier: UserTier = 'free';
    private static apiKeyStorageKey = 'synthesis_gemini_api_key';

    /**
     * Get the current user's tier based on:
     * 1. API key presence (BYOK) - Highest priority
     * 2. Database subscription_tier (Pro/Free)
     */
    static async getCurrentTier(): Promise<UserTier> {
        // Check for BYOK first (highest priority)
        if (await this.hasValidApiKey()) {
            this.cachedTier = 'byok';
            return 'byok';
        }

        // Check for Admin/Internal Override
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email === 'aayush_sharma@synthesisext.com') {
            // console.log('[TierService] Admin Access Granted');
            this.cachedTier = 'pro';
            setTier('pro');
            return 'pro';
        }

        // Check database for subscription tier
        const profile = await this.fetchUserProfile();
        if (profile?.subscription_tier === 'pro') {
            this.cachedTier = 'pro';
            setTier('pro');
            return 'pro';
        }

        // Default to free
        this.cachedTier = 'free';
        setTier('free');
        return 'free';
    }

    /**
     * Quick sync of tier - called after login
     */
    static async syncTierFromDB(): Promise<UserTier> {
        return this.getCurrentTier();
    }

    /**
     * Check if user has a stored API key
     */
    static async hasValidApiKey(): Promise<boolean> {
        try {
            const result = await chrome.storage.local.get(this.apiKeyStorageKey);
            const apiKey = result[this.apiKeyStorageKey];
            return !!(apiKey && typeof apiKey === 'string' && apiKey.length > 20);
        } catch {
            return false;
        }
    }

    /**
     * Get the stored API key (for BYOK users)
     */
    static async getStoredApiKey(): Promise<string | null> {
        try {
            const result = await chrome.storage.local.get(this.apiKeyStorageKey);
            const key = result[this.apiKeyStorageKey];
            return typeof key === 'string' ? key : null;
        } catch {
            return null;
        }
    }

    /**
     * Store API key (for BYOK users)
     */
    static async setApiKey(apiKey: string): Promise<void> {
        await chrome.storage.local.set({ [this.apiKeyStorageKey]: apiKey });
        // Refresh tier
        await this.getCurrentTier();
    }

    /**
     * Remove stored API key
     */
    static async clearApiKey(): Promise<void> {
        await chrome.storage.local.remove(this.apiKeyStorageKey);
        await this.getCurrentTier();
    }

    /**
     * Fetch user profile from Supabase
     */
    private static async fetchUserProfile(): Promise<UserProfile | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            const { data, error } = await supabase
                .from('profiles')
                .select('id, subscription_tier, email')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('[TierService] Profile fetch error:', error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('[TierService] Error fetching profile:', error);
            return null;
        }
    }

    /**
     * Get cached tier (for synchronous access)
     */
    static getCachedTier(): UserTier {
        return this.cachedTier;
    }

    /**
     * Check if current tier allows a specific feature
     */
    static canAccessFeature(_feature: 'youtubeStt' | 'visionMode' | 'deepMode' | 'googleSearch' | 'cloudSync'): boolean {
        const tier = this.cachedTier;
        // BYOK and Pro can access all features
        return tier === 'byok' || tier === 'pro';
    }

    /**
     * Check if user is signed in (for cloud sync, etc.)
     */
    static async isSignedIn(): Promise<boolean> {
        const { data: { user } } = await supabase.auth.getUser();
        return !!user;
    }
}
