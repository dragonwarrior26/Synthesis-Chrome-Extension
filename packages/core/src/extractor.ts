import { Readability } from '@mozilla/readability'

export interface ExtractedContent {
    title: string
    content: string
    textContent: string
    length: number
    excerpt: string
    byline: string | null
    siteName: string | null
}

import { PDFExtractor } from './PDFExtractor';

export class ContentExtractor {
    /**
     * Extracts readable content from a Document object.
     * @param document The DOM Document to parse.
     * @param url Optional URL of the document (to detect PDF)
     */
    static async extract(document: Document, url?: string): Promise<ExtractedContent | null> {
        // 1. Check if PDF
        if (url && PDFExtractor.isPDF(url)) {
            const pdfData = await PDFExtractor.extract(url);
            if (pdfData) {
                return {
                    title: pdfData.title,
                    content: pdfData.content, // PDF content is plain text usually
                    textContent: pdfData.content,
                    length: pdfData.content.length,
                    excerpt: pdfData.content.substring(0, 200) + '...',
                    byline: null,
                    siteName: 'PDF Document'
                };
            }
        }

        // 2. Fallback to Readability (HTML)
        // Clone to avoid modifying the original DOM if Readability mutates it
        const clone = document.cloneNode(true) as Document
        const reader = new Readability(clone)
        const article = reader.parse()

        if (!article) return null

        return {
            title: article.title ?? '',
            content: article.content ?? '',
            textContent: article.textContent ?? '',
            length: article.length ?? 0,
            excerpt: article.excerpt ?? '',
            byline: article.byline ?? null,
            siteName: article.siteName ?? null,
        }
    }

    /**
     * Cleans the text content by removing excessive whitespace and noise.
     */
    static cleanText(text: string): string {
        return text.replace(/\s+/g, ' ').trim()
    }
}
