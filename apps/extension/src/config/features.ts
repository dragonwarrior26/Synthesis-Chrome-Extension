/**
 * Feature Flags & Tier Configuration
 * 
 * ============================================================================
 * TIER COMPARISON: FREE vs PRO vs BYOK (Bring Your Own Key)
 * ============================================================================
 * 
 * | Feature                      | Free          | Pro           | BYOK          |
 * |------------------------------|---------------|---------------|---------------|
 * | Webpage Content Extraction   | ✅ Yes        | ✅ Yes        | ✅ Yes        |
 * | PDF Content Extraction       | ✅ Yes        | ✅ Yes        | ✅ Yes        |
 * | Basic AI Synthesis           | ✅ Yes        | ✅ Yes        | ✅ Yes        |
 * | YouTube Caption Extraction   | ✅ Yes        | ✅ Yes        | ✅ Yes        |
 * | YouTube STT (No Captions)    | ❌ No         | ✅ Yes        | ✅ Yes        |
 * | Vision/Image Analysis        | ❌ No         | ✅ Yes        | ✅ Yes        |
 * | Deep Research Mode           | ❌ No         | ✅ Yes        | ✅ Yes        |
 * | Google Search Integration    | ❌ No         | ✅ Yes        | ✅ Yes        |
 * | Content Limit (chars)        | 15,000        | 100,000 (1L)  | 500,000 (5L)  |
 * | Audio Capture Duration       | 5 minutes     | 10 minutes    | 20 minutes    |
 * | Export Formats               | PDF, Markdown | + HTML, JSON  | All formats   |
 * | Cloud Sync                   | ❌ No         | ✅ Yes        | ✅ Yes        |
 * | API Key Required             | ❌ No         | ❌ No         | ✅ Yes        |
 * 
 * ============================================================================
 * PRICING TIERS (Future Implementation)
 * ============================================================================
 * 
 * 1. FREE TIER
 *    - Basic features, limited content processing
 *    - Perfect for casual users and evaluation
 * 
 * 2. PRO TIER (Monthly/Yearly Subscription)
 *    - All features unlocked
 *    - Higher limits on content processing
 *    - Cloud sync and premium export formats
 *    - Uses shared API quota (managed by us)
 * 
 * 3. BYOK TIER (Bring Your Own Key)
 *    - User provides their own Gemini API key
 *    - Maximum limits (user pays their own API costs)
 *    - Best for power users and businesses
 * 
 * ============================================================================
 */

// Tier is managed at runtime now to support single-build architecture
export type SynthesisTier = 'free' | 'pro';

// Default to FREE initially, but upgradable
let currentTier: SynthesisTier = 'free';

// For the initial launch period, we might want to Enable Pro features by default
// or keep them hidden. User requested: "Everything should be in free tier"
// So we will cheat: The "Tier" is free, BUT the feature flags will return TRUE 
// while logically knowing they are 'pro' features.
// ...Actually user said "Once I click sign-in... I should see every feature... scroll to upgrade"
// So we need to distinguish between "Is Available" and "Is Pro Feature".

export const setTier = (tier: SynthesisTier) => {
    currentTier = tier;
    // Dispatch event or callback if needed, but for now simple state
};

export const getTier = () => currentTier;

export const isPro = () => currentTier === 'pro';
export const isFree = () => currentTier === 'free';

/**
 * Feature definitions with tier requirements
 */
export const Features = {
    // Core features - available in all tiers
    webpageExtraction: true,
    pdfExtraction: true,
    basicSynthesis: true,

    // Pro-only features
    // In the new single-build, these keys mark the feature as "Premium".
    // The UI will check `isPro()` OR if we are in "Free Preview" mode.
    deepMode: true, // Marked as Pro in UI
    youtubeExtraction: true, // Marked as Pro in UI
    youtubeStt: true, // Marked as Pro in UI
    googleSearch: true, // Marked as Pro in UI
    visionMode: true, // Marked as Pro in UI
} as const;

export type FeatureKey = keyof typeof Features;

/**
 * Check if a specific feature is enabled
 * Now always returns true because we want to SHOW everything.
 * The UI components will handle the "Lock" state if they want enforce it.
 */
export function isFeatureEnabled(feature: FeatureKey): boolean {
    return Features[feature];
}

/**
 * Check if a feature REQUIRES Pro tier
 */
export function isProFeature(feature: FeatureKey): boolean {
    const proFeatures: FeatureKey[] = ['deepMode', 'youtubeExtraction', 'youtubeStt', 'googleSearch', 'visionMode'];
    return proFeatures.includes(feature);
}

/**
 * Get feature availability message for disabled features
 */
export function getUpgradeMessage(feature: FeatureKey): string {
    return `${feature} is available in Synthesis Pro. Upgrade to unlock this feature.`;
}

/**
 * Content Limits by Tier
 * Controls how much transcript/content is sent to Gemini for synthesis
 * 
 * Rationale:
 * - ~2,500 characters per minute of speech
 * - Free: 15K chars ≈ 6-7 min videos
 * - Pro: 100K chars (1 lakh) ≈ 40 min videos
 * - BYOK: 500K chars ≈ 3+ hours (user pays API cost)
 */
export const CONTENT_LIMITS = {
    free: 15_000,       // 15,000 characters
    pro: 100_000,       // 100,000 characters (1 lakh)
    byok: 500_000       // 500,000 characters (5 lakh) - effectively unlimited
} as const;

/**
 * Audio Capture Duration Limits by Tier
 * Controls how long audio is captured for speech-to-text
 * 
 * Rationale:
 * - Gemini inline audio limit: ~25MB
 * - 5 min @ 128kbps ≈ 4.8MB (safe)
 * - 10 min @ 128kbps ≈ 9.6MB (still safe)
 * - 20 min @ 128kbps ≈ 19.2MB (near limit but acceptable)
 */
export const AUDIO_CAPTURE_LIMITS = {
    free: 300,          // 5 minutes (300 seconds)
    pro: 600,           // 10 minutes (600 seconds)
    byok: 1200          // 20 minutes (1200 seconds)
} as const;

/**
 * Get content limit for current tier
 * @param hasByok - True if user has their own API key
 */
export function getContentLimit(hasByok: boolean = false): number {
    if (hasByok) return CONTENT_LIMITS.byok;
    return isPro() ? CONTENT_LIMITS.pro : CONTENT_LIMITS.free;
}

/**
 * Get audio capture duration limit for current tier
 * @param hasByok - True if user has their own API key
 */
export function getAudioCaptureLimit(hasByok: boolean = false): number {
    if (hasByok) return AUDIO_CAPTURE_LIMITS.byok;
    return isPro() ? AUDIO_CAPTURE_LIMITS.pro : AUDIO_CAPTURE_LIMITS.free;
}
