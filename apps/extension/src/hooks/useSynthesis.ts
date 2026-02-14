import { useState, useCallback, useEffect } from 'react'
import { GeminiService } from '@/services/GeminiService'
import { type ExtractedContent } from '@synthesis/core'
import { TierService } from '@/services/TierService'
import { getContentLimit } from '@/config/features'

export type SynthesisMode = 'chat' | 'summary' | 'table' | 'proscons' | 'insights'

export function useSynthesis() {
    const [isSynthesizing, setIsSynthesizing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // API key management for BYOK tier only
    const [apiKey, setApiKeyState] = useState<string>('')

    // Load stored key on mount
    useEffect(() => {
        TierService.getStoredApiKey().then(key => {
            if (key) setApiKeyState(key)
        })
    }, [])

    const saveApiKey = async (key: string) => {
        await TierService.setApiKey(key)
        setApiKeyState(key)
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
        setIsSynthesizing(true)
        setError(null)

        try {
            console.log('[useSynthesis] Calling SHELL GeminiService...');

            if (onStream) {
                // @ts-ignore
                const limit = getContentLimit(!!apiKey);
                const stream = GeminiService.synthesizeStream(tabs, query, mode, chatHistory, imageData, depth, limit);

                for await (const chunk of stream) {
                    onStream(chunk)
                }
            }

        } catch (err) {
            console.error('Synthesis error:', err)
            const msg = (err as Error).message || 'Failed to synthesize'
            setError(msg)
            // alert("Synthesis Error: " + msg); // Optional: valid for debugging
        } finally {
            setIsSynthesizing(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiKey])

    return {
        apiKey,
        saveApiKey,
        isSynthesizing,
        error,
        performSynthesis
    }
}
