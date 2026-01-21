import { clsx } from "clsx";

export const Container = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={clsx("max-w-7xl mx-auto px-6 md:px-12", className)}>
            {children}
        </div>
    );
};
