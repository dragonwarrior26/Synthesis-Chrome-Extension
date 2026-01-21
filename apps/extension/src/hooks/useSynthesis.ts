import { useState, useCallback } from 'react'
import { GeminiService } from '@/services/GeminiService'
import { type ExtractedContent } from '@synthesis/core'
import { TierService } from '@/services/TierService'
import { getContentLimit } from '@/config/features'

export type SynthesisMode = 'chat' | 'summary' | 'table' | 'proscons' | 'insights'

export function useSynthesis() {
    const [isSynthesizing, setIsSynthesizing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // API key management for BYOK tier only
    const apiKey = ''  // Not used for Free/Pro, only for BYOK via TierService
    const saveApiKey = async (key: string) => {
        await TierService.setApiKey(key)
    }

    const performSynthesis = useCallback(async (
        tabs: ExtractedContent[],
        mode: SynthesisMode,
        query?: string,
        onStream?: (chunk: string) => void,
        chatHistory: { role: 'user' | 'assistant', content: string }[] = [],
        imageData?: string,
        depth: 'standard' | 'deep' = 'standard'
    ) => {
        const tier = await TierService.getCurrentTier()

        // Get tier-based content limit
        const contentLimit = getContentLimit(tier === 'byok')
        console.log(`[Synthesis] Using content limit: ${contentLimit} chars (Tier: ${tier})`)

        // Validate Content & Truncate
        const totalLength = tabs.reduce((acc, tab) => acc + (tab.textContent?.length || 0), 0)

        // If imageData is present, we permit empty text content (Vision mode)
        if (totalLength < 10 && !query && !imageData) {
            throw new Error('Extracted content appears empty. Please try extracting correctly loaded pages.')
        }

        // Limit based on tier
        let processedTabs = tabs

        if (totalLength > contentLimit) {
            let currentChars = 0
            processedTabs = tabs.map(tab => {
                if (currentChars >= contentLimit) return { ...tab, textContent: '' }
                const remaining = contentLimit - currentChars
                const content = tab.textContent || ''
                const sliced = content.slice(0, remaining)
                currentChars += sliced.length
                return { ...tab, textContent: sliced }
            })
            console.warn(`[Synthesis] Truncated content from ${totalLength} to ${contentLimit} chars based on tier.`)
        }

        setIsSynthesizing(true)
        setError(null)

        try {
            if (onStream) {
                const stream = await GeminiService.synthesizeStream(processedTabs, query, mode, chatHistory, imageData, depth, contentLimit)
                for await (const chunk of stream) {
                    onStream(chunk)
                }
            } else {
                await GeminiService.synthesize(processedTabs, query, mode, imageData, depth, contentLimit)
            }
        } catch (err) {
            console.error('Synthesis error:', err)
            const msg = (err as Error).message || 'Failed to synthesize'
            setError(msg)
            throw err
        } finally {
            setIsSynthesizing(false)
        }
    }, [])

    return {
        apiKey,
        saveApiKey,
        isSynthesizing,
        error,
        performSynthesis
    }
}
