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

    const [tableData, setTableData] = useState<{ columns: any[]; data: any[] } | null>(null)

    const synthesizeTable = async (tabs: ExtractedContent[]) => {
        if (!apiKey) {
            setError('Please enter your Gemini API Key')
            return
        }

        setIsSynthesizing(true)
        setError(null)
        setTableData(null)

        try {
            const service = new GeminiService(apiKey)
            const result = await service.synthesizeJSON(tabs)
            if (result && result.columns && result.data) {
                setTableData(result)
            } else {
                throw new Error('Invalid data format received')
            }
        } catch (err) {
            console.error('Table synthesis error:', err)
            setError((err as Error).message || 'Failed to generate table')
        } finally {
            setIsSynthesizing(false)
        }
    }

    return {
        apiKey,
        saveApiKey,
        isSynthesizing,
        result,
        tableData,
        error,
        synthesizeTabs,
        synthesizeTable,
    }
}
