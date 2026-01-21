"use client";

import { motion } from "framer-motion";
import { Container } from "./ui/Container";
import { Youtube, FileText, Lock, Zap, MousePointer2, Layers } from "lucide-react";

const features = [
    {
        title: "YouTube Intelligence",
        description: "Don't watch hours of video. Extract summaries, key insights, and transcripts instantly—even from videos without captions.",
        icon: Youtube,
        className: "md:col-span-2 bg-red-900/10 border-red-500/20",
        iconColor: "text-red-500",
    },
    {
        title: "Chat with PDFs & Web",
        description: "Turn any webpage or PDF into an interactive knowledge base. Ask questions and get answers cited from the source.",
        icon: FileText,
        className: "md:col-span-1 bg-blue-900/10 border-blue-500/20",
        iconColor: "text-blue-500",
    },
    {
        title: "Bring Your Own Key (BYOK)",
        description: "Zero markup costs. Use your own Gemini API key for unlimited interaction boundaries. We don't act as a middleman.",
        icon: Lock,
        className: "md:col-span-1 bg-emerald-900/10 border-emerald-500/20",
        iconColor: "text-emerald-500",
    },
    {
        title: "Visual Synthesis",
        description: "Analyze charts, diagrams, and screenshots directly within your browser side panel using multimodal AI.",
        icon: Layers,
        className: "md:col-span-2 bg-purple-900/10 border-purple-500/20",
        iconColor: "text-purple-500",
    },
];

export const Features = () => {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            <Container>
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6"
                    >
                        <span className="text-white">Built for pure </span>
                        <span className="text-gradient">Information Synthesis</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-lg text-neutral-400"
                    >
                        Most extensions just manage tabs. Synthesis processes the content inside them.
                        Turn information overload into actionable intelligence.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.02 }}
                            className={`rounded-3xl border p-8 backdrop-blur-sm ${feature.className}`}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6`}>
                                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-neutral-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
