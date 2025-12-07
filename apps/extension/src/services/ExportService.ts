import jsPDF from 'jspdf';


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
     * Generates and downloads a PDF file "Synthesis_Report_[Date].pdf"
     */
    static async downloadPDF(messages: ExportMessage[], title: string, url: string) {
        const doc = new jsPDF();

        // -- Header --
        doc.setFontSize(18);
        doc.setTextColor(41, 128, 185); // Blue
        doc.text("Synthesis Research Report", 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Title: ${title.slice(0, 60)}${title.length > 60 ? '...' : ''}`, 14, 30);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);
        doc.text(`Source: ${url.slice(0, 50)}...`, 14, 40);

        doc.setLineWidth(0.5);
        doc.line(14, 45, 196, 45); // Horizontal line

        let yPos = 55;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 14;
        const maxWidth = 180;

        // -- Content Loop --
        messages.forEach((msg) => {
            // Check for new page
            if (yPos > pageHeight - 30) {
                doc.addPage();
                yPos = 20;
            }

            // Role Header
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            if (msg.role === 'user') {
                doc.setTextColor(41, 128, 185); // User Blue
                doc.text("Question:", margin, yPos);
            } else {
                doc.setTextColor(46, 204, 113); // AI Green
                doc.text("Analysis:", margin, yPos);
            }
            yPos += 7;

            // Body Text
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0); // Black

            // Clean markdown slightly for PDF readability (very basic)
            // Note: Real markdown-to-pdf rendering in client-side JS is hard without heavy libs like html2canvas.
            // We will do a simple text wrap for V1.
            const cleanContent = msg.content
                .replace(/\*\*/g, '') // Remove bold markers
                .replace(/##/g, '')   // Remove headers markers
                .replace(/```/g, ''); // Remove code blocks

            const splitText = doc.splitTextToSize(cleanContent, maxWidth);
            doc.text(splitText, margin, yPos);

            // Calculate new Y position
            yPos += (splitText.length * 5) + 10; // 5 units per line + gap
        });

        doc.save(`Synthesis_Report_${Date.now()}.pdf`);
    }
}
