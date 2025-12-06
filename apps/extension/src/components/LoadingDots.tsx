interface LoadingDotsProps {
    text?: string;
    className?: string;
}

/**
 * Animated loading indicator with bouncing dots
 */
export function LoadingDots({ text = 'Analyzing content', className = '' }: LoadingDotsProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="flex items-center gap-1">
                <span
                    className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                    style={{ animationDelay: '0ms', animationDuration: '600ms' }}
                />
                <span
                    className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                    style={{ animationDelay: '150ms', animationDuration: '600ms' }}
                />
                <span
                    className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                    style={{ animationDelay: '300ms', animationDuration: '600ms' }}
                />
            </div>
            <span className="text-sm text-slate-600">{text}</span>
        </div>
    );
}

/**
 * Shimmer skeleton for loading states
 */
export function LoadingSkeleton({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-3 animate-pulse">
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded"
                    style={{
                        width: `${85 - i * 15}%`,
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite'
                    }}
                />
            ))}
        </div>
    );
}
