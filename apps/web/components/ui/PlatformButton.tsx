import { clsx } from "clsx";
import { motion } from "framer-motion";
import { Chrome, Compass } from "lucide-react";
import Link from "next/link";

interface PlatformButtonProps {
    platform: "chrome" | "safari";
    href?: string;
    disabled?: boolean;
}

export const PlatformButton = ({
    platform,
    href = "#",
    disabled = false,
}: PlatformButtonProps) => {
    const isChrome = platform === "chrome";
    const Icon = isChrome ? Chrome : Compass;
    const label = isChrome ? "Add to Chrome" : "Safari Extension";
    const status = isChrome ? "Free Download" : "Coming Soon";

    const Content = () => (
        <div className="flex flex-col items-start text-left">
            <span className="text-sm font-semibold text-white">{label}</span>
            <span className="text-xs text-neutral-400">{status}</span>
        </div>
    );

    const containerClasses = clsx(
        "relative flex items-center gap-4 rounded-2xl border px-6 py-4 transition-all duration-300 w-full md:w-64",
        disabled
            ? "bg-white/5 border-white/5 cursor-not-allowed opacity-50 grayscale"
            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md cursor-pointer"
    );

    if (disabled) {
        return (
            <div className={containerClasses}>
                <div className="rounded-full bg-white/10 p-3">
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <Content />
            </div>
        );
    }

    return (
        <Link href={href} className="block group no-underline text-white">
            <motion.div
                whileHover={{ y: -2 }}

                whileTap={{ scale: 0.98 }}
                className={containerClasses}
            >
                <div className="rounded-full bg-white/10 p-3 transition-colors group-hover:bg-white/20">
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <Content />
            </motion.div>
        </Link>
    );
};
