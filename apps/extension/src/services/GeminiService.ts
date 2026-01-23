import { supabase } from '../lib/supabase'
import { TierService } from './TierService'
import { GeminiService as CoreGemini, type SynthesisMode, type ExtractedContent } from '@synthesis/core'

/**
 * GeminiService - Intelligent routing based on tier
 * 
 * Free/Pro: Routes to server-side Edge Function with rate limiting
 * BYOK: Uses client-side API with user's own key
 */
export class GeminiService {
    /**
     * Synthesize content with intelligent routing
     */
    static async synthesize(
        tabs: ExtractedContent[],
        query?: string,
        mode: SynthesisMode = 'summary',
        imageData?: string,
        depth: 'standard' | 'deep' = 'standard',
        contentLimit: number = 10000
    ): Promise<string> {
        const tier = await TierService.getCurrentTier()

        if (tier === 'byok') {
            // Use client-side with user's key
            return this.synthesizeWithUserKey(tabs, query, mode, imageData, depth, contentLimit)
        } else {
            // Use server-side Edge Function (Free/Pro)
            return this.synthesizeWithServerKey(tabs, query, mode, imageData, depth, contentLimit)
        }
    }

    /**
     * Synthesize with streaming (for chat)
     */
    static async synthesizeStream(
        tabs: ExtractedContent[],
        query?: string,
        mode: SynthesisMode = 'summary',
        chatHistory: { role: 'user' | 'assistant', content: string }[] = [],
        imageData?: string,
        depth: 'standard' | 'deep' = 'standard',
        contentLimit: number = 10000
    ): Promise<AsyncGenerator<string>> {
        const tier = await TierService.getCurrentTier()

        if (tier === 'byok') {
            return this.synthesizeStreamWithUserKey(tabs, query, mode, chatHistory, imageData, depth, contentLimit)
        } else {
            // For server-side, we'll use non-streaming for now (can add streaming later)
            const result = await this.synthesizeWithServerKey(tabs, query, mode, imageData, depth, contentLimit)
            return this.stringToAsyncGenerator(result)
        }
    }

    /**
     * Transcribe audio (Pro tier feature)
     */
    static async transcribeAudio(audioUrl: string): Promise<string> {
        const tier = await TierService.getCurrentTier()

        if (tier === 'byok') {
            const apiKey = await TierService.getStoredApiKey()
            if (!apiKey) throw new Error('No API key found')
            const gemini = new CoreGemini(apiKey)
            return gemini.transcribeAudio(audioUrl)
        } else if (tier === 'pro') {
            // TODO: Add server-side audio transcription
            throw new Error('Server-side audio transcription not yet implemented')
        } else {
            throw new Error('Audio transcription requires Pro or BYOK tier')
        }
    }

    /**
     * Transcribe audio from base64 data
     */
    static async transcribeAudioData(base64Data: string, mimeType: string = 'audio/webm'): Promise<string> {
        const tier = await TierService.getCurrentTier()

        if (tier === 'byok') {
            const apiKey = await TierService.getStoredApiKey()
            if (!apiKey) throw new Error('No API key found')
            const gemini = new CoreGemini(apiKey)
            return gemini.transcribeAudioData(base64Data, mimeType)
        } else if (tier === 'pro') {
            // TODO: Add server-side audio transcription
            throw new Error('Server-side audio transcription not yet implemented')
        } else {
            throw new Error('Audio transcription requires Pro or BYOK tier')
        }
    }

    // ===== PRIVATE METHODS =====

    private static async synthesizeWithUserKey(
        tabs: ExtractedContent[],
        query?: string,
        mode: SynthesisMode = 'summary',
        imageData?: string,
        depth: 'standard' | 'deep' = 'standard',
        contentLimit: number = 10000
    ): Promise<string> {
        const apiKey = await TierService.getStoredApiKey()
        if (!apiKey) {
            throw new Error('No API key found. Please add your Gemini API key in settings.')
        }

        const gemini = new CoreGemini(apiKey)
        return gemini.synthesize(tabs, query, mode, imageData, depth, contentLimit)
    }

    private static async synthesizeStreamWithUserKey(
        tabs: ExtractedContent[],
        query?: string,
        mode: SynthesisMode = 'summary',
        chatHistory: { role: 'user' | 'assistant', content: string }[] = [],
        imageData?: string,
        depth: 'standard' | 'deep' = 'standard',
        contentLimit: number = 10000
    ): Promise<AsyncGenerator<string>> {
        const apiKey = await TierService.getStoredApiKey()
        if (!apiKey) {
            throw new Error('No API key found. Please add your Gemini API key in settings.')
        }

        const gemini = new CoreGemini(apiKey)
        return gemini.synthesizeStream(tabs, query, mode, chatHistory, imageData, depth, contentLimit)
    }

    private static async synthesizeWithServerKey(
        tabs: ExtractedContent[],
        query?: string,
        mode: SynthesisMode = 'summary',
        _imageData?: string,
        _depth: 'standard' | 'deep' = 'standard',
        contentLimit: number = 10000
    ): Promise<string> {
        // Build prompt (reuse core logic)
        const prompt = this.buildPrompt(tabs, query, mode, _depth, contentLimit)

        console.log('[GeminiService] Calling ai-request Edge Function...')

        // Call Edge Function
        const { data, error } = await supabase.functions.invoke('ai-request', {
            body: { prompt }
        })

        if (error) {
            console.error('[GeminiService] Edge Function Error:', error)
            if (error.message?.includes('Rate limit')) {
                throw new Error(`Daily limit reached. Upgrade to Pro for higher limits.`)
            }
            throw new Error(`AI request failed: ${error.message}`)
        }

        console.log('[GeminiService] Edge Function Success. Data:', data)

        if (!data?.response) {
            console.error('[GeminiService] Empty response received:', data)
            throw new Error('Received empty response from AI service.')
        }

        return data.response
    }

    private static buildPrompt(
        tabs: ExtractedContent[],
        query?: string,
        mode: SynthesisMode = 'summary',
        _depth: 'standard' | 'deep' = 'standard',
        contentLimit: number = 10000
    ): string {
        // Simplified prompt builder for server-side
        const context = tabs.map((tab, i) => `
---
Source ${i + 1}: ${tab.title}
Site: ${tab.siteName || 'Unknown'}
Content: ${tab.textContent.slice(0, Math.floor(contentLimit / tabs.length))}
---
        `).join('\n')

        const modePrompts = {
            chat: 'You are "Synthesis", a helpful Research Assistant. Answer clearly and concisely.',
            summary: 'You are "Synthesis". Create a concise summary with key takeaways.',
            table: 'You are "Synthesis". Create a comparison table in Markdown format.',
            proscons: 'You are "Synthesis". List the pros and cons.',
            insights: 'You are "Synthesis". Provide key insights and takeaways.'
        }

        return `${modePrompts[mode]}

User Query: ${query || 'Provide a comprehensive analysis.'}

Context:
${context}
`
    }

    private static async *stringToAsyncGenerator(str: string): AsyncGenerator<string> {
        yield str
    }
}
