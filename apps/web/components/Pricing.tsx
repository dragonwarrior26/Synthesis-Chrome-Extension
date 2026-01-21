"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Container } from "./ui/Container";
import { Button } from "./ui/Button";

const tiers = [
    {
        name: "Starter",
        price: "$0",
        description: "Perfect for casual browsing and quick summaries.",
        features: [
            "Webpage Content Extraction",
            "PDF Content Extraction",
            "Basic AI Synthesis",
            "YouTube Captions",
            "15,000 Char Content Limit",
        ],
        notIncluded: [
            "No Cloud Sync",
            "No Vision/Image Analysis",
            "No Deep Research Mode",
        ],
        cta: "Add to Chrome",
        highlight: false,
    },
    {
        name: "Pro",
        price: "$9",
        period: "/month",
        description: "For researchers who need power and sync.",
        features: [
            "Everything in Starter",
            "Cloud Sync Across Devices",
            "YouTube AI (No Captions Needed)",
            "Deep Research Mode",
            "Vision/Image Analysis",
            "100,000 Char Content Limit",
        ],
        notIncluded: [],
        cta: "Start Free Trial",
        highlight: true,
    },
    {
        name: "BYOK",
        price: "Free",
        period: " (Your Key)",
        description: "Power users with their own Gemini API key.",
        features: [
            "Unlimited Content Limits*",
            "Highest Privacy (Your Key)",
            "All Pro Features",
            "Access to Experimental Models",
            "You pay Google directly",
        ],
        notIncluded: [],
        cta: "Configure Key",
        highlight: false,
    },
];

export const Pricing = () => {
    return (
        <section id="pricing" className="py-24 bg-neutral-900/50 border-t border-white/5">
            <Container>
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6 text-white"
                    >
                        Simple, Transparent <span className="text-gradient">Pricing</span>
                    </motion.h2>
                    <p className="text-lg text-neutral-400">
                        Start for free. Upgrade for power. Or bring your own key for total control.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tiers.map((tier, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative rounded-3xl p-8 border backdrop-blur-sm flex flex-col ${tier.highlight
                                    ? "bg-white/10 border-white/20 shadow-2xl z-10 scale-105"
                                    : "bg-black/40 border-white/5"
                                }`}
                        >
                            {tier.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-white mb-2">{tier.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                                    {tier.period && <span className="text-sm text-neutral-400">{tier.period}</span>}
                                </div>
                                <p className="text-sm text-neutral-400">{tier.description}</p>
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                {tier.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                                        <span className="text-sm text-neutral-300">{feature}</span>
                                    </div>
                                ))}
                                {tier.notIncluded.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3 opacity-50">
                                        <X className="w-5 h-5 text-neutral-500 shrink-0" />
                                        <span className="text-sm text-neutral-500">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant={tier.highlight ? "primary" : "secondary"}
                                className="w-full justify-center"
                            >
                                {tier.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
