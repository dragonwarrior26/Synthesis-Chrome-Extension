"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Container } from "./ui/Container";
import { PlatformButton } from "./ui/PlatformButton";
import { WaitlistForm } from "./WaitlistForm";
import { Carousel } from "./Carousel";

export const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={containerRef} className="relative min-h-[150vh] flex flex-col">
            {/* Background Elements */}
            <div className="fixed inset-0 bg-grid-small opacity-20 pointer-events-none -z-10" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden pt-20 pb-16">
                <Container className="relative z-10">
                    <motion.div style={{ y, opacity }} className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur-md mb-8"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2" />
                            Now available in Early Access
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
                        >
                            <span className="block text-white">Research at the</span>
                            <span className="block text-gradient">Speed of Thought</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="max-w-2xl text-lg md:text-xl text-neutral-400 mb-10 leading-relaxed"
                        >
                            Organize tabs, extract content, and sync your research with AI-powered synthesis.
                            The intelligent manager that evolves with your workflow.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col items-center gap-8 w-full mb-16"
                        >
                            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                                <PlatformButton platform="chrome" href="https://chromewebstore.google.com/detail/kipmpmfnhahfeggkbfjoedpbdecpojef?utm_source=item-share-cb" />
                                <PlatformButton platform="safari" disabled />
                            </div>

                            <div className="flex flex-col items-center gap-2 w-full max-w-md">
                                <div className="flex items-center gap-4 w-full">
                                    <div className="h-[1px] bg-white/10 flex-1" />
                                    <span className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">or get early access</span>
                                    <div className="h-[1px] bg-white/10 flex-1" />
                                </div>
                                <WaitlistForm />
                            </div>
                        </motion.div>
                    </motion.div>
                </Container>
            </div>

            <div className="relative z-20 bg-black pt-24 pb-24 border-t border-white/10">
                <Container>
                    <Carousel />
                </Container>
            </div>
        </section>
    );
};
