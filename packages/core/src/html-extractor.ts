import { JSDOM } from 'jsdom'
import { ContentExtractor, ExtractedContent } from './extractor'

export class HtmlExtractor {
    /**
     * Extracts readable content from an HTML string using JSDOM.
     * @param html The raw HTML string.
     * @param url The URL of the page (for resolving relative links).
     */
    static extract(html: string, url: string): ExtractedContent | null {
        const doc = new JSDOM(html, { url }).window.document
        return ContentExtractor.extract(doc)
    }
}
