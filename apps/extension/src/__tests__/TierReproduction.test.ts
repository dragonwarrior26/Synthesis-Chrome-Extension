
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TierService } from '../services/TierService';

// Mock chrome API
global.chrome = {
    storage: {
        local: {
            get: vi.fn(),
            set: vi.fn(),
            remove: vi.fn()
        }
    }
} as any;

// Mock Supabase client
const mockGetSession = vi.fn();
const mockFrom = vi.fn();

vi.mock('../lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: () => mockGetSession()
        },
        from: (table: string) => mockFrom(table)
    }
}));

// Mock config
vi.mock('../config/features', () => ({
    setTier: vi.fn()
}));

describe('TierService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default: No BYOK key
        (global.chrome.storage.local.get as any).mockResolvedValue({});
    });

    it('should return BYOK when API key exists in storage', async () => {
        (global.chrome.storage.local.get as any).mockResolvedValue({ gemini_api_key: 'test-key' });

        const tier = await TierService.getCurrentTier();
        expect(tier).toBe('byok');
        expect(mockGetSession).not.toHaveBeenCalled(); // Fast path check
    });

    it('should return PRO when Supabase profile has subscription_tier="pro"', async () => {
        // Mock Session
        mockGetSession.mockResolvedValue({
            data: { session: { user: { id: 'test-user-id' } } }
        });

        // Mock Database Chain: from -> select -> eq -> single
        const mockSingle = vi.fn().mockResolvedValue({ data: { subscription_tier: 'pro' } });
        const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
        const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
        mockFrom.mockReturnValue({ select: mockSelect });

        const tier = await TierService.getCurrentTier();

        expect(tier).toBe('pro');
        expect(mockFrom).toHaveBeenCalledWith('profiles');
        expect(mockEq).toHaveBeenCalledWith('id', 'test-user-id');
    });

    it('should return FREE when Supabase profile has subscription_tier="free" or null', async () => {
        // Mock Session
        mockGetSession.mockResolvedValue({
            data: { session: { user: { id: 'test-user-id' } } }
        });

        // Mock Database Chain
        const mockSingle = vi.fn().mockResolvedValue({ data: { subscription_tier: 'free' } });
        const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
        const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
        mockFrom.mockReturnValue({ select: mockSelect });

        const tier = await TierService.getCurrentTier();
        expect(tier).toBe('free');
    });

    it('should default to FAULT_TOLERANT FREE on DB error', async () => {
        // Mock Session exists
        mockGetSession.mockResolvedValue({
            data: { session: { user: { id: 'test-user-id' } } }
        });

        // Mock DB Error
        const mockSelect = vi.fn().mockImplementation(() => { throw new Error('DB Error'); });
        mockFrom.mockReturnValue({ select: mockSelect });

        const tier = await TierService.getCurrentTier();
        expect(tier).toBe('free');
    });
});
