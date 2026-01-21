"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const items = [
    {
        label: "Webpage Extraction",
        description: "Extract clean text from any article instantly.",
        bg: "bg-blue-900/20"
    },
    {
        label: "PDF Analysis",
        description: "Chat with PDFs and summarize long documents.",
        bg: "bg-orange-900/20"
    },
    {
        label: "YouTube Intelligence",
        description: "Get summaries and insights without watching.",
        bg: "bg-red-900/20"
    },
    {
        label: "Visual Synthesis",
        description: "Analyze images and diagrams with AI vision.",
        bg: "bg-purple-900/20"
    },
    {
        label: "Deep Research",
        description: "Connect multiple sources to answer complex questions.",
        bg: "bg-indigo-900/20"
    },
    {
        label: "Smart Notes",
        description: "Capture thoughts and AI insights in a dedicated workspace.",
        bg: "bg-teal-900/20"
    },
    {
        label: "Cloud Sync",
        description: "Sync your research & notes across all your devices.",
        bg: "bg-emerald-900/20"
    },
    {
        label: "Privacy First",
        description: "Your data stays local. Zero server retention.",
        bg: "bg-neutral-800/50"
    },
];

export const Carousel = () => {
    const [width, setWidth] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const controls = useAnimationControls();
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (carouselRef.current) {
            setWidth(carouselRef.current.scrollWidth / 2);
        }
    }, []);

    useEffect(() => {
        if (!isHovered && width > 0) {
            controls.start({
                x: -width,
                transition: {
                    duration: 40,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "loop"
                }
            });
        } else {
            controls.stop();
        }
    }, [isHovered, width, controls]);

    // Duplicate items for infinite scroll effect
    const displayItems = [...items, ...items];

    return (
        <div className="w-full overflow-hidden py-12">
            <div className="text-center mb-12">
                <h2 className="text-2xl font-bold mb-2">See Synthesis in Action</h2>
                <p className="text-neutral-400 text-sm">Powerful features giving you research superpowers.</p>
            </div>

            <motion.div
                ref={carouselRef}
                className="cursor-grab active:cursor-grabbing overflow-hidden"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <motion.div
                    animate={controls}
                    className="flex gap-6 px-4 w-max"
                >
                    {displayItems.map((item, idx) => (
                        <motion.div
                            key={idx}
                            className={`relative min-w-[300px] md:min-w-[400px] aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 ${item.bg}`}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/40 backdrop-blur-sm z-10 hover:bg-black/60 transition-colors">
                                <h3 className="text-2xl font-bold text-white mb-2">{item.label}</h3>
                                <p className="text-neutral-200">{item.description}</p>
                            </div>

                            {/* Placeholder for actual image/GIF */}
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-white/20 text-4xl font-bold">{idx % items.length + 1}</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};
