import { clsx } from "clsx";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline";
    children: React.ReactNode;
}

export const Button = ({
    variant = "primary",
    children,
    className,
    ...props
}: ButtonProps) => {
    const baseStyles =
        "inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary:
            "bg-white text-black hover:bg-gray-200 focus:ring-white border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]",
        secondary:
            "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/10",
        outline:
            "bg-transparent text-white border border-white/20 hover:bg-white/5",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={clsx(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </motion.button>
    );
};
