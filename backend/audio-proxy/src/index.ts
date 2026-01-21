/**
 * Synthesis Audio Proxy - Cloudflare Worker
 * 
 * Provides YouTube audio URL extraction for videos without captions.
 * This is required because browser extensions cannot directly access YouTube audio.
 */

import { YtdlCore } from '@ybd-project/ytdl-core';

export interface Env {
    ENVIRONMENT: string;
}

interface AudioInfo {
    videoId: string;
    audioUrl: string;
    duration: number;
    format: string;
    error?: string;
}

// CORS headers for Chrome extension
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);

        // Health check endpoint
        if (url.pathname === '/health') {
            return Response.json(
                { status: 'ok', timestamp: new Date().toISOString() },
                { headers: corsHeaders }
            );
        }

        // Audio extraction endpoint
        if (url.pathname === '/audio' && request.method === 'POST') {
            try {
                const body = await request.json() as { videoId?: string };
                const videoId = body.videoId;

                if (!videoId || typeof videoId !== 'string') {
                    return Response.json(
                        { error: 'Missing or invalid videoId' },
                        { status: 400, headers: corsHeaders }
                    );
                }

                // Validate video ID format (11 characters, alphanumeric + hyphen + underscore)
                if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
                    return Response.json(
                        { error: 'Invalid video ID format' },
                        { status: 400, headers: corsHeaders }
                    );
                }

                const audioInfo = await getAudioInfo(videoId);
                return Response.json(audioInfo, { headers: corsHeaders });

            } catch (error) {
                console.error('Audio extraction error:', error);
                return Response.json(
                    { error: 'Failed to extract audio info' },
                    { status: 500, headers: corsHeaders }
                );
            }
        }

        // 404 for unknown routes
        return new Response('Not found', { status: 404, headers: corsHeaders });
    },
};

/**
 * Get audio stream info from YouTube video
 * 
 * This uses YouTube's public video info endpoint to extract audio URLs.
 * Note: This is a simplified implementation. For production, consider using
 * a more robust solution like yt-dlp or a dedicated service.
 */
/**
 * Get audio stream info from YouTube video using the InnerTube API (Android Client).
 * This is significantly more robust than scraping HTML.
 */
/**
 * Get audio stream info from YouTube video using @ybd-project/ytdl-core.
 * This library handles signature deciphering, client switching, and other complexity automatically.
 */
async function getAudioInfo(videoId: string): Promise<AudioInfo> {
    try {
        const ytdl = new YtdlCore({
            // Optional: configure clients if needed, but defaults are usually good
            hl: 'en',
            gl: 'US',
            // Disable file cache because Workers don't have a writable file system
            // This prevents "Invalid URL" errors when the library tries to read/write cache keys
            disableFileCache: true, 
            disableBasicCache: true
        });

        // Use getFullInfo (instance method) instead of getInfo
        // The library expects a full URL, not just an ID
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const info = await ytdl.getFullInfo(videoUrl);

        // Filter for audio-only formats (static method)
        const audioFormats = YtdlCore.filterFormats(info.formats, 'audioonly');

        if (audioFormats.length === 0) {
            throw new Error('No audio-only formats found');
        }

        // Select the format with the highest audio bitrate
        // Gemini handles various qualities well, but 'highestaudio' ensures clarity.
        // We manually sort if filterFormats doesn't sort by bitrate strictly.
        audioFormats.sort((a: any, b: any) => (b.audioBitrate || 0) - (a.audioBitrate || 0));

        const bestFormat = audioFormats[0];

        if (!bestFormat.url) {
            throw new Error('Audio URL is missing in best format');
        }

        return {
            videoId,
            audioUrl: bestFormat.url,
            duration: Number(info.videoDetails.lengthSeconds),
            format: bestFormat.mimeType?.split(';')[0] || 'audio/mp4',
        };

    } catch (error) {
        console.error('getAudioInfo error:', error);
        return {
            videoId,
            audioUrl: '',
            duration: 0,
            format: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
