/**
 * YouTube Extractor - Extracts transcripts from YouTube videos
 * 
 * Layer 1 (Free): Extract existing captions using youtube-transcript
 * Layer 2 (Pro): For videos without captions, audio will be sent to Gemini for STT
 */

import { YoutubeTranscript, TranscriptResponse } from 'youtube-transcript';

export interface YouTubeVideoInfo {
    videoId: string;
    url: string;
    title?: string;
    channelName?: string;
    duration?: number; // in seconds
    thumbnailUrl: string;
    transcript?: string;
    hasNativeCaptions: boolean;
}

export interface YouTubeTranscriptResult {
    videoId: string;
    transcript: string;
    duration: number; // total duration in seconds
    segments: TranscriptSegment[];
}

export interface TranscriptSegment {
    text: string;
    offset: number; // start time in ms
    duration: number; // duration in ms
}

// YouTube URL patterns
const YOUTUBE_REGEX = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export const YouTubeExtractor = {
    /**
     * Check if a URL is a YouTube video URL
     */
    isYouTube(url: string): boolean {
        return YOUTUBE_REGEX.test(url);
    },

    /**
     * Extract video ID from various YouTube URL formats
     */
    extractVideoId(url: string): string | null {
        const match = url.match(YOUTUBE_REGEX);
        return match ? match[1] : null;
    },

    /**
     * Get thumbnail URL for a video
     */
    getThumbnailUrl(videoId: string): string {
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    },

    /**
     * Get high-quality thumbnail URL
     */
    getHQThumbnailUrl(videoId: string): string {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    },

    /**
     * Extract transcript from a YouTube video using existing captions
     * This is the FREE tier - uses YouTube's auto-generated or manual captions
     * 
     * @param videoIdOrUrl - YouTube video ID or full URL
     * @returns Transcript result or null if no captions available
     */
    async extractCaptions(videoIdOrUrl: string): Promise<YouTubeTranscriptResult | null> {
        try {
            // Extract video ID if full URL is provided
            const videoId = this.isYouTube(videoIdOrUrl)
                ? this.extractVideoId(videoIdOrUrl)
                : videoIdOrUrl;

            if (!videoId) {
                console.error('Invalid YouTube URL or video ID');
                return null;
            }

            console.log(`[YouTubeExtractor] Fetching captions for video: ${videoId}`);

            // Method 1: Try the youtube-transcript library first
            try {
                const transcriptData: TranscriptResponse[] = await YoutubeTranscript.fetchTranscript(videoId);

                if (transcriptData && transcriptData.length > 0) {
                    console.log(`[YouTubeExtractor] Got ${transcriptData.length} caption segments from library`);

                    const segments: TranscriptSegment[] = transcriptData.map(item => ({
                        text: item.text,
                        offset: item.offset,
                        duration: item.duration
                    }));

                    const lastSegment = transcriptData[transcriptData.length - 1];
                    const totalDurationMs = lastSegment.offset + lastSegment.duration;
                    const totalDurationSec = Math.ceil(totalDurationMs / 1000);

                    const fullTranscript = transcriptData
                        .map(item => item.text)
                        .join(' ')
                        .replace(/\s+/g, ' ')
                        .trim();

                    return {
                        videoId,
                        transcript: fullTranscript,
                        duration: totalDurationSec,
                        segments
                    };
                }
            } catch (libError) {
                console.warn('[YouTubeExtractor] Library method failed, trying direct fetch:', libError);
            }

            // Method 2: Direct fetch from YouTube (works in extension context)
            const videoPageUrl = `https://www.youtube.com/watch?v=${videoId}`;
            const response = await fetch(videoPageUrl);

            if (!response.ok) {
                console.error(`[YouTubeExtractor] Failed to fetch video page: ${response.status}`);
                return null;
            }

            const html = await response.text();

            // Extract caption tracks from the page
            const captionTracksMatch = html.match(/"captionTracks":\s*(\[.*?\])/);
            if (!captionTracksMatch) {
                console.log('[YouTubeExtractor] No caption tracks found in page');
                return null;
            }

            let captionTracks;
            try {
                captionTracks = JSON.parse(captionTracksMatch[1]);
            } catch (e) {
                console.error('[YouTubeExtractor] Failed to parse caption tracks');
                return null;
            }

            if (!captionTracks || captionTracks.length === 0) {
                console.log('[YouTubeExtractor] Caption tracks array is empty');
                return null;
            }

            // Prefer English captions, fallback to first available
            const englishTrack = captionTracks.find((t: any) =>
                t.languageCode === 'en' || t.languageCode?.startsWith('en')
            );
            const captionTrack = englishTrack || captionTracks[0];

            if (!captionTrack?.baseUrl) {
                console.log('[YouTubeExtractor] No baseUrl in caption track');
                return null;
            }

            // Fetch the actual captions
            const captionUrl = captionTrack.baseUrl + '&fmt=json3';
            console.log(`[YouTubeExtractor] Fetching captions from: ${captionUrl.substring(0, 100)}...`);

            const captionResponse = await fetch(captionUrl);
            if (!captionResponse.ok) {
                console.error(`[YouTubeExtractor] Failed to fetch captions: ${captionResponse.status}`);
                return null;
            }

            const captionData = await captionResponse.json();

            if (!captionData.events || captionData.events.length === 0) {
                console.log('[YouTubeExtractor] No caption events in response');
                return null;
            }

            // Parse caption events
            const segments: TranscriptSegment[] = [];
            let fullText = '';

            for (const event of captionData.events) {
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
                console.log('[YouTubeExtractor] No valid caption segments found');
                return null;
            }

            const lastSeg = segments[segments.length - 1];
            const totalDurationSec = Math.ceil((lastSeg.offset + lastSeg.duration) / 1000);

            console.log(`[YouTubeExtractor] Successfully extracted ${segments.length} caption segments`);

            return {
                videoId,
                transcript: fullText.replace(/\s+/g, ' ').trim(),
                duration: totalDurationSec,
                segments
            };

        } catch (error) {
            console.error('[YouTubeExtractor] Caption extraction failed:', error);
            return null;
        }
    },

    /**
     * Fetch video metadata (title, author) using YouTube oEmbed API
     * No API key required
     */
    async fetchVideoMetadata(videoId: string): Promise<{ title: string; authorName: string } | null> {
        try {
            const url = `https://www.youtube.com/watch?v=${videoId}`;
            const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;

            const response = await fetch(oembedUrl);
            if (!response.ok) return null;

            const data = await response.json();
            return {
                title: data.title || 'Untitled Video',
                authorName: data.author_name || 'Unknown Channel'
            };
        } catch (error) {
            console.warn('Failed to fetch video metadata:', error);
            return null;
        }
    },

    /**
     * Extract video info and attempt caption extraction
     * Returns info about whether captions are available (determines Pro tier requirement)
     */
    async getVideoInfo(url: string): Promise<YouTubeVideoInfo | null> {
        const videoId = this.extractVideoId(url);

        if (!videoId) {
            return null;
        }

        // Fetch metadata and captions in parallel
        const [metadata, captionResult] = await Promise.all([
            this.fetchVideoMetadata(videoId),
            this.extractCaptions(videoId)
        ]);

        return {
            videoId,
            url,
            title: metadata?.title,
            channelName: metadata?.authorName,
            thumbnailUrl: this.getThumbnailUrl(videoId),
            transcript: captionResult?.transcript,
            duration: captionResult?.duration,
            hasNativeCaptions: captionResult !== null
        };
    },

    /**
     * Format transcript with timestamps for display
     */
    formatTranscriptWithTimestamps(segments: TranscriptSegment[]): string {
        return segments.map(seg => {
            const seconds = Math.floor(seg.offset / 1000);
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            const timestamp = `[${minutes}:${secs.toString().padStart(2, '0')}]`;
            return `${timestamp} ${seg.text}`;
        }).join('\n');
    },

    /**
     * Extract transcript using STT (Speech-to-Text) for videos without captions.
     * This is a Pro tier feature that uses Gemini for transcription.
     * 
     * @param videoId - YouTube video ID
     * @param backendUrl - URL of the audio proxy backend
     * @param geminiApiKey - User's Gemini API key
     * @returns Transcript result or null on failure
     */
    async extractWithSTT(
        videoId: string,
        backendUrl: string,
        geminiApiKey: string
    ): Promise<YouTubeTranscriptResult | null> {
        try {
            // 1. Get audio URL from backend proxy
            let audioResponse;
            try {
                audioResponse = await fetch(`${backendUrl}/audio`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ videoId })
                });
            } catch (err) {
                throw new Error(`STT Backend unreachable at ${backendUrl}. Please ensure the Audio Proxy is deployed.`);
            }

            if (!audioResponse.ok) {
                const text = await audioResponse.text();
                throw new Error(`Backend Error (${audioResponse.status}): ${text}`);
            }

            const audioInfo = await audioResponse.json() as {
                audioUrl: string;
                duration: number;
                error?: string;
            };

            if (audioInfo.error || !audioInfo.audioUrl) {
                throw new Error(audioInfo.error || 'Failed to extract audio URL');
            }

            // 2. Import GeminiService dynamically to avoid circular deps
            const { GeminiService } = await import('./gemini');
            const gemini = new GeminiService(geminiApiKey);

            // 3. Transcribe audio with Gemini
            const transcript = await gemini.transcribeAudio(audioInfo.audioUrl);

            return {
                videoId,
                transcript,
                duration: audioInfo.duration,
                segments: [] // No segments from STT
            };
        } catch (error) {
            console.error('STT extraction failed:', error);
            throw error; // Propagate error to UI
        }
    },

    /**
     * Convert duration in seconds to human readable format
     */
    formatDuration(seconds: number): string {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
};
