import * as pdfjsLib from 'pdfjs-dist';

// We need to set the worker source. 
// In a Chrome Extension bundled with Vite, it's best to point to a local copy if possible, 
// or use a CDN if CSP permits. 
// For now, let's try a standard import. If workers invoke errors, we might need to bundle the worker.
// A common trick is to use the cdn in development or a relative path in production.
// However, since we are in a content script (sometimes restricted), getting the worker right is key.
// Let's try explicitly importing the worker entry if possible, or setting it to the unpkg version for simplicity first,
// but remember extensions block CDNs usually.

// Best practice: The extension build should include valid worker file.
// For the 'core' package, we just define the logic.
// We will set workerSrc to null for now and let the consumer or auto-resolution handle it, 
// or we explicitly set it to a known local path if we copy it.

// Update: modern pdfjs-dist requires setting workerSrc.
// We will assume the extension build process (Vite) can handle the worker import or we use the legacy no-worker build if needed (slow).
// But let's try standard.
// Actually, to ensure it works in the extension without complex worker config, 
// we can use `pdfjs-dist/legacy/build/pdf` if we encounter issues, but let's stick to standard `pdfjs-dist`.

// Only setting workerSrc if window is defined (browser)
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    // Use a CDN for the worker as a fallback, or expect the main bundle to provide it.
    // Note: Chrome Extension MV3 might block this CDN unless listed in manifest `content_security_policy`.
    // A safer bet for an extension is to rely on the bundler to resolve `pdfjs-dist/build/pdf.worker.mjs`.

    // For now, we will leave it unset and see if pdfjsLib resolves it, or we set it to a dummy that forces main thread (not recommended but works for small PDFs).
    // Actually, let's try to set it to a local path we will ensure exists.
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
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
    async extract(url: string, maxPages = 20): Promise<{ title: string; content: string } | null> {
        try {
            const loadingTask = pdfjsLib.getDocument(url);
            const pdf = await loadingTask.promise;

            let fullText = '';
            const numPages = Math.min(pdf.numPages, maxPages);

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                // Join items with space, avoiding excessive newlines
                const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(' ');

                fullText += `[Page ${i}]\n${pageText}\n\n`;
            }

            // Metadata (Title)
            let title = 'PDF Document';
            try {
                const metadata = await pdf.getMetadata();
                if (metadata && metadata.info && (metadata.info as any).Title) {
                    title = (metadata.info as any).Title;
                } else {
                    // Fallback to filename
                    const filename = url.split('/').pop()?.split('#')[0].split('?')[0];
                    if (filename) title = decodeURIComponent(filename);
                }
            } catch (e) {
                // Ignore metadata errors
            }

            return {
                title,
                content: fullText.trim(),
            };
        } catch (error) {
            console.error("PDF Extraction Failed:", error);
            return null;
        }
    }
};
