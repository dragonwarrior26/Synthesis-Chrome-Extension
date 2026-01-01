import { Button } from "./ui/button";
import { Shield, Lock, Eye, Server, ChevronRight } from "lucide-react";

interface PrivacyDisclosureProps {
    onAccept: () => void;
}

export function PrivacyDisclosure({ onAccept }: PrivacyDisclosureProps) {
    return (
        <div className="h-screen flex flex-col bg-slate-950 text-slate-50 p-6 overflow-y-auto">
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 min-h-[500px]">

                {/* Header Icon */}
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                    <div className="relative bg-slate-900 ring-1 ring-slate-800 p-4 rounded-2xl">
                        <Shield className="w-12 h-12 text-blue-500" />
                    </div>
                </div>

                {/* Title & Intro */}
                <div className="text-center space-y-2 max-w-sm">
                    <h1 className="text-2xl font-bold tracking-tight text-white">Your Privacy Matters</h1>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Synthesis is designed as a "Local-First" application. We believe in transparency about how your data is handled.
                    </p>
                </div>

                {/* Key Points - Prominent Disclosure */}
                <div className="w-full max-w-sm space-y-4">
                    <DisclosureItem
                        icon={<Eye className="w-5 h-5 text-blue-400" />}
                        title="Data Collection"
                        description="We only access the text content of the tabs you explicitly choose to 'Sync' or 'Summarize'."
                    />
                    <DisclosureItem
                        icon={<Server className="w-5 h-5 text-amber-400" />}
                        title="AI Processing"
                        description="Content is sent directly from your browser to the Google Gemini API for analysis. We do not have our own servers found between you and Google."
                    />
                    <DisclosureItem
                        icon={<Lock className="w-5 h-5 text-green-400" />}
                        title="Local Storage"
                        description="Your API Keys and preferences are stored locally on your device. We do not collect or store your personal data."
                    />
                </div>

                {/* Action */}
                <div className="w-full max-w-sm pt-4 space-y-3">
                    <Button
                        onClick={onAccept}
                        className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 transition-all rounded-xl flex items-center justify-center gap-2 group"
                    >
                        Agree & Continue
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <p className="text-xs text-center text-slate-500">
                        By continuing, you agree to our <a href="https://gistcdn.githack.com/dragonwarrior26/d303acb8cdd834b3f0c81caf9eef4e2c/raw/ce69221409f19a3898dd66451268ca28b9b57631/privacypolicy.html" target="_blank" className="text-slate-400 hover:text-white underline">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}

function DisclosureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="flex gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:bg-slate-900 hover:border-slate-800 transition-colors">
            <div className="flex-shrink-0 mt-1">{icon}</div>
            <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}
