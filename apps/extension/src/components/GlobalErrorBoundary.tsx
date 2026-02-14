import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logger } from '../services/LoggingService';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log to our robust LoggingService
        logger.fatal('Uncaught React Render Error', {
            error,
            componentStack: errorInfo.componentStack
        });
    }

    private handleCopyError = () => {
        const errorData = JSON.stringify({
            message: this.state.error?.message,
            stack: this.state.error?.stack,
            logs: logger.getLogs().slice(-5) // Include last 5 logs for context
        });

        // Encode base64 for easy sharing
        const encoded = btoa(errorData);
        navigator.clipboard.writeText(encoded);
        alert('Error code copied to clipboard. Please send this to support.');
    };

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-neutral-900 text-white text-center">
                    <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h2>
                        <p className="text-neutral-400 mb-6 text-sm">
                            Critical error in the UI renderer. We've logged this issue.
                        </p>

                        <div className="bg-black/30 rounded p-3 mb-6 text-left overflow-auto max-h-32 text-xs font-mono text-red-300">
                            {this.state.error?.message}
                        </div>

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleCopyError}
                                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm font-medium transition-colors"
                            >
                                Copy Error Code
                            </button>
                            <button
                                onClick={this.handleReset}
                                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium transition-colors"
                            >
                                Reload App
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
