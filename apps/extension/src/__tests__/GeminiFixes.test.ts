
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GeminiService } from '../services/GeminiService';
import { TierService } from '../services/TierService';

// Mock Dependencies
vi.mock('../services/TierService', () => ({
    TierService: {
        getCurrentTier: vi.fn(),
        getStoredApiKey: vi.fn()
    }
}));

const mockGetSession = vi.fn();
vi.mock('../lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: () => mockGetSession()
        }
    }
}));

vi.mock('../services/LoggingService', () => ({
    logger: {
        info: vi.fn(),
        error: vi.fn(),
        debug: vi.fn()
    }
}));

// Mock @synthesis/core
vi.mock('@synthesis/core', () => ({
    GeminiService: class {
        constructor() { }
        synthesizeStream() { return (async function* () { yield 'mock'; })(); }
    }
}));


const globalFetch = global.fetch;
const mockFetch = vi.fn();

describe('GeminiService Fixes', () => {
    beforeEach(() => {
        global.fetch = mockFetch;
        vi.clearAllMocks();
        mockGetSession.mockResolvedValue({ data: { session: null } }); // Default: Anon

        // Default to free
        (TierService.getCurrentTier as any).mockResolvedValue('free');
    });

    afterEach(() => {
        global.fetch = globalFetch;
    });

    it('should send User Session Token in Authorization header', async () => {
        mockGetSession.mockResolvedValue({
            data: {
                session: {
                    access_token: 'user-token-123',
                    user: { id: 'u1' }
                }
            }
        });

        const mockStream = new ReadableStream({
            start(c) { c.close(); }
        });
        mockFetch.mockResolvedValue({ ok: true, body: mockStream });

        const generator = GeminiService.synthesizeStream([
            { title: 'T', content: 'C', length: 1, textContent: 'C', siteName: 'S', excerpt: 'E', byline: 'B' }
        ]);

        for await (const _ of generator) { }

        expect(mockFetch).toHaveBeenCalled();
        const headers = mockFetch.mock.calls[0][1].headers;
        expect(headers['Authorization']).toBe('Bearer user-token-123');
    });

    it('should fallback to Anon Key if no session', async () => {
        // mockGetSession returns null by default setup
        const mockStream = new ReadableStream({ start(c) { c.close(); } });
        mockFetch.mockResolvedValue({ ok: true, body: mockStream });

        const generator = GeminiService.synthesizeStream([
            { title: 'T', content: 'C', length: 1, textContent: 'C', siteName: 'S', excerpt: 'E', byline: 'B' }
        ]);
        for await (const _ of generator) { }

        const headers = mockFetch.mock.calls[0][1].headers;
        expect(headers['Authorization']).toMatch(/^Bearer /);
    });

    it('should handle large context > 10k characters (defaulting to 100k)', async () => {
        const largeContent = 'a'.repeat(50000);
        const mockStream = new ReadableStream({ start(c) { c.close(); } });
        mockFetch.mockResolvedValue({ ok: true, body: mockStream });

        const generator = GeminiService.synthesizeStream([
            { title: 'Large', content: largeContent, length: 50000, textContent: largeContent, siteName: '', excerpt: '', byline: '' }
        ]);

        for await (const _ of generator) { }

        const callArgs = mockFetch.mock.calls[0];
        expect(callArgs).toBeDefined();
        const body = JSON.parse(callArgs[1].body);

        // Prompt should contain the full 50k chars
        expect(body.prompt).toContain(largeContent);
        expect(body.prompt.length).toBeGreaterThan(50000);
    });
});
