import { useState, useEffect } from 'react'
import { GeminiService, type ExtractedContent } from '@synthesis/core'

export function useSynthesis() {
    const [apiKey, setApiKey] = useState<string>('')
    const [isSynthesizing, setIsSynthesizing] = useState(false)
    const [result, setResult] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Load API key from storage
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

    const synthesizeTabs = async (tabs: ExtractedContent[]) => {
        if (!apiKey) {
            setError('Please enter your Gemini API Key')
            return
        }

        setIsSynthesizing(true)
        setError(null)
        setResult('')

        try {
            const service = new GeminiService(apiKey)
            const stream = await service.synthesizeStream(tabs)

            for await (const chunk of stream) {
                setResult((prev) => prev + chunk)
            }
        } catch (err) {
            console.error('Synthesis error:', err)
            setError((err as Error).message || 'Failed to synthesize tabs')
        } finally {
            setIsSynthesizing(false)
        }
    }

    return {
        apiKey,
        saveApiKey,
        isSynthesizing,
        result,
        error,
        synthesizeTabs,
    }
}
