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

export class ContentExtractor {
    /**
     * Extracts readable content from a Document object.
     * @param document The DOM Document to parse.
     */
    static extract(document: Document): ExtractedContent | null {
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
