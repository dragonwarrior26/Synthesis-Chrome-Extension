/**
 * Feature Flags Configuration
 * 
 * Features are enabled/disabled based on build-time SYNTHESIS_TIER env variable.
 * Build commands:
 *   Free: SYNTHESIS_TIER=free pnpm build
 *   Pro:  SYNTHESIS_TIER=pro pnpm build (or default)
 */

// Tier is set at build time via Vite's define
const TIER = import.meta.env.VITE_SYNTHESIS_TIER || 'pro';

export type SynthesisTier = 'free' | 'pro';

export const currentTier: SynthesisTier = TIER as SynthesisTier;

export const isPro = currentTier === 'pro';
export const isFree = currentTier === 'free';

/**
 * Feature definitions with tier requirements
 */
export const Features = {
    // Core features - available in all tiers
    webpageExtraction: true,
    pdfExtraction: true,
    basicSynthesis: true,

    // Pro-only features
    deepMode: isPro,
    youtubeExtraction: isPro,
    youtubeStt: isPro,
    googleSearch: isPro,
    visionMode: isPro,
} as const;

export type FeatureKey = keyof typeof Features;

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(feature: FeatureKey): boolean {
    return Features[feature];
}

/**
 * Get feature availability message for disabled features
 */
export function getUpgradeMessage(feature: FeatureKey): string {
    return `${feature} is available in Synthesis Pro. Upgrade to unlock this feature.`;
}
