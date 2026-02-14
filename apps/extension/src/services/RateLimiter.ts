import { TierService } from './TierService';
import type { UserTier } from './TierService';

/**
 * Client-side rate limiter for ALL tiers (including BYOK).
 * Uses chrome.storage.local to track daily usage.
 * This is the single source of truth for rate limiting in the extension.
 */

const STORAGE_KEY = 'synthesis_daily_usage';

interface UsageRecord {
    date: string;   // YYYY-MM-DD
    count: number;
}

const DAILY_LIMITS: Record<UserTier, number> = {
    free: 10,
    pro: 1000,
    byok: 50,  // Fair use limit for BYOK users
};

export class RateLimiter {
    /**
     * Check if the user has exceeded their daily limit.
     * Returns { allowed, remaining, limit } or throws if blocked.
     */
    static async check(): Promise<{ allowed: boolean; remaining: number; limit: number }> {
        const tier = await TierService.getCurrentTier();
        const limit = DAILY_LIMITS[tier];
        const usage = await this.getUsage();

        const today = new Date().toISOString().split('T')[0];

        // Reset if it's a new day
        if (usage.date !== today) {
            return { allowed: true, remaining: limit, limit };
        }

        const remaining = Math.max(0, limit - usage.count);
        return { allowed: usage.count < limit, remaining, limit };
    }

    /**
     * Increment usage counter after a successful request.
     */
    static async increment(): Promise<void> {
        const today = new Date().toISOString().split('T')[0];
        const usage = await this.getUsage();

        if (usage.date !== today) {
            // New day — reset
            await this.setUsage({ date: today, count: 1 });
        } else {
            await this.setUsage({ date: today, count: usage.count + 1 });
        }
    }

    /**
     * Get current usage info for display purposes.
     */
    static async getStatus(): Promise<{ count: number; limit: number; remaining: number; tier: UserTier }> {
        const tier = await TierService.getCurrentTier();
        const limit = DAILY_LIMITS[tier];
        const usage = await this.getUsage();
        const today = new Date().toISOString().split('T')[0];

        const count = usage.date === today ? usage.count : 0;
        return { count, limit, remaining: Math.max(0, limit - count), tier };
    }

    private static async getUsage(): Promise<UsageRecord> {
        try {
            const result = await chrome.storage.local.get(STORAGE_KEY);
            const stored = result[STORAGE_KEY] as UsageRecord | undefined;
            return stored && stored.date ? stored : { date: '', count: 0 };
        } catch {
            return { date: '', count: 0 };
        }
    }

    private static async setUsage(record: UsageRecord): Promise<void> {
        await chrome.storage.local.set({ [STORAGE_KEY]: record });
    }
}
