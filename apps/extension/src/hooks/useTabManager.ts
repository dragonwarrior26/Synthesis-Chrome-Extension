import { useState, useEffect } from 'react'
import { type ExtractedContent, type ExtractContentMessage, YouTubeExtractor, PDFExtractor } from '@synthesis/core'

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
            // Find the tab info
            const tab = activeTabs.find(t => t.id === tabId);
            if (!tab) return;

            // YouTube Handling (Direct Library Extraction)
            if (YouTubeExtractor.isYouTube(tab.url)) {
                console.log(`[useTabManager] Detected YouTube URL: ${tab.url}`);
                const videoData = await YouTubeExtractor.getVideoInfo(tab.url);

                if (videoData && videoData.transcript) {
                    console.log(`[useTabManager] Successfully extracted transcript via library`);
                    setExtractedData((prev) => ({
                        ...prev,
                        [tabId]: {
                            title: videoData.title || tab.title || "YouTube Video",
                            content: videoData.transcript!,
                            textContent: videoData.transcript!,
                            length: videoData.transcript!.length,
                            excerpt: videoData.transcript!.substring(0, 200) + '...',
                            byline: videoData.channelName || 'YouTube',
                            siteName: 'YouTube',
                            url: tab.url
                        },
                    }));
                    return; // Skip content script fallback
                } else {
                    console.log(`[useTabManager] No transcript found via library, falling back to content script`);
                }
            }

            // PDF Handling (Local Extraction in Side Panel)
            // Check based on URL path to ignore query params/fragments, but fallback to simple check
            const isPdfUrl = (url: string) => {
                console.log(`[useTabManager] Debugging PDF Check for: ${url}`);
                try {
                    const u = new URL(url);
                    const path = u.pathname.toLowerCase();
                    const result = path.endsWith('.pdf') || (u.hostname.includes('arxiv.org') && path.startsWith('/pdf/'));
                    console.log(`[useTabManager] Check Result: ${result} (path=${path})`);
                    return result;
                } catch (e) {
                    console.log(`[useTabManager] Check Error`, e);
                    return url.toLowerCase().endsWith('.pdf');
                }
            };

            if (isPdfUrl(tab.url)) {
                console.log(`[useTabManager] Detected PDF URL: ${tab.url} - Entering execution block`);

                try {
                    // Fetch via background to bypass CORS in sidepanel
                    const response = await chrome.runtime.sendMessage({
                        type: 'FETCH_PDF_BINARY',
                        url: tab.url
                    }).catch(e => {
                        console.error("[useTabManager] Initial Background connection failed:", e);
                        throw e;
                    });

                    if (response.success && response.data) {
                        // Convert base64 back to Uint8Array
                        const binaryString = atob(response.data);
                        const len = binaryString.length;
                        const bytes = new Uint8Array(len);
                        for (let i = 0; i < len; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }

                        console.log(`[useTabManager] Fetched PDF data via background. Size: ${len}`);
                        const pdfData = await PDFExtractor.extract(bytes);

                        if (pdfData) {
                            console.log(`[useTabManager] Successfully extracted PDF: ${pdfData.title}`);
                            setExtractedData((prev) => ({
                                ...prev,
                                [tabId]: {
                                    title: pdfData.title || tab.title || "PDF Document",
                                    content: pdfData.content,
                                    textContent: pdfData.content,
                                    length: pdfData.content.length,
                                    excerpt: pdfData.content.substring(0, 200) + '...',
                                    byline: null,
                                    siteName: 'PDF Document',
                                    url: tab.url
                                },
                            }));
                            return; // Success! Stop here.
                        } else {
                            console.error('[useTabManager] PDF Extraction returned null');
                        }
                    } else {
                        console.error('[useTabManager] Background PDF fetch failed:', response.error);
                    }
                } catch (err) {
                    console.error('[useTabManager] Error extracting PDF:', err);
                }

                console.log('[useTabManager] Sidepanel PDF extraction failed. Falling back to Content Script...');
                // Fall through to content script extraction
            }

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

    const clearData = () => {
        setExtractedData({})
        setIsExtracting(false)
    }

    return {
        activeTabs,
        extractedData,
        isExtracting,
        extractFromTab,
        extractAll,
        clearData
    }
}
