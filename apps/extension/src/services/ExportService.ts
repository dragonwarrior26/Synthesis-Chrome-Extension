

export interface ExportMessage {
    role: 'user' | 'assistant';
    content: string;
}

export class ExportService {
    /**
     * Generates a clean Markdown string from the chat history.
     */
    static generateMarkdown(messages: ExportMessage[], title: string, url: string): string {
        const date = new Date().toLocaleDateString();
        let md = `# Research Report: ${title}\n`;
        md += `**Date:** ${date}\n`;
        md += `**Source:** ${url}\n\n`;
        md += `---\n\n`;

        messages.forEach(msg => {
            const role = msg.role === 'user' ? '❓ User' : '🤖 Synthesis';
            md += `### ${role}\n\n`;
            md += `${msg.content}\n\n`;
            md += `---\n\n`;
        });

        return md;
    }

    /**
     * Parsing helper: Converts synthesis-style Markdown to HTML strings.
     * Supports: Headers (##), Tables (|...|), Lists (*), Bold (**).
     */
    private static parseMarkdown(text: string): string {
        const lines = text.split('\n');
        let html = '';
        let inTable = false;
        let inList = false;

        lines.forEach((line, index) => {
            const trimmed = line.trim();

            // Tables
            if (trimmed.startsWith('|')) {
                const isSeparator = trimmed.includes('---');
                if (!inTable) {
                    html += '<div class="table-container"><table>';
                    inTable = true;
                }

                if (isSeparator) return; // Skip separator line

                const cells = trimmed.split('|').map(c => c.trim()).filter(c => c.length > 0 || trimmed.endsWith('|'));
                const cleanCells = cells.filter(c => c !== '');

                html += '<tr>';
                cleanCells.forEach((cell) => {
                    const nextLine = lines[index + 1]?.trim();
                    const isNextSeparator = nextLine?.startsWith('|') && nextLine?.includes('---');

                    if (isNextSeparator) {
                        html += `<th>${ExportService.formatInline(cell)}</th>`;
                    } else {
                        html += `<td>${ExportService.formatInline(cell)}</td>`;
                    }
                });
                html += '</tr>';

                return;
            } else if (inTable) {
                html += '</table></div>';
                inTable = false;
            }

            // Lists
            if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                if (!inList) {
                    html += '<ul>';
                    inList = true;
                }
                html += `<li>${ExportService.formatInline(trimmed.substring(2))}</li>`;
                return;
            } else if (inList) {
                html += '</ul>';
                inList = false;
            }

            // Headers
            if (trimmed.startsWith('## ')) {
                html += `<h2>${ExportService.formatInline(trimmed.substring(3))}</h2>`;
                return;
            }
            if (trimmed.startsWith('### ')) {
                html += `<h3>${ExportService.formatInline(trimmed.substring(4))}</h3>`;
                return;
            }

            // Paragraphs (ignore empty lines)
            if (trimmed.length > 0) {
                html += `<p>${ExportService.formatInline(trimmed)}</p>`;
            }
        });

        if (inTable) html += '</table></div>';
        if (inList) html += '</ul>';

        return html;
    }

    private static formatInline(text: string): string {
        return text
            .replace(/\$\$(.*?)\$\$/g, (_, math) => `<div class="math-block">${ExportService.convertLatexToReadable(math)}</div>`)
            .replace(/\$(.*?)\$/g, (_, math) => `<span class="math-inline">${ExportService.convertLatexToReadable(math)}</span>`)
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
    }

    private static convertLatexToReadable(latex: string): string {
        return latex
            .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
            .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
            .replace(/(\w)_\{([^}]+)\}/g, '$1_$2')
            .replace(/(\w)_(\w)/g, '$1_$2')
            .replace(/\^2(?![0-9])/g, '²')
            .replace(/\^3(?![0-9])/g, '³')
            .replace(/\^\{([^}]+)\}/g, '^($1)')
            .replace(/\^(\w)/g, '^$1')
            .replace(/\\alpha/g, 'α')
            .replace(/\\beta/g, 'β')
            .replace(/\\gamma/g, 'γ')
            .replace(/\\delta/g, 'δ')
            .replace(/\\epsilon/g, 'ε')
            .replace(/\\theta/g, 'θ')
            .replace(/\\lambda/g, 'λ')
            .replace(/\\mu/g, 'μ')
            .replace(/\\pi/g, 'π')
            .replace(/\\sigma/g, 'σ')
            .replace(/\\omega/g, 'ω')
            .replace(/\\times/g, '×')
            .replace(/\\cdot/g, '·')
            .replace(/\\div/g, '÷')
            .replace(/\\pm/g, '±')
            .replace(/\\leq/g, '≤')
            .replace(/\\geq/g, '≥')
            .replace(/\\neq/g, '≠')
            .replace(/\\approx/g, '≈')
            .replace(/\\infty/g, '∞')
            .replace(/\\sum/g, 'Σ')
            .replace(/\\prod/g, 'Π')
            .replace(/\\int/g, '∫')
            .replace(/\\log/g, 'log')
            .replace(/\\ln/g, 'ln')
            .replace(/\\sin/g, 'sin')
            .replace(/\\cos/g, 'cos')
            .replace(/\\tan/g, 'tan')
            .replace(/\\exp/g, 'exp')
            .replace(/\\max/g, 'max')
            .replace(/\\min/g, 'min')
            .replace(/\\lim/g, 'lim')
            .replace(/\\text\{([^}]+)\}/g, '$1')
            .replace(/\\mathrm\{([^}]+)\}/g, '$1')
            .replace(/\\mathbf\{([^}]+)\}/g, '$1')
            .replace(/\\([a-zA-Z]+)/g, '$1')
            .replace(/\{([^{}]+)\}/g, '$1')
            .trim();
    }

    /**
     * Downloads the report as a PDF file using browser's native print-to-PDF.
     * Opens a print-friendly window where the user can select "Save as PDF".
     */
    static async downloadPDF(messages: ExportMessage[], title: string, url: string) {
        // Use browser's native print dialog with "Save as PDF" option
        ExportService.printReport(messages, title, url);
    }

    /**
     * Opens a print-friendly window with the chat report.
     */
    static printReport(messages: ExportMessage[], title: string, url: string) {
        const date = new Date().toLocaleDateString();
        const validMessages = messages.filter(m => m.content && !m.content.startsWith('**Error**'));

        const htmlContent = validMessages.map(msg => {
            const roleClass = msg.role === 'user' ? 'role-user' : 'role-ai';
            const roleName = msg.role === 'user' ? 'Question' : 'Analysis';
            return `
                <div class="message ${roleClass}">
                    <div class="role-label">${roleName}</div>
                    <div class="content">${ExportService.parseMarkdown(msg.content)}</div>
                </div>
            `;
        }).join('');

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Please allow popups to print the report.');
            return;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Synthesis Report - ${title}</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #333; line-height: 1.6; }
                    h1 { color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                    .meta { color: #7f8c8d; font-size: 0.9em; margin-bottom: 30px; }
                    .role-label { font-weight: bold; font-size: 0.8em; text-transform: uppercase; margin-bottom: 5px; color: #95a5a6; }
                    .role-user .role-label { color: #3498db; }
                    .role-ai .role-label { color: #27ae60; }
                    .message { margin-bottom: 30px; }
                    
                    /* Markdown Styles */
                    h2 { margin-top: 20px; font-size: 1.2em; color: #2c3e50; }
                    ul { padding-left: 20px; }
                    li { margin-bottom: 5px; }
                    p { margin-bottom: 10px; }
                    strong { color: #2c3e50; }
                    
                    /* Table Styles */
                    .table-container { margin: 15px 0; overflow-x: auto; }
                    table { border-collapse: collapse; width: 100%; border: 1px solid #e0e0e0; font-size: 0.9em; }
                    th { background: #f8f9fa; text-align: left; font-weight: 600; }
                    th, td { padding: 10px 15px; border-bottom: 1px solid #e0e0e0; }
                    tr:last-child td { border-bottom: none; }
                    
                    /* Math styling for PDF */
                    .math-inline { font-style: italic; font-family: "Times New Roman", serif; }
                    .math-block { display: block; text-align: center; font-style: italic; font-family: "Times New Roman", serif; margin: 10px 0; }
                    
                    @media print {
                        body { padding: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <h1>Synthesis Research Report</h1>
                <div class="meta">
                    <strong>Title:</strong> ${title}<br>
                    <strong>Source:</strong> ${url}<br>
                    <strong>Date:</strong> ${date}
                </div>
                ${htmlContent}
                <script>
                    window.onload = () => { window.print(); }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }
}
