// Background service worker
console.log('Synthesis background script loaded')

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: unknown) => console.error(error))

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'PING') {
        sendResponse({ type: 'PONG' });
        return;
    }
    if (message.type === 'FETCH_PDF_BINARY') {
        const url = message.url;

        // 1. URL Validation
        if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
            sendResponse({ success: false, error: 'Invalid URL protocol' });
            return true;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

                // 2. Size Validation (Max 20MB)
                const len = response.headers.get('Content-Length');
                if (len && parseInt(len) > 20 * 1024 * 1024) {
                    throw new Error('PDF too large (max 20MB)');
                }

                // 3. Type Validation (Loose check for PDF, strict block for HTML)
                const type = response.headers.get('Content-Type');
                if (type && type.includes('text/html')) {
                    throw new Error('Target is not a PDF (HTML detected)');
                }

                return response.arrayBuffer();
            })
            .then(buffer => {
                const base64 = arrayBufferToBase64(buffer);
                sendResponse({ success: true, data: base64 });
            })
            .catch(error => {
                console.error('PDF Fetch Error:', error);
                sendResponse({ success: false, error: error.message });
            });
        return true; // Keep channel open for async response
    }
});
