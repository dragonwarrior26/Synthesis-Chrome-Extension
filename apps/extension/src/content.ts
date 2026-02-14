import { ContentExtractor, PDFExtractor, type ExtensionMessage } from '@synthesis/core'

console.log('Synthesis content script loaded')

// Listen for messages from the background script or side panel
chrome.runtime.onMessage.addListener((message: ExtensionMessage | any, _sender, sendResponse) => {
    // Handle async operations properly
    handleMessage(message).then(sendResponse).catch(err => {
        console.error('Message handler error:', err);
        sendResponse({ type: 'ERROR', error: err.message });
    });
    return true; // Keep message channel open for async response
});

async function handleMessage(message: any): Promise<any> {
    if (message.type === 'EXTRACT_CONTENT') {
        // SPECIAL HANDLING FOR YOUTUBE: Try to get transcript first
        if (window.location.hostname.includes('youtube.com') && window.location.pathname.startsWith('/watch')) {
            console.log('[ContentScript] YouTube detected during generic extraction, attempting captions...');
            try {
                const captionResult = await extractYouTubeCaptions();
                if (captionResult && captionResult.transcript) {
                    console.log('[ContentScript] Successfully upgraded generic extraction to transcript');
                    return {
                        type: 'CONTENT_EXTRACTED',
                        payload: {
                            title: document.title.replace(' - YouTube', ''),
                            content: captionResult.transcript,
                            textContent: captionResult.transcript,
                            length: captionResult.transcript.length,
                            url: window.location.href,
                            siteName: 'YouTube',
                            excerpt: captionResult.transcript.substring(0, 200) + '...',
                            byline: document.querySelector('#owner-name a')?.textContent || 'YouTube Channel'
                        }
                    };
                }
            } catch (e) {
                console.warn('[ContentScript] Failed to upgrade YouTube extraction:', e);
                // Fall through to generic extractor but add a warning flag
                const extracted = await ContentExtractor.extract(document, window.location.href);
                if (extracted) {
                    extracted.content = `[SYSTEM MESSAGE: Video transcript could not be extracted. Summary is based on video description and metadata only.]\n\n${extracted.content}`;
                    return { type: 'CONTENT_EXTRACTED', payload: extracted };
                }
            }
        }

        // SPECIAL HANDLING FOR PDF (if browser handles it via built-in viewer)
        // Note: Built-in viewer often blocks content scripts, but for some configurations it works.
        const isPdf = document.contentType === 'application/pdf' || window.location.href.toLowerCase().endsWith('.pdf');

        if (isPdf) {
            console.log('[ContentScript] PDF detected. Attempting extraction via PDFExtractor...');
            showDebugToast('PDF Detected. Extracting...', 'blue');
            // We need to fetch the blob or use the URL
            // If we are on the page, we can try to fetch the URL to getting bytes
            try {
                const response = await fetch(window.location.href);
                const buffer = await response.arrayBuffer();
                const u8 = new Uint8Array(buffer);

                // Static import used (PDFExtractor imported at top)

                const pdfData = await PDFExtractor.extract(u8);
                if (pdfData) {
                    showDebugToast('PDF Extraction Success!', 'green');
                    return {
                        type: 'CONTENT_EXTRACTED',
                        payload: {
                            title: pdfData.title || document.title,
                            content: pdfData.content,
                            textContent: pdfData.content,
                            length: pdfData.content.length,
                            url: window.location.href,
                            siteName: 'PDF Document',
                            excerpt: pdfData.content.substring(0, 200) + '...'
                        }
                    };
                }
            } catch (e) {
                console.error('[ContentScript] PDF extraction failed in content script:', e);
                showDebugToast('PDF Extraction Failed', 'orange');
            }
        }

        console.log('Extracting content...');
        const extracted = await ContentExtractor.extract(document, window.location.href);
        if (extracted) {
            console.log('Content extracted:', extracted.title);
            return { type: 'CONTENT_EXTRACTED', payload: extracted };
        } else {
            return { type: 'ERROR', error: 'Failed to extract content' };
        }
    }

    if (message.type === 'EXTRACT_YOUTUBE_CAPTIONS') {
        console.log('[ContentScript] Extracting YouTube captions...');
        const result = await extractYouTubeCaptions();
        if (result) {
            return { type: 'CAPTIONS_EXTRACTED', payload: result };
        } else {
            return { type: 'ERROR', error: 'No captions found on this page' };
        }
    }

    if (message.type === 'CAPTURE_YOUTUBE_AUDIO') {
        console.log('Capturing YouTube audio...');
        const result = await captureYouTubeAudio(message.payload?.maxDurationSeconds || 300);
        return { type: 'AUDIO_CAPTURED', payload: result };
    }

    return { type: 'ERROR', error: 'Unknown message type' };
}

/**
 * Extract captions directly from YouTube page.
 * This works because content script has access to the page's DOM and scripts.
 */
async function extractYouTubeCaptions(): Promise<{ transcript: string; segments: any[] } | null> {
    try {
        // Method 1: Try to get from ytInitialPlayerResponse (embedded in page)
        const scripts = document.querySelectorAll('script');
        let playerResponse: any = null;

        for (const script of scripts) {
            const content = script.textContent || '';

            // Look for ytInitialPlayerResponse
            const match = content.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});/s);
            if (match) {
                try {
                    playerResponse = JSON.parse(match[1]);
                    break;
                } catch (e) {
                    console.warn('[ContentScript] Failed to parse ytInitialPlayerResponse');
                }
            }
        }

        if (!playerResponse) {
            // Try getting from window object via script injection
            playerResponse = await getPlayerResponseFromWindow();
        }

        if (!playerResponse) {
            console.log('[ContentScript] No player response found');
            return null;
        }

        // Extract caption tracks
        const captions = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

        if (!captions || captions.length === 0) {
            console.log('[ContentScript] No caption tracks in player response');
            return null;
        }

        console.log(`[ContentScript] Found ${captions.length} caption tracks`);

        // Prefer English, fallback to first
        const englishTrack = captions.find((t: any) =>
            t.languageCode === 'en' || t.languageCode?.startsWith('en')
        );
        const track = englishTrack || captions[0];

        if (!track?.baseUrl) {
            console.log('[ContentScript] No baseUrl in caption track');
            return null;
        }

        // Fetch captions in JSON format with credentials
        const captionUrl = track.baseUrl + '&fmt=json3';
        console.log(`[ContentScript] Fetching captions from: ${captionUrl.substring(0, 80)}...`);

        // VISUAL DEBUG: Show user what's happening
        showDebugToast('Attempting API Fetch...', 'blue');

        try {
            const response = await fetch(captionUrl, { credentials: 'include' });
            if (!response.ok) {
                console.error(`[ContentScript] Caption fetch failed: ${response.status}, trying UI fallback...`);
                showDebugToast('API Failed. Trying UI Fallback...', 'orange');
                return await scrapeTranscriptFromUI();
            }

            const data = await response.json();

            // Check if we got valid events
            if (!data.events || data.events.length === 0) {
                console.log('[ContentScript] No events in caption response (empty transcript), trying UI fallback...');
                showDebugToast('Empty Transcript. Trying UI Fallback...', 'orange');
                return await scrapeTranscriptFromUI();
            }

            showDebugToast('API Success!', 'green');

            // Parse caption events
            const segments: any[] = [];
            let fullText = '';

            for (const event of data.events) {
                if (event.segs) {
                    const text = event.segs.map((s: any) => s.utf8 || '').join('');
                    if (text.trim()) {
                        segments.push({
                            text: text.trim(),
                            offset: event.tStartMs || 0,
                            duration: event.dDurationMs || 0
                        });
                        fullText += text + ' ';
                    }
                }
            }

            if (segments.length === 0) {
                console.log('[ContentScript] No valid segments parsed');
                return null;
            }

            console.log(`[ContentScript] Successfully extracted ${segments.length} caption segments`);

            return {
                transcript: fullText.replace(/\s+/g, ' ').trim(),
                segments
            };

        } catch (error) {
            console.error('[ContentScript] Caption extraction error:', error);
            showDebugToast('API Error. Trying UI Fallback...', 'orange');
            return await scrapeTranscriptFromUI();
        }
    } catch (error) {
        console.error('[ContentScript] Fatal Caption extraction error:', error);
        return null;
    }
}

/**
 * Fallback method: Scrape transcript by interacting with the UI.
 * This is "Hybrid Scraper v3" - Verified internally on 2026-02-01.
 */
async function scrapeTranscriptFromUI(): Promise<{ transcript: string; segments: any[] } | null> {
    console.log('[ContentScript] Attempting UI-based transcript extraction (Hybrid v3)...');

    // 1. FAST CHECK: Is it already open?
    let segments = Array.from(document.querySelectorAll('ytd-transcript-segment-renderer'));
    if (segments.length > 0) {
        console.log('[ContentScript] Transcript sidebar already open. Extracting immediately.');
        return extractTextFromSegments(segments);
    }

    // Helper: Find transcript button with multiple selectors
    const findTranscriptButton = () => {
        // 1. Text Content
        const buttons = Array.from(document.querySelectorAll('button, tp-yt-paper-button'));
        const textBtn = buttons.find(b => b.textContent && b.textContent.toLowerCase().includes('show transcript'));
        if (textBtn) return textBtn as HTMLElement;

        // 2. Aria Label
        const ariaBtn = document.querySelector('[aria-label*="Show transcript"]');
        if (ariaBtn) return ariaBtn as HTMLElement;

        // 3. Renderer Structure
        const rendererBtn = document.querySelector('ytd-video-description-transcript-section-renderer button');
        if (rendererBtn) return rendererBtn as HTMLElement;

        return null;
    };

    // 2. Look for button immediately
    let transcriptButton = findTranscriptButton();

    // 3. If not found, Expand Description (CRITICAL STEP)
    if (!transcriptButton) {
        console.log('[ContentScript] Button not found. Attempting expansion...');
        const expanders = [
            '#expand',
            '#description-inline-expander #expand',
            '#description-inline-expander .more-button',
            'ytd-text-inline-expander #expand'
        ];

        let expanded = false;
        for (const selector of expanders) {
            const el = document.querySelector(selector) as HTMLElement;
            if (el && el.offsetParent !== null) { // Check visibility
                console.log(`[ContentScript] Clicking expander: ${selector}`);
                el.click();
                expanded = true;
                break;
            }
        }

        if (expanded) {
            // Wait for DOM
            await new Promise(r => setTimeout(r, 1000));
            transcriptButton = findTranscriptButton();
        }
    }

    // 4. Click & Wait
    if (transcriptButton) {
        console.log('[ContentScript] Clicking "Show transcript" button...');
        transcriptButton.click();

        // Wait for segments to appear (up to 4s)
        for (let i = 0; i < 20; i++) {
            await new Promise(r => setTimeout(r, 200));
            segments = Array.from(document.querySelectorAll('ytd-transcript-segment-renderer'));
            if (segments.length > 0) break;
        }
    } else {
        console.warn('[ContentScript] Could not find "Show transcript" button even after expansion.');
        return null;
    }

    if (segments.length === 0) {
        console.error('[ContentScript] Sidebar opened but no segments found.');
        return null;
    }

    return extractTextFromSegments(segments);
}

function extractTextFromSegments(segments: Element[]) {
    console.log(`[ContentScript] Extracting text from ${segments.length} segments`);

    const parsedSegments = segments.map(segment => {
        const timeEl = segment.querySelector('.segment-timestamp');
        const textEl = segment.querySelector('.segment-text') || segment.querySelector('.segment-text yt-formatted-string');

        return {
            text: textEl?.textContent?.trim() || '',
            timestamp: timeEl?.textContent?.trim() || '',
        };
    }).filter(s => s.text);

    const fullText = parsedSegments.map(s => s.text).join(' ');

    return {
        transcript: fullText,
        segments: parsedSegments
    };
}

/**
 * Get player response from window object using script injection
 */
async function getPlayerResponseFromWindow(): Promise<any> {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.textContent = `
            window.postMessage({
                type: '__SYNTHESIS_PLAYER_RESPONSE__',
                data: window.ytInitialPlayerResponse || null
            }, '*');
        `;
        document.documentElement.appendChild(script);
        script.remove();

        const handler = (event: MessageEvent) => {
            if (event.data?.type === '__SYNTHESIS_PLAYER_RESPONSE__') {
                window.removeEventListener('message', handler);
                resolve(event.data.data);
            }
        };

        window.addEventListener('message', handler);

        // Timeout after 1 second
        setTimeout(() => {
            window.removeEventListener('message', handler);
            resolve(null);
        }, 1000);
    });
}

/**
 * Capture audio from YouTube video element using MediaRecorder.
 * Falls back to capturing entire tab audio if video capture fails.
 * 
 * @param maxDurationSeconds - Maximum recording duration (default 5 minutes = 300s)
 * @returns Object with base64 audio data and mime type
 */
async function captureYouTubeAudio(maxDurationSeconds: number = 300): Promise<{ audioData: string; mimeType: string }> {
    // Find YouTube video element
    const video = document.querySelector('video') as HTMLVideoElement | null

    if (!video) {
        throw new Error('No video element found on this page')
    }

    // Check if video is playing, if not try to play it briefly
    const wasPlaying = !video.paused
    if (!wasPlaying) {
        // Video needs to be playing to capture audio
        throw new Error('Video is paused. Please play the video and try again.')
    }

    // Try to capture stream from video element
    let stream: MediaStream

    try {
        // Modern approach: capture directly from video element
        // Note: This may fail on cross-origin videos due to CORS
        stream = (video as any).captureStream ? (video as any).captureStream() : (video as any).mozCaptureStream()

        if (!stream) {
            throw new Error('captureStream not available')
        }

        // Extract only audio tracks
        const audioTracks = stream.getAudioTracks()
        if (audioTracks.length === 0) {
            throw new Error('No audio tracks in video stream')
        }

        // Create audio-only stream
        stream = new MediaStream(audioTracks)
    } catch (captureError) {
        console.warn('Direct video capture failed, will use tabCapture:', captureError)
        // Fallback: Request tabCapture through background script
        // For now, throw error - tabCapture requires different flow through background
        throw new Error('Unable to capture audio from this video. The video may have DRM protection.')
    }

    // Record using MediaRecorder
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'

    const recorder = new MediaRecorder(stream, { mimeType })
    const chunks: Blob[] = []

    return new Promise((resolve, reject) => {
        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunks.push(e.data)
            }
        }

        recorder.onstop = async () => {
            try {
                const blob = new Blob(chunks, { type: mimeType })

                // Convert to base64
                const reader = new FileReader()
                reader.onloadend = () => {
                    const base64 = (reader.result as string).split(',')[1] // Remove data URL prefix
                    resolve({ audioData: base64, mimeType: 'audio/webm' })
                }
                reader.onerror = () => reject(new Error('Failed to convert audio to base64'))
                reader.readAsDataURL(blob)
            } catch (error) {
                reject(error)
            }
        }

        recorder.onerror = (e) => {
            reject(new Error(`Recording error: ${e}`))
        }

        // Start recording
        recorder.start(1000) // Collect data every second

        // Stop after max duration or when video ends
        const maxMs = maxDurationSeconds * 1000
        const startTime = Date.now()

        const checkInterval = setInterval(() => {
            const elapsed = Date.now() - startTime

            // Stop if max duration reached
            if (elapsed >= maxMs) {
                clearInterval(checkInterval)
                recorder.stop()
                stream.getTracks().forEach(track => track.stop())
            }

            // Stop if video ended or paused
            if (video.ended || video.paused) {
                clearInterval(checkInterval)
                if (recorder.state === 'recording') {
                    recorder.stop()
                }
                stream.getTracks().forEach(track => track.stop())
            }
        }, 500)

        // Also set a hard timeout
        setTimeout(() => {
            clearInterval(checkInterval)
            if (recorder.state === 'recording') {
                recorder.stop()
            }
            stream.getTracks().forEach(track => track.stop())
        }, maxMs + 1000)
    })
}

// Visual Debug Helper — only shows DOM toasts in dev mode
function showDebugToast(message: string, color: string = 'blue') {
    // Always log to console for debugging
    console.log(`[Synthesis] ${message}`);

    // Only inject visible DOM toasts in development
    if (!import.meta.env.DEV) return;

    let toast = document.getElementById('synthesis-debug-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'synthesis-debug-toast';
        toast.style.position = 'fixed';
        toast.style.top = '10px';
        toast.style.right = '10px';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '5px';
        toast.style.color = 'white';
        toast.style.fontFamily = 'monospace';
        toast.style.zIndex = '999999';
        toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
        toast.style.transition = 'all 0.3s ease';
        document.body.appendChild(toast);
    }
    toast.style.backgroundColor = color === 'green' ? '#10B981' : color === 'orange' ? '#F59E0B' : '#3B82F6';
    toast.textContent = `[Synthesis] ${message}`;

    // Auto remove after 5s
    setTimeout(() => {
        if (toast) toast.style.opacity = '0';
        setTimeout(() => toast?.remove(), 500);
    }, 5000);
}
