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

    // New: Handle Crop Request
    if (message.type === 'START_CROP') {
        createCropOverlay((rect) => {
            // Send back the selected coordinates
            sendResponse({ type: 'CROP_RESULT', payload: rect });
        });
        // Important: Return true for async response if we wanted to await, 
        // but sendResponse is only valid synchronously unless we return true.
        // here createCropOverlay is callback based, so we DO need to return true
        // and calling sendResponse inside the callback MIGHT trigger "message channel closed"
        // if the sidepanel stops listening.
        // Actually, it's better to send a NEW message back to runtime.
        return true;
    }

    return true
})

function createCropOverlay(onComplete: (rect: { x: number, y: number, width: number, height: number, pixelRatio: number } | null) => void) {
    if (document.getElementById('synthesis-crop-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'synthesis-crop-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = '2147483647'; // Max z-index
    overlay.style.cursor = 'crosshair';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';

    const selection = document.createElement('div');
    selection.style.border = '2px solid #3b82f6';
    selection.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    selection.style.position = 'fixed';
    selection.style.display = 'none';
    overlay.appendChild(selection);

    // Instructions
    const tip = document.createElement('div');
    tip.textContent = 'Drag to select area. Esc to cancel.';
    tip.style.position = 'fixed';
    tip.style.top = '20px';
    tip.style.left = '50%';
    tip.style.transform = 'translateX(-50%)';
    tip.style.background = '#0f172a';
    tip.style.color = 'white';
    tip.style.padding = '8px 16px';
    tip.style.borderRadius = '20px';
    tip.style.fontFamily = 'sans-serif';
    tip.style.fontSize = '14px';
    tip.style.pointerEvents = 'none';
    tip.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    overlay.appendChild(tip);

    document.body.appendChild(overlay);

    let startX = 0;
    let startY = 0;
    let isDragging = false;

    const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        selection.style.left = `${startX}px`;
        selection.style.top = `${startY}px`;
        selection.style.width = '0px';
        selection.style.height = '0px';
        selection.style.display = 'block';
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const currentX = e.clientX;
        const currentY = e.clientY;

        const left = Math.min(startX, currentX);
        const top = Math.min(startY, currentY);
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);

        selection.style.left = `${left}px`;
        selection.style.top = `${top}px`;
        selection.style.width = `${width}px`;
        selection.style.height = `${height}px`;
    };

    const onMouseUp = (_e: MouseEvent) => {
        if (!isDragging) return;
        isDragging = false;


        cleanup();

        const rect = selection.getBoundingClientRect();
        if (rect.width > 10 && rect.height > 10) {
            onComplete({
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height,
                pixelRatio: window.devicePixelRatio
            });
        } else {
            onComplete(null);
        }
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            cleanup();
            onComplete(null);
        }
    };

    const cleanup = () => {
        overlay.remove();
        document.removeEventListener('keydown', onKeyDown);
    };

    overlay.addEventListener('mousedown', onMouseDown);
    overlay.addEventListener('mousemove', onMouseMove);
    overlay.addEventListener('mouseup', onMouseUp);
    document.addEventListener('keydown', onKeyDown);
}
