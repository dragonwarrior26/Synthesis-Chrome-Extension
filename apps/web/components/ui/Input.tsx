import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export const Input = ({ className, error, ...props }: InputProps) => {
    return (
        <input
            className={clsx(
                "w-full rounded-full bg-white/5 border border-white/10 px-6 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-300 backdrop-blur-sm",
                error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20",
                className
            )}
            {...props}
        />
    );
};
