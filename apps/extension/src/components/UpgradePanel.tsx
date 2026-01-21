/**
 * UpgradePanel Component
 * 
 * Displays pricing options and handles upgrade flow
 */

import { useState } from 'react';
import { Crown, Check, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LemonSqueezyService, PRICING } from '@/services/LemonSqueezyService';
import { TierService } from '@/services/TierService';

interface UpgradePanelProps {
    onClose?: () => void;
}

export function UpgradePanel({ onClose }: UpgradePanelProps) {
    const { tier, user } = useAuth();
    const [loading, setLoading] = useState<'monthly' | 'yearly' | null>(null);
    const [showApiKeyInput, setShowApiKeyInput] = useState(false);
    const [apiKey, setApiKey] = useState('');

    const handleSubscribe = async (planType: 'monthly' | 'yearly') => {
        if (!user) {
            alert('Please sign in first to subscribe');
            return;
        }

        setLoading(planType === 'monthly' ? 'monthly' : 'yearly');
        try {
            const checkoutUrl = await LemonSqueezyService.createCheckoutSession(
                planType === 'monthly' ? 'pro_monthly' : 'pro_yearly'
            );
            if (checkoutUrl) {
                window.open(checkoutUrl, '_blank');
            } else {
                alert('Failed to create checkout session. Please try again.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Error starting checkout. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    const handleSaveApiKey = async () => {
        if (!apiKey.startsWith('AIza')) {
            alert('Invalid API key format. Gemini keys start with "AIza".');
            return;
        }
        await TierService.setApiKey(apiKey);
        setApiKey('');
        setShowApiKeyInput(false);
        alert('API key saved! You now have BYOK access.');
        onClose?.();
    };

    if (tier === 'pro' || tier === 'byok') {
        return (
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-green-500">
                        {tier === 'pro' ? 'Pro Subscriber' : 'BYOK Active'}
                    </h3>
                </div>
                <p className="text-xs text-gray-400">
                    You have full access to all features!
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            <div className="text-center">
                <Crown className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <h2 className="text-lg font-bold text-white">Upgrade to Pro</h2>
                <p className="text-xs text-gray-400">Unlock all features</p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-2 gap-3">
                {/* Monthly */}
                <button
                    onClick={() => handleSubscribe('monthly')}
                    disabled={loading !== null}
                    className="p-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-amber-500/50 transition-all text-left disabled:opacity-50"
                >
                    <div className="text-lg font-bold text-white">{PRICING.monthly.label}</div>
                    <div className="text-xs text-gray-400">Billed monthly</div>
                    {loading === 'monthly' && <div className="text-xs text-amber-500 mt-1">Loading...</div>}
                </button>

                {/* Yearly */}
                <button
                    onClick={() => handleSubscribe('yearly')}
                    disabled={loading !== null}
                    className="p-3 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/50 rounded-lg hover:border-amber-500 transition-all text-left disabled:opacity-50 relative"
                >
                    <div className="absolute -top-2 -right-2 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded">
                        SAVE 27%
                    </div>
                    <div className="text-lg font-bold text-white">{PRICING.yearly.label}</div>
                    <div className="text-xs text-gray-400">Billed yearly</div>
                    {loading === 'yearly' && <div className="text-xs text-amber-500 mt-1">Loading...</div>}
                </button>
            </div>

            {/* Pro Features */}
            <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
                <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Pro Features</h4>
                <div className="space-y-1.5">
                    {[
                        'YouTube videos without captions (STT)',
                        'Vision/Image analysis',
                        'Deep Research mode',
                        'Google Search integration',
                        'Cloud sync across devices',
                        'Extended content limits (100K+ chars)'
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-gray-700" />
                <span className="text-xs text-gray-500">or</span>
                <div className="flex-1 border-t border-gray-700" />
            </div>

            {/* BYOK Option */}
            <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-medium text-white">Bring Your Own Key</h4>
                </div>
                <p className="text-xs text-gray-400 mb-2">
                    Use your own Gemini API key for unlimited access. You pay Google directly.
                </p>

                {showApiKeyInput ? (
                    <div className="space-y-2">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="AIza..."
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-sm text-white placeholder-gray-500"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleSaveApiKey}
                                className="flex-1 py-1.5 bg-blue-500 text-white text-xs font-medium rounded hover:bg-blue-600"
                            >
                                Save Key
                            </button>
                            <button
                                onClick={() => setShowApiKeyInput(false)}
                                className="px-3 py-1.5 bg-gray-700 text-gray-300 text-xs rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowApiKeyInput(true)}
                        className="w-full py-2 bg-gray-700 text-gray-300 text-xs font-medium rounded hover:bg-gray-600 transition-colors"
                    >
                        Enter API Key
                    </button>
                )}
            </div>
        </div>
    );
}
