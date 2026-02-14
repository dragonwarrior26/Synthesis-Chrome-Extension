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
    const [syncErrors, setSyncErrors] = useState<Record<number, string>>({})
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
        setSyncErrors(prev => {
            const next = { ...prev };
            delete next[tabId];
            return next;
        });
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
                    const isLocalPdf = url.startsWith('file://') && path.endsWith('.pdf');
                    const result = path.endsWith('.pdf') ||
                        isLocalPdf ||
                        (u.hostname.includes('arxiv.org') && path.startsWith('/pdf/'));
                    console.log(`[useTabManager] Check Result: ${result} (path=${path})`);
                    return result;
                } catch (e) {
                    console.log(`[useTabManager] Check Error`, e);
                    const lowerUrl = url.toLowerCase().split('?')[0].split('#')[0];
                    return lowerUrl.endsWith('.pdf') || url.startsWith('file:///');
                }
            };

            if (isPdfUrl(tab.url)) {
                console.log(`[useTabManager] Detected PDF URL: ${tab.url} - Entering execution block`);

                try {
                    // Fetch via background with 15s timeout
                    const response = await new Promise<any>((resolve, reject) => {
                        const timeout = setTimeout(() => reject(new Error('PDF fetch timed out (15s)')), 15000);
                        chrome.runtime.sendMessage({
                            type: 'FETCH_PDF_BINARY',
                            url: tab.url
                        }, (res) => {
                            clearTimeout(timeout);
                            if (chrome.runtime.lastError) {
                                reject(new Error(chrome.runtime.lastError.message));
                            } else {
                                resolve(res);
                            }
                        });
                    });

                    if (response?.success && response?.data) {
                        let bytes: Uint8Array;

                        // Handle both direct Uint8Array and the case where it might be serialized as a numeric object
                        if (response.data instanceof Uint8Array) {
                            bytes = response.data;
                        } else if (typeof response.data === 'object') {
                            // Fallback for cases where structured cloning might have serialized it as a numeric object
                            bytes = new Uint8Array(Object.values(response.data));
                        } else {
                            throw new Error('Received invalid binary data format');
                        }

                        console.log(`[useTabManager] PDF bytes received. Length: ${bytes.length}`);

                        // Basic header check: %PDF
                        const header = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
                        if (header !== '%PDF') {
                            console.error(`[useTabManager] Invalid PDF header: ${header}`);
                            throw new Error('Fetched data is not a valid PDF document');
                        }

                        console.log(`[useTabManager] PDF header verified. Extracting text...`);
                        const pdfData = await PDFExtractor.extract(bytes);

                        if (pdfData && pdfData.content) {
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
                            throw new Error('PDF extraction returned no text');
                        }
                    } else {
                        throw new Error(response?.error || 'Failed to fetch PDF binary');
                    }
                } catch (err) {
                    console.error('[useTabManager] PDF sync failed:', err);
                    setSyncErrors(prev => ({ ...prev, [tabId]: (err as Error).message }));
                    return; // Stop on PDF error
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
        setSyncErrors({})
        setIsExtracting(false)
    }

    return {
        activeTabs,
        extractedData,
        syncErrors,
        isExtracting,
        extractFromTab,
        extractAll,
        clearData
    }
}
