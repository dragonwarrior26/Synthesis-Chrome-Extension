/**
 * Usage Tracker Hook
 * 
 * Tracks Pro tier feature usage (YouTube STT hours).
 * Data is stored in Chrome local storage and resets monthly.
 */

import { useState, useEffect, useCallback } from 'react';

export interface UsageData {
    currentMonth: string; // Format: "YYYY-MM"
    hoursUsed: number;
    lastUpdated: string; // ISO timestamp
}

const STORAGE_KEY = 'synthesis_usage_data';
const MONTHLY_QUOTA_HOURS = 5;

function getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function useUsageTracker() {
    const [usage, setUsage] = useState<UsageData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load usage data from Chrome storage
    useEffect(() => {
        const loadUsage = async () => {
            try {
                const result = await chrome.storage.local.get(STORAGE_KEY);
                const data = result[STORAGE_KEY] as UsageData | undefined;

                if (data) {
                    // Check if we need to reset for a new month
                    if (data.currentMonth !== getCurrentMonth()) {
                        const resetData: UsageData = {
                            currentMonth: getCurrentMonth(),
                            hoursUsed: 0,
                            lastUpdated: new Date().toISOString()
                        };
                        await chrome.storage.local.set({ [STORAGE_KEY]: resetData });
                        setUsage(resetData);
                    } else {
                        setUsage(data);
                    }
                } else {
                    // Initialize usage data
                    const initialData: UsageData = {
                        currentMonth: getCurrentMonth(),
                        hoursUsed: 0,
                        lastUpdated: new Date().toISOString()
                    };
                    await chrome.storage.local.set({ [STORAGE_KEY]: initialData });
                    setUsage(initialData);
                }
            } catch (error) {
                console.error('Failed to load usage data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUsage();
    }, []);

    /**
     * Track usage of STT feature
     * @param durationSeconds - Duration of video transcribed in seconds
     */
    const trackUsage = useCallback(async (durationSeconds: number) => {
        if (!usage) return;

        const hoursToAdd = durationSeconds / 3600;
        const updatedUsage: UsageData = {
            currentMonth: getCurrentMonth(),
            hoursUsed: usage.hoursUsed + hoursToAdd,
            lastUpdated: new Date().toISOString()
        };

        await chrome.storage.local.set({ [STORAGE_KEY]: updatedUsage });
        setUsage(updatedUsage);
    }, [usage]);

    /**
     * Get remaining hours in quota
     */
    const getRemainingHours = useCallback((): number => {
        if (!usage) return MONTHLY_QUOTA_HOURS;
        return Math.max(0, MONTHLY_QUOTA_HOURS - usage.hoursUsed);
    }, [usage]);

    /**
     * Check if quota is exceeded
     */
    const isQuotaExceeded = useCallback((): boolean => {
        return getRemainingHours() <= 0;
    }, [getRemainingHours]);

    /**
     * Check if a video duration would exceed quota
     */
    const wouldExceedQuota = useCallback((durationSeconds: number): boolean => {
        const hoursNeeded = durationSeconds / 3600;
        return hoursNeeded > getRemainingHours();
    }, [getRemainingHours]);

    /**
     * Format remaining hours for display
     */
    const formatRemainingTime = useCallback((): string => {
        const remaining = getRemainingHours();
        const hours = Math.floor(remaining);
        const minutes = Math.round((remaining - hours) * 60);

        if (hours === 0) {
            return `${minutes}min remaining`;
        }
        return `${hours}h ${minutes}min remaining`;
    }, [getRemainingHours]);

    return {
        usage,
        isLoading,
        trackUsage,
        getRemainingHours,
        isQuotaExceeded,
        wouldExceedQuota,
        formatRemainingTime,
        monthlyQuota: MONTHLY_QUOTA_HOURS
    };
}
