import { useState, useEffect, useCallback } from 'react'
import { GeminiService, type ExtractedContent } from '@synthesis/core'

export type SynthesisMode = 'chat' | 'summary' | 'table' | 'proscons' | 'insights'

export function useSynthesis() {
    const [apiKey, setApiKey] = useState<string>('')
    const [isSynthesizing, setIsSynthesizing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        chrome.storage.local.get(['geminiApiKey'], (result) => {
            if (result && typeof result.geminiApiKey === 'string') {
                setApiKey(result.geminiApiKey)
            }
        })
    }, [])

    const saveApiKey = (key: string) => {
        setApiKey(key)
        chrome.storage.local.set({ geminiApiKey: key })
    }

    const performSynthesis = useCallback(async (
        tabs: ExtractedContent[],
        mode: SynthesisMode,
        query?: string,
        onStream?: (chunk: string) => void,
        chatHistory: { role: 'user' | 'assistant', content: string }[] = [],
        imageData?: string
    ) => {
        if (!apiKey) {
            throw new Error('Please enter your Gemini API Key using the settings icon.')
        }

        // 1. Validate API Key Format
        if (!apiKey.startsWith('AIza')) {
            throw new Error('Invalid API Key format. Gemini keys typically start with "AIza". Check your key.')
        }

        // 2. Validate Content & Truncate (Only if not asking a pure vision question, but let's keep it safe)
        const totalLength = tabs.reduce((acc, tab) => acc + (tab.textContent?.length || 0), 0);
        // If imageData is present, we permit empty text content (Vision mode)
        if (totalLength < 10 && !query && !imageData) {
            throw new Error('Extracted content appears empty. Please try extracting correctly loaded pages.')
        }

        // Limit to ~120k chars (~30k tokens) to be safe for intermediate models
        const MAX_CHARS = 120000;
        let processedTabs = tabs;

        if (totalLength > MAX_CHARS) {
            let currentChars = 0;
            processedTabs = tabs.map(tab => {
                if (currentChars >= MAX_CHARS) return { ...tab, textContent: '' };
                const remaining = MAX_CHARS - currentChars;
                const content = tab.textContent || '';
                const sliced = content.slice(0, remaining);
                currentChars += sliced.length;
                return { ...tab, textContent: sliced };
            });
            console.warn(`Truncated content from ${totalLength} to ${MAX_CHARS} chars to prevent token overflow.`);
        }

        setIsSynthesizing(true)
        setError(null)

        try {
            const gemini = new GeminiService(apiKey)

            if (onStream) {
                const stream = await gemini.synthesizeStream(processedTabs, query, mode, chatHistory, imageData)
                for await (const chunk of stream) {
                    onStream(chunk)
                }
            } else {
                await gemini.synthesize(processedTabs, query, mode, imageData)
            }
        } catch (err) {
            console.error('Synthesis error:', err)
            const msg = (err as Error).message || 'Failed to synthesize'
            setError(msg)
            throw err
        } finally {
            setIsSynthesizing(false)
        }
    }, [apiKey])

    return {
        apiKey,
        saveApiKey,
        isSynthesizing,
        error,
        performSynthesis
    }
}
