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
        GeminiService: class { constructor() { } },
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

describe('Integration: Full Data Flow Verification', () => {
    beforeEach(() => {
        global.fetch = mockFetch;
        vi.clearAllMocks();
        (TierService.getCurrentTier as any).mockResolvedValue('free');
    });

    afterEach(() => {
        global.fetch = globalFetch;
    });

    it('should include FULL YouTube transcript and Article in the prompt', async () => {
        // Simulate actual content sizes (YouTube ~5000 chars, Article ~8000 chars)
        const youtubeTranscript = `
        MEA spokesperson Randhir Jaiswal clarified India's position on Russian oil imports.
        He stated that India continues to purchase Russian oil primarily for energy security reasons.
        The discounted prices offered by Russia have been beneficial for India's economy.
        India has consistently maintained that its oil imports are driven by national interest.
        Jaiswal emphasized that India's foreign policy is independent and not influenced by external pressures.
        The spokesperson reiterated that India will continue to engage with all nations based on its strategic interests.
        When asked about Western concerns, Jaiswal noted that India has been transparent about its trade relationships.
        He pointed out that several European nations continue to have trade ties with Russia.
        The MEA maintains that energy imports are a sovereign decision of each country.
        `.repeat(10); // ~5000 chars

        const articleContent = `
        India-U.S. trade deal LIVE updates: Indian goods will attract zero reciprocal tariff in U.S.
        Union Commerce Minister Piyush Goyal announced the interim trade agreement details.
        Key highlights include zero tariffs on gems, diamonds, pharmaceuticals, and smartphones.
        Agricultural products like spices will also benefit from reduced tariffs.
        The deal protects sensitive items including meat, poultry, and dairy to safeguard Indian farmers.
        Goyal emphasized that this agreement represents a significant milestone in bilateral relations.
        The trade deal is expected to boost Indian exports to the United States significantly.
        Both nations agreed to continue negotiations for a comprehensive trade agreement.
        `.repeat(15); // ~8000 chars

        const inputs = [
            {
                title: 'Will India stop buying Russian Oil? MEA spokesperson Randhir Jaiswal responds',
                content: youtubeTranscript,
                length: youtubeTranscript.length,
                textContent: youtubeTranscript,
                siteName: 'YouTube',
                excerpt: 'MEA spokesperson clarifies...',
                byline: 'ANI News'
            },
            {
                title: 'India-U.S. trade deal LIVE updates: Indian goods will attract zero reciprocal tariff',
                content: articleContent,
                length: articleContent.length,
                textContent: articleContent,
                siteName: 'The Hindu',
                excerpt: 'Piyush Goyal announces...',
                byline: 'The Hindu Bureau'
            }
        ];

        // Mock successful response
        const mockStream = new ReadableStream({ start(c) { c.close(); } });
        mockFetch.mockResolvedValue({ ok: true, body: mockStream });

        // Execute
        const generator = GeminiService.synthesizeStream(inputs, "What about Russian Oil?");
        for await (const _ of generator) { }

        // Verify fetch was called
        expect(mockFetch).toHaveBeenCalledTimes(1);

        // Get the prompt that was sent
        const callArgs = mockFetch.mock.calls[0];
        const body = JSON.parse(callArgs[1].body);
        const prompt = body.prompt;

        // Log prompt for debugging (this will show in test output)
        console.log('=== PROMPT LENGTH:', prompt.length, '===');
        console.log('=== YOUTUBE CHECK:', prompt.includes('Russian oil'), '===');
        console.log('=== ARTICLE CHECK:', prompt.includes('Piyush Goyal'), '===');
        console.log('=== FULL PROMPT PREVIEW ===');
        console.log(prompt.substring(0, 2000));
        console.log('=== END PREVIEW ===');

        // Critical assertions
        expect(prompt.length).toBeGreaterThan(10000); // Should be much larger than old 10k limit

        // Must contain YouTube content
        expect(prompt).toContain('MEA spokesperson Randhir Jaiswal');
        expect(prompt).toContain('Russian oil');
        expect(prompt).toContain('energy security');

        // Must contain Article content
        expect(prompt).toContain('Piyush Goyal');
        expect(prompt).toContain('zero tariffs');

        // Must have proper structure
        expect(prompt).toContain('<Source id="1" type="YouTube"');
        expect(prompt).toContain('<Source id="2" type="Web"');
        expect(prompt).toContain('<![CDATA[');
        expect(prompt).toContain('Available Sources:');
    });
});
