/**
 * Google Search Extractor
 * 
 * Uses Google Custom Search API to search the web and extract content
 * from search results for synthesis.
 */

import { ExtractedContent } from './extractor';

export interface SearchResult {
    title: string;
    link: string;
    snippet: string;
    displayLink: string;
}

export interface GoogleSearchConfig {
    apiKey: string;
    searchEngineId: string; // cx parameter
}

export const GoogleSearchExtractor = {
    /**
     * Search the web using Google Custom Search API
     * 
     * @param query - Search query
     * @param config - API key and Search Engine ID
     * @param numResults - Number of results (max 10 per request)
     * @returns Array of search results
     */
    async search(
        query: string,
        config: GoogleSearchConfig,
        numResults: number = 10
    ): Promise<SearchResult[]> {
        const { apiKey, searchEngineId } = config;

        if (!apiKey || !searchEngineId) {
            throw new Error('Google Search API key and Search Engine ID are required');
        }

        const url = new URL('https://www.googleapis.com/customsearch/v1');
        url.searchParams.set('key', apiKey);
        url.searchParams.set('cx', searchEngineId);
        url.searchParams.set('q', query);
        url.searchParams.set('num', String(Math.min(numResults, 10)));

        const response = await fetch(url.toString());

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(
                error.error?.message || `Google Search failed: ${response.status}`
            );
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            return [];
        }

        return data.items.map((item: any) => ({
            title: item.title || 'Untitled',
            link: item.link,
            snippet: item.snippet || '',
            displayLink: item.displayLink || new URL(item.link).hostname
        }));
    },

    /**
     * Extract content from a search result URL
     * Uses the existing extractor logic
     * 
     * @param url - URL to extract content from
     * @returns Extracted content or null
     */
    async extractFromUrl(url: string): Promise<ExtractedContent | null> {
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; Synthesis/1.0)'
                }
            });

            if (!response.ok) {
                return null;
            }

            const html = await response.text();

            // Basic HTML parsing to extract text content
            const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
            const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

            // Remove scripts, styles, and HTML tags
            let textContent = html
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            // Limit content length
            textContent = textContent.slice(0, 15000);

            return {
                title,
                content: textContent,
                textContent,
                length: textContent.length,
                excerpt: textContent.slice(0, 200) + '...',
                byline: null,
                siteName: new URL(url).hostname
            };
        } catch (error) {
            console.error('Failed to extract content from URL:', url, error);
            return null;
        }
    },

    /**
     * Search and extract content from top results
     * 
     * @param query - Search query
     * @param config - Google API config
     * @param maxResults - Maximum results to extract (default 5)
     * @returns Array of extracted content
     */
    async searchAndExtract(
        query: string,
        config: GoogleSearchConfig,
        maxResults: number = 5
    ): Promise<ExtractedContent[]> {
        const results = await this.search(query, config, maxResults);

        const extractions = await Promise.allSettled(
            results.map(result => this.extractFromUrl(result.link))
        );

        return extractions
            .filter((r): r is PromiseFulfilledResult<ExtractedContent> =>
                r.status === 'fulfilled' && r.value !== null
            )
            .map(r => r.value);
    }
};
