// Background service worker
console.log('Synthesis background script loaded')

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: unknown) => console.error(error))

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'PING') {
        sendResponse({ type: 'PONG' });
        return;
    }
    if (message.type === 'FETCH_PDF_BINARY') {
        const url = message.url;

        // 1. URL Validation - Allowing file:// for local PDFs
        if (!url || (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('file://'))) {
            sendResponse({ success: false, error: 'Invalid URL protocol' });
            return true;
        }

        fetch(url)
            .then(response => {
                if (!response.ok && !url.startsWith('file://')) throw new Error(`Fetch failed: ${response.status}`);

                // 2. Size Validation (Max 20MB)
                const len = response.headers.get('Content-Length');
                if (len && parseInt(len) > 20 * 1024 * 1024) {
                    throw new Error('PDF too large (max 20MB)');
                }

                return response.arrayBuffer();
            })
            .then(buffer => {
                const bytes = new Uint8Array(buffer);
                // Send directly - structured cloning supports TypedArrays since Chrome 106
                sendResponse({ success: true, data: bytes });
            })
            .catch(error => {
                console.error('PDF Fetch Error:', error);
                sendResponse({ success: false, error: error.message });
            });
        return true; // Keep channel open for async response
    }
});
