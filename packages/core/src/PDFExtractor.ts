import * as pdfjsLib from 'pdfjs-dist';

// MV3 Compliant: NEVER use CDN fallback
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    try {
        const globalAny = typeof window !== 'undefined' ? window : globalThis;
        const chrome = (globalAny as any).chrome;
        if (chrome && chrome.runtime && chrome.runtime.getURL) {
            // Chrome Extension: use local worker file
            pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdf.worker.min.mjs');
        } else {
            // Non-extension environments: disable worker (runs on main thread, slower but compliant)
            pdfjsLib.GlobalWorkerOptions.workerSrc = '';
        }
    } catch (e) {
        console.warn('Failed to set PDF worker source', e);
        pdfjsLib.GlobalWorkerOptions.workerSrc = '';
    }
}

export const PDFExtractor = {
    /**
     * Checks if the URL looks like a PDF
     */
    isPDF(url: string): boolean {
        return url.toLowerCase().endsWith('.pdf');
    },

    /**
     * Fetches the PDF and extracts text from all pages.
     */
    async extract(source: string | Uint8Array, maxPages = 20): Promise<{ title: string; content: string } | null> {
        console.log(`[PDFExtractor] Starting extraction. API: ${pdfjsLib.version}. Worker: ${pdfjsLib.GlobalWorkerOptions.workerSrc}`);

        try {
            // Header check for Uint8Array inputs to catch corruption early
            if (source instanceof Uint8Array) {
                const head = String.fromCharCode(source[0], source[1], source[2], source[3]);
                console.log(`[PDFExtractor] Binary header: ${head}`);
                if (head !== '%PDF') {
                    throw new Error(`Invalid PDF header: ${head}. The file might be corrupted or not a valid PDF.`);
                }
            }

            const loadingTask = (typeof source === 'string')
                ? pdfjsLib.getDocument(source)
                : pdfjsLib.getDocument({ data: source });

            loadingTask.onPassword = () => {
                console.warn("[PDFExtractor] Password protected PDF detected");
            };

            const pdf = await loadingTask.promise;
            console.log(`[PDFExtractor] PDF loaded successfully. Pages: ${pdf.numPages}`);

            if (pdf.numPages === 0) {
                throw new Error("PDF document contains no pages.");
            }

            let fullText = '';
            const numPages = Math.min(pdf.numPages, maxPages);

            for (let i = 1; i <= numPages; i++) {
                try {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();

                    // Join items with space. Some items in v5 might not have 'str' (TextMarkedContent)
                    const pageText = textContent.items
                        .map((item: any) => item.str || '')
                        .filter((s: string) => s.trim().length > 0)
                        .join(' ');

                    if (pageText.trim().length > 0) {
                        fullText += `[Page ${i}]\n${pageText}\n\n`;
                    }
                } catch (pageErr) {
                    console.error(`[PDFExtractor] Failed to extract page ${i}:`, pageErr);
                }
            }

            const trimmedContent = fullText.trim();
            if (trimmedContent.length === 0) {
                throw new Error("No text content could be extracted from pages. This PDF might be image-based or scanned. Please try OCR if needed.");
            }

            // Metadata (Title)
            let title = 'PDF Document';
            try {
                const metadata = await pdf.getMetadata();
                if (metadata && metadata.info && (metadata.info as any).Title) {
                    title = (metadata.info as any).Title;
                } else if (typeof source === 'string') {
                    const parts = source.split('/').pop()?.split('#')[0].split('?')[0];
                    if (parts) title = decodeURIComponent(parts);
                }
            } catch (e) {
                console.warn('[PDFExtractor] Metadata extraction failed', e);
            }

            return {
                title,
                content: trimmedContent,
            };
        } catch (error) {
            console.error("PDF Extraction Core Error:", error);
            // Re-throw so the calling application (useTabManager) can display the descriptive error
            throw error;
        }
    }
};
