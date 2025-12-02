import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GeminiService } from './gemini'
import { ExtractedContent } from './extractor'

// Mock the GoogleGenerativeAI SDK
const mockGenerateContent = vi.fn()
const mockGenerateContentStream = vi.fn()

vi.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
            getGenerativeModel: vi.fn().mockReturnValue({
                generateContent: mockGenerateContent,
                generateContentStream: mockGenerateContentStream,
            }),
        })),
    }
})

describe('GeminiService', () => {
    let service: GeminiService
    const mockTabs: ExtractedContent[] = [
        {
            title: 'Test Tab',
            content: '<div>Test Content</div>',
            textContent: 'Test Content',
            length: 100,
            excerpt: 'Test Excerpt',
            byline: null,
            siteName: 'Test Site',
        },
    ]

    beforeEach(() => {
        service = new GeminiService('fake-api-key')
        vi.clearAllMocks()
    })

    it('should initialize with API key', () => {
        expect(service).toBeDefined()
    })

    it('should synthesize content successfully', async () => {
        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => 'Synthesized Response',
            },
        })

        const result = await service.synthesize(mockTabs)
        expect(result).toBe('Synthesized Response')
        expect(mockGenerateContent).toHaveBeenCalled()
    })

    it('should stream synthesis content', async () => {
        const mockStream = {
            stream: (async function* () {
                yield { text: () => 'Chunk 1' }
                yield { text: () => 'Chunk 2' }
            })(),
        }
        mockGenerateContentStream.mockResolvedValue(mockStream)

        const stream = await service.synthesizeStream(mockTabs)
        const chunks = []
        for await (const chunk of stream) {
            chunks.push(chunk)
        }

        expect(chunks).toEqual(['Chunk 1', 'Chunk 2'])
        expect(mockGenerateContentStream).toHaveBeenCalled()
    })
})
