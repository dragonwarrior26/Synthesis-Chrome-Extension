"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Check, Loader2, ArrowRight } from "lucide-react";

export const WaitlistForm = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
        "idle"
    );
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");

        // TODO: Connect to Supabase later
        // For now, simulate API call
        setTimeout(() => {
            console.log("Waitlist submission:", email);
            setStatus("success");
            setMessage("You're on the list! We'll be in touch.");
            setEmail("");
        }, 1500);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <AnimatePresence mode="wait">
                {status === "success" ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center gap-3 rounded-2xl bg-white/10 p-4 text-green-400 backdrop-blur-md border border-white/10"
                    >
                        <Check className="h-5 w-5" />
                        <span className="font-medium">{message}</span>
                    </motion.div>
                ) : (
                    <motion.form
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={handleSubmit}
                        className="relative flex flex-col gap-3 sm:flex-row"
                    >
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === "loading"}
                            required
                            className="flex-1"
                        />
                        <Button
                            type="submit"
                            disabled={status === "loading"}
                            className="group sm:w-auto"
                        >
                            {status === "loading" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Join Waitlist
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            )}
                        </Button>
                    </motion.form>
                )}
            </AnimatePresence>
            <p className="mt-4 text-center text-xs text-neutral-500">
                Be the first to know when we launch.
            </p>
        </div>
    );
};
