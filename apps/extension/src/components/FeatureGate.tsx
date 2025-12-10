/**
 * FeatureGate Component
 * 
 * Conditionally renders children based on feature availability.
 * At build time, disabled features are completely removed from the bundle.
 */

import { type ReactNode } from 'react';
import { Features, type FeatureKey } from '@/config/features';

interface FeatureGateProps {
    feature: FeatureKey;
    children: ReactNode;
    /** Optional fallback to render when feature is disabled */
    fallback?: ReactNode;
}

/**
 * Renders children only if the specified feature is enabled for the current tier.
 * 
 * @example
 * <FeatureGate feature="youtubeExtraction">
 *   <YouTubeTab />
 * </FeatureGate>
 */
export function FeatureGate({ feature, children, fallback = null }: FeatureGateProps) {
    if (Features[feature]) {
        return <>{children}</>;
    }
    return <>{fallback}</>;
}

/**
 * Hook version for conditional logic outside JSX
 */
export function useFeature(feature: FeatureKey): boolean {
    return Features[feature];
}
