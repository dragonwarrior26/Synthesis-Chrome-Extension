import { ContentExtractor, type ExtensionMessage } from '@synthesis/core'

console.log('Synthesis content script loaded')

// Listen for messages from the background script or side panel
// Listen for messages from the background script or side panel
chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
    if (message.type === 'EXTRACT_CONTENT') {
        try {
            console.log('Extracting content...')
            const extracted = ContentExtractor.extract(document)

            if (extracted) {
                console.log('Content extracted:', extracted.title)
                sendResponse({ type: 'CONTENT_EXTRACTED', payload: extracted })
            } else {
                console.error('Failed to extract content')
                sendResponse({ type: 'ERROR', error: 'Failed to extract content' })
            }
        } catch (error) {
            console.error('Error extracting content:', error)
            sendResponse({ type: 'ERROR', error: (error as Error).message })
        }
    }



    return true
})


