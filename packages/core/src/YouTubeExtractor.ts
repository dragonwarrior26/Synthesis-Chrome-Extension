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

            // Fetch transcript using youtube-transcript library
            const transcriptData: TranscriptResponse[] = await YoutubeTranscript.fetchTranscript(videoId);

            if (!transcriptData || transcriptData.length === 0) {
                return null;
            }

            // Convert to our format
            const segments: TranscriptSegment[] = transcriptData.map(item => ({
                text: item.text,
                offset: item.offset,
                duration: item.duration
            }));

            // Calculate total duration from last segment
            const lastSegment = transcriptData[transcriptData.length - 1];
            const totalDurationMs = lastSegment.offset + lastSegment.duration;
            const totalDurationSec = Math.ceil(totalDurationMs / 1000);

            // Join all text into a single transcript
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
        } catch (error) {
            // Captions not available or other error
            console.warn('Caption extraction failed:', error);
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
            const audioResponse = await fetch(`${backendUrl}/audio`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoId })
            });

            if (!audioResponse.ok) {
                console.error('Failed to get audio URL from backend');
                return null;
            }

            const audioInfo = await audioResponse.json() as {
                audioUrl: string;
                duration: number;
                error?: string;
            };

            if (audioInfo.error || !audioInfo.audioUrl) {
                console.error('Audio extraction error:', audioInfo.error);
                return null;
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
            return null;
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
