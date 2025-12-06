import React from 'react';

interface MarkdownRendererProps {
    content: string;
    className?: string;
    isStreaming?: boolean;
}

/**
 * Renders markdown content as formatted HTML
 * Supports: bold, headings, lists, tables, paragraphs
 */
export function MarkdownRenderer({ content, className = '', isStreaming = false }: MarkdownRendererProps) {
    if (!content) return null;

    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // Skip empty lines
        if (!trimmedLine) {
            i++;
            continue;
        }

        // Check for table (starts with |)
        if (trimmedLine.startsWith('|')) {
            const tableLines: string[] = [];
            while (i < lines.length && lines[i].trim().startsWith('|')) {
                tableLines.push(lines[i].trim());
                i++;
            }
            elements.push(renderTable(tableLines, key++));
            continue;
        }

        if (trimmedLine.startsWith('### ')) {
            elements.push(
                <h3 key={key++} className="text-sm font-bold text-slate-200 mt-4 mb-2">
                    {trimmedLine.slice(4)}
                </h3>
            );
            i++;
            continue;
        }

        // Check for headings
        if (trimmedLine.startsWith('## ')) {
            elements.push(
                <h2 key={key++} className="text-base font-bold text-slate-100 mt-5 mb-2 pb-1 border-b border-slate-700">
                    {trimmedLine.slice(3)}
                </h2>
            );
            i++;
            continue;
        }

        if (trimmedLine.startsWith('# ')) {
            elements.push(
                <h1 key={key++} className="text-lg font-bold text-slate-50 mt-5 mb-2">
                    {trimmedLine.slice(2)}
                </h1>
            );
            i++;
            continue;
        }

        // Check for bullet lists (- or *)
        if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
            const items: string[] = [];
            while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
                const itemText = lines[i].trim().slice(2);
                items.push(itemText);
                i++;
            }
            elements.push(
                <ul key={key++} className="space-y-1.5 my-3 ml-1">
                    {items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                            <span>{renderInline(item)}</span>
                        </li>
                    ))}
                </ul>
            );
            continue;
        }

        // Check for numbered lists
        if (/^\d+\.\s/.test(trimmedLine)) {
            const items: string[] = [];
            while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
                const itemText = lines[i].trim().replace(/^\d+\.\s/, '');
                items.push(itemText);
                i++;
            }
            elements.push(
                <ol key={key++} className="space-y-1.5 my-3 ml-1 list-decimal list-inside text-slate-300">
                    {items.map((item, idx) => (
                        <li key={idx} className="text-slate-300">
                            {renderInline(item)}
                        </li>
                    ))}
                </ol>
            );
            continue;
        }

        // Regular paragraph
        elements.push(
            <p key={key++} className="text-slate-300 leading-relaxed mb-3">
                {renderInline(trimmedLine)}
            </p>
        );
        i++;
    }

    return (
        <div className={`space-y-3 font-medium ${className}`}>
            {elements}
            {isStreaming && (
                <span className="inline-block w-2 h-4 align-middle ml-1 bg-blue-500 animate-pulse rounded-sm" />
            )}
        </div>
    );
}

// Render markdown table
function renderTable(lines: string[], key: number): React.ReactNode {
    if (lines.length < 2) return null;

    const parseRow = (line: string): string[] => {
        return line
            .split('|')
            .slice(1, -1) // Remove empty first and last
            .map(cell => cell.trim());
    };

    const headers = parseRow(lines[0]);

    // Skip separator line (|---|---|)
    const dataLines = lines.slice(2);
    const rows = dataLines.map(line => parseRow(line));

    return (
        <div key={key} className="my-4 overflow-x-auto rounded-lg border border-slate-700 shadow-sm bg-slate-900/50">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-800/80 uppercase text-xs font-bold text-slate-400">
                    <tr>
                        {headers.map((header, i) => (
                            <th key={i} className="px-4 py-3 border-b border-slate-700">
                                {renderInline(header)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-slate-800/30 transition-colors">
                            {row.map((cell, cellIdx) => (
                                <td key={cellIdx} className="px-4 py-3 text-slate-300">
                                    {renderInline(cell)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Render inline formatting (bold, italic)
function renderInline(text: string): React.ReactNode {
    // Split by bold markers **text**
    const parts = text.split(/(\*\*[^*]+\*\*)/g);

    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={i} className="font-bold text-slate-100">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        return part;
    });
}
