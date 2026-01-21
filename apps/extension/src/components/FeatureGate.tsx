/**
 * FeatureGate Component
 * 
 * Conditionally renders children based on feature availability and user tier.
 * Pro features are gated for Free tier users.
 */

import { type ReactNode } from 'react';
import { isProFeature, type FeatureKey } from '@/config/features';
import { useAuth } from '@/context/AuthContext';
import { Lock, Crown } from 'lucide-react';

interface FeatureGateProps {
    feature: FeatureKey;
    children: ReactNode;
    /** Optional fallback to render when feature is disabled */
    fallback?: ReactNode;
    /** If true, shows a locked preview with upgrade prompt */
    showLocked?: boolean;
}

/**
 * Renders children only if user has access to the feature.
 * For Pro features:
 *  - Pro/BYOK users: render normally
 *  - Free users: render fallback or locked preview
 */
export function FeatureGate({ feature, children, fallback, showLocked = false }: FeatureGateProps) {
    const { tier } = useAuth();

    const requiresPro = isProFeature(feature);
    const hasAccess = !requiresPro || tier === 'pro' || tier === 'byok';

    if (hasAccess) {
        return <>{children}</>;
    }

    // User doesn't have access
    if (showLocked) {
        return (
            <div className="relative opacity-60 pointer-events-none">
                {children}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                    <div className="flex items-center gap-1 text-xs text-amber-500 bg-black/80 px-2 py-1 rounded">
                        <Lock className="w-3 h-3" />
                        <span>Pro</span>
                    </div>
                </div>
            </div>
        );
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    return null;
}

/**
 * Upgrade Prompt Component - Shows when user tries to access Pro feature
 */
export function UpgradePrompt({ feature }: { feature?: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-lg">
            <Crown className="w-8 h-8 text-amber-500 mb-2" />
            <h3 className="text-sm font-semibold text-amber-500 mb-1">Pro Feature</h3>
            <p className="text-xs text-gray-400 text-center mb-3">
                {feature ? `${feature} requires` : 'This feature requires'} Synthesis Pro
            </p>
            <button
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded-md hover:from-amber-600 hover:to-orange-600 transition-all"
                onClick={() => {
                    // TODO: Open Stripe checkout or upgrade modal
                    alert('Upgrade flow coming soon! For now, add your own Gemini API key in settings.');
                }}
            >
                Upgrade to Pro
            </button>
        </div>
    );
}

/**
 * Hook version for conditional logic outside JSX
 */
export function useFeature(feature: FeatureKey): boolean {
    const { tier } = useAuth();
    const requiresPro = isProFeature(feature);
    return !requiresPro || tier === 'pro' || tier === 'byok';
}
