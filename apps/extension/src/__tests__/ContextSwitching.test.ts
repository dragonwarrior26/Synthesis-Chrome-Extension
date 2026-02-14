
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GeminiService } from '../services/GeminiService';
import { TierService } from '../services/TierService';

// Mock dependencies
vi.mock('../services/TierService', () => ({
    TierService: {
        getCurrentTier: vi.fn(),
        getStoredApiKey: vi.fn()
    }
}));

vi.mock('../lib/supabase', () => ({
    supabase: {
        auth: { getSession: () => ({ data: { session: null } }) }
    }
}));

vi.mock('@synthesis/core', async () => {
    return {
        GeminiService: class {
            constructor() { }
            synthesizeStream() { return (async function* () { yield 'mock'; })(); }
        },
        // Mock other exports if needed
        PDFExtractor: {}
    };
});

vi.mock('../services/LoggingService', () => ({
    logger: {
        info: vi.fn(),
        error: vi.fn(),
        debug: vi.fn()
    }
}));

const globalFetch = global.fetch;
const mockFetch = vi.fn();

describe('Context Switching & Hallucination Fix', () => {
    beforeEach(() => {
        global.fetch = mockFetch;
        vi.clearAllMocks();
        (TierService.getCurrentTier as any).mockResolvedValue('free');
    });

    afterEach(() => {
        global.fetch = globalFetch;
    });

    it('should clearly delineate sources in the prompt', async () => {
        const mockStream = new ReadableStream({ start(c) { c.close(); } });
        mockFetch.mockResolvedValue({ ok: true, body: mockStream });

        const inputs = [
            {
                title: 'YouTube Video',
                content: 'This is a video transcript about Russian Oil.',
                length: 100,
                textContent: '',
                siteName: 'YouTube',
                excerpt: '',
                byline: ''
            },
            {
                title: 'News Article',
                content: 'This is an article about US Trade Deal.',
                length: 100,
                textContent: '',
                siteName: 'The Hindu',
                excerpt: '',
                byline: ''
            }
        ];

        const generator = GeminiService.synthesizeStream(inputs, "What about Russian Oil?");
        for await (const _ of generator) { }

        const callArgs = mockFetch.mock.calls[0];
        const body = JSON.parse(callArgs[1].body);
        const prompt = body.prompt;
        console.log('GENERATED PROMPT:', prompt);

        // Verify XML-style tags or clear headers are used
        expect(prompt).toContain('<Source id="1" type="YouTube" title="YouTube Video">');
        expect(prompt).toContain('<Source id="2" type="Web" title="News Article">');

        // Verify content is preserved
        expect(prompt).toContain('<![CDATA[');
        expect(prompt).toContain('This is a video transcript about Russian Oil.');
        expect(prompt).toContain(']]>');

    });
});
