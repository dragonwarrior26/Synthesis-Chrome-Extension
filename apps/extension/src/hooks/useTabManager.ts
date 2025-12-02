import { useState, useEffect } from 'react'
import { type ExtractedContent, type ExtractContentMessage } from '@synthesis/core'

export interface TabData {
    id: number
    title: string
    url: string
    favIconUrl?: string
}

export function useTabManager() {
    const [activeTabs, setActiveTabs] = useState<TabData[]>([])
    const [extractedData, setExtractedData] = useState<Record<number, ExtractedContent>>({})
    const [isExtracting, setIsExtracting] = useState(false)

    useEffect(() => {
        // Initial fetch of tabs
        fetchTabs()

        // Listen for tab updates
        const handleTabUpdate = () => fetchTabs()
        chrome.tabs.onUpdated.addListener(handleTabUpdate)
        chrome.tabs.onRemoved.addListener(handleTabUpdate)

        return () => {
            chrome.tabs.onUpdated.removeListener(handleTabUpdate)
            chrome.tabs.onRemoved.removeListener(handleTabUpdate)
        }
    }, [])

    const fetchTabs = async () => {
        const tabs = await chrome.tabs.query({ currentWindow: true })
        const validTabs = tabs
            .filter((tab) => tab.id && tab.url && !tab.url.startsWith('chrome://'))
            .map((tab) => ({
                id: tab.id!,
                title: tab.title || 'Untitled',
                url: tab.url!,
                favIconUrl: tab.favIconUrl,
            }))
        setActiveTabs(validTabs)
    }

    const extractFromTab = async (tabId: number) => {
        setIsExtracting(true)
        try {
            const message: ExtractContentMessage = { type: 'EXTRACT_CONTENT' }

            // Send message to content script
            const response = await chrome.tabs.sendMessage(tabId, message)

            if (response && response.type === 'CONTENT_EXTRACTED') {
                setExtractedData((prev) => ({
                    ...prev,
                    [tabId]: response.payload,
                }))
                console.log(`Extracted data from tab ${tabId}`, response.payload)
            } else {
                console.error(`Failed to extract from tab ${tabId}`, response)
            }
        } catch (error) {
            console.error(`Error extracting from tab ${tabId}:`, error)
        } finally {
            setIsExtracting(false)
        }
    }

    const extractAll = async () => {
        setIsExtracting(true)
        await Promise.all(activeTabs.map((tab) => extractFromTab(tab.id)))
        setIsExtracting(false)
    }

    return {
        activeTabs,
        extractedData,
        isExtracting,
        extractFromTab,
        extractAll,
    }
}
