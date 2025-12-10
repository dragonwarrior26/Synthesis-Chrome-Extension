/**
 * Synthesis Audio Proxy - Cloudflare Worker
 * 
 * Provides YouTube audio URL extraction for videos without captions.
 * This is required because browser extensions cannot directly access YouTube audio.
 */

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
async function getAudioInfo(videoId: string): Promise<AudioInfo> {
    try {
        // Fetch video page to get player response
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const response = await fetch(videoUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        });

        if (!response.ok) {
            return {
                videoId,
                audioUrl: '',
                duration: 0,
                format: '',
                error: 'Failed to fetch video page',
            };
        }

        const html = await response.text();

        // Extract player response from page
        const playerResponseMatch = html.match(/var ytInitialPlayerResponse\s*=\s*({.+?});/);

        if (!playerResponseMatch) {
            return {
                videoId,
                audioUrl: '',
                duration: 0,
                format: '',
                error: 'Could not find player response',
            };
        }

        const playerResponse = JSON.parse(playerResponseMatch[1]);

        // Get video duration
        const duration = parseInt(playerResponse.videoDetails?.lengthSeconds || '0', 10);

        // Get adaptive formats (includes audio-only streams)
        const adaptiveFormats = playerResponse.streamingData?.adaptiveFormats || [];

        // Find best audio format (prefer m4a/mp4a for quality)
        const audioFormats = adaptiveFormats.filter((f: any) =>
            f.mimeType?.startsWith('audio/') && f.url
        );

        if (audioFormats.length === 0) {
            return {
                videoId,
                audioUrl: '',
                duration,
                format: '',
                error: 'No audio formats available (video may be restricted)',
            };
        }

        // Sort by bitrate and get the best one
        audioFormats.sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0));
        const bestAudio = audioFormats[0];

        return {
            videoId,
            audioUrl: bestAudio.url,
            duration,
            format: bestAudio.mimeType?.split(';')[0] || 'audio/mp4',
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
