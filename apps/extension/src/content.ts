import { ContentExtractor, type ExtensionMessage } from '@synthesis/core'

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

        // Fetch captions in JSON format
        const captionUrl = track.baseUrl + '&fmt=json3';
        console.log(`[ContentScript] Fetching captions from: ${captionUrl.substring(0, 80)}...`);

        const response = await fetch(captionUrl);
        if (!response.ok) {
            console.error(`[ContentScript] Caption fetch failed: ${response.status}`);
            return null;
        }

        const data = await response.json();

        if (!data.events || data.events.length === 0) {
            console.log('[ContentScript] No events in caption response');
            return null;
        }

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
        return null;
    }
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


