import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS

interface MarkdownRendererProps {
    content: string;
    className?: string;
    isStreaming?: boolean;
}

/**
 * Renders markdown content as formatted HTML using react-markdown.
 * Supports: bold, headings, lists, tables, paragraphs, and LaTeX math.
 */
export function MarkdownRenderer({ content, className = '', isStreaming = false }: MarkdownRendererProps) {
    if (!content) return null;

    // Aggressive content sanitization to prevent ghost space
    const processedContent = content
        // Remove any trailing whitespace/newlines first
        .replace(/[\s\n\r]+$/, '')
        // Remove leading whitespace
        .replace(/^[\s\n\r]+/, '')
        // Collapse 3+ newlines to 2
        .replace(/\n{3,}/g, '\n\n')
        // Remove empty lines at the end (lines with only whitespace)
        .replace(/(\n\s*)+$/, '')
        // Remove trailing whitespace on each line
        .split('\n').map(line => line.trimEnd()).join('\n')
        // Final trim
        .trim();

    return (
        <div className={`markdown-body font-medium text-slate-300 leading-relaxed ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    // Override components for custom styling
                    h1: ({ className, ...props }: React.ComponentPropsWithoutRef<'h1'> & { node?: any }) => <h1 className={`text-lg font-bold text-slate-50 mt-5 first:mt-0 mb-2 ${className || ''}`} {...props} />,
                    h2: ({ className, ...props }: React.ComponentPropsWithoutRef<'h2'> & { node?: any }) => <h2 className={`text-base font-bold text-slate-100 mt-5 first:mt-0 mb-2 pb-1 border-b border-slate-700 ${className || ''}`} {...props} />,
                    h3: ({ className, ...props }: React.ComponentPropsWithoutRef<'h3'> & { node?: any }) => <h3 className={`text-sm font-bold text-slate-200 mt-4 first:mt-0 mb-2 ${className || ''}`} {...props} />,
                    p: ({ className, children, ...props }: React.ComponentPropsWithoutRef<'p'> & { node?: any }) => {
                        // Collapse empty paragraphs
                        if (!children) return null;
                        if (Array.isArray(children) && children.every(c => c === null || c === undefined || (typeof c === 'string' && c.trim() === ''))) {
                            return null;
                        }
                        return <p className={`mb-3 last:mb-0 ${className || ''}`} {...props}>{children}</p>;
                    },
                    ul: ({ className, ...props }: React.ComponentPropsWithoutRef<'ul'> & { node?: any }) => <ul className={`list-disc list-outside ml-5 space-y-1 my-3 ${className || ''}`} {...props} />,
                    ol: ({ className, ...props }: React.ComponentPropsWithoutRef<'ol'> & { node?: any }) => <ol className={`list-decimal list-outside ml-5 space-y-1 my-3 ${className || ''}`} {...props} />,
                    li: ({ className, ...props }: React.ComponentPropsWithoutRef<'li'> & { node?: any }) => <li className={`pl-1 ${className || ''}`} {...props} />,
                    table: ({ className, ...props }: React.ComponentPropsWithoutRef<'table'> & { node?: any }) => (
                        <div className="my-4 overflow-x-auto rounded-lg border border-slate-700 shadow-sm bg-slate-900/50">
                            <table className={`w-full text-sm text-left ${className || ''}`} {...props} />
                        </div>
                    ),
                    thead: ({ className, ...props }: React.ComponentPropsWithoutRef<'thead'> & { node?: any }) => <thead className={`bg-slate-800/80 uppercase text-xs font-bold text-slate-400 ${className || ''}`} {...props} />,
                    th: ({ className, ...props }: React.ComponentPropsWithoutRef<'th'> & { node?: any }) => <th className={`px-4 py-3 border-b border-slate-700 ${className || ''}`} {...props} />,
                    td: ({ className, ...props }: React.ComponentPropsWithoutRef<'td'> & { node?: any }) => <td className={`px-4 py-3 text-slate-300 border-b border-slate-800/50 ${className || ''}`} {...props} />,
                    blockquote: ({ className, ...props }: React.ComponentPropsWithoutRef<'blockquote'> & { node?: any }) => (
                        <blockquote className={`border-l-4 border-blue-500 pl-4 py-1 my-4 bg-slate-800/30 rounded-r-lg italic text-slate-400 ${className || ''}`} {...props} />
                    ),
                    a: ({ className, ...props }: React.ComponentPropsWithoutRef<'a'> & { node?: any }) => <a className={`text-blue-400 hover:text-blue-300 underline ${className || ''}`} {...props} />,
                    hr: () => <hr className="my-4 border-slate-700" />,
                    code: ({ className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match && !String(children).includes('\n');
                        return isInline ? (
                            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-emerald-400" {...props}>{children}</code>
                        ) : (
                            <code className="block bg-slate-950 p-3 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto my-2 border border-slate-800" {...props}>{children}</code>
                        );
                    },
                }}
            >
                {processedContent}
            </ReactMarkdown>
            {
                isStreaming && (
                    <span className="inline-block w-2 h-4 align-middle ml-1 bg-blue-500 animate-pulse rounded-sm" />
                )
            }
        </div>
    );
}
