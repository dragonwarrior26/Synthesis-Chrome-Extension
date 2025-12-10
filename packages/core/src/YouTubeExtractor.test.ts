import { describe, it, expect, vi, beforeEach } from 'vitest';
import { YouTubeExtractor } from './YouTubeExtractor';

describe('YouTubeExtractor', () => {
    describe('isYouTube', () => {
        it('should detect standard YouTube watch URLs', () => {
            expect(YouTubeExtractor.isYouTube('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
            expect(YouTubeExtractor.isYouTube('https://youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
            expect(YouTubeExtractor.isYouTube('http://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
        });

        it('should detect YouTube short URLs', () => {
            expect(YouTubeExtractor.isYouTube('https://youtu.be/dQw4w9WgXcQ')).toBe(true);
        });

        it('should detect YouTube embed URLs', () => {
            expect(YouTubeExtractor.isYouTube('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(true);
        });

        it('should detect YouTube shorts URLs', () => {
            expect(YouTubeExtractor.isYouTube('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe(true);
        });

        it('should reject non-YouTube URLs', () => {
            expect(YouTubeExtractor.isYouTube('https://vimeo.com/123456789')).toBe(false);
            expect(YouTubeExtractor.isYouTube('https://google.com')).toBe(false);
            expect(YouTubeExtractor.isYouTube('https://example.com/watch?v=abc123')).toBe(false);
        });
    });

    describe('extractVideoId', () => {
        it('should extract video ID from standard watch URL', () => {
            expect(YouTubeExtractor.extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
        });

        it('should extract video ID from short URL', () => {
            expect(YouTubeExtractor.extractVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
        });

        it('should extract video ID from embed URL', () => {
            expect(YouTubeExtractor.extractVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
        });

        it('should extract video ID from shorts URL', () => {
            expect(YouTubeExtractor.extractVideoId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
        });

        it('should handle URLs with additional parameters', () => {
            expect(YouTubeExtractor.extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120')).toBe('dQw4w9WgXcQ');
            expect(YouTubeExtractor.extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLxxx')).toBe('dQw4w9WgXcQ');
        });

        it('should return null for invalid URLs', () => {
            expect(YouTubeExtractor.extractVideoId('https://google.com')).toBeNull();
            expect(YouTubeExtractor.extractVideoId('not a url')).toBeNull();
        });
    });

    describe('getThumbnailUrl', () => {
        it('should return correct thumbnail URL', () => {
            const videoId = 'dQw4w9WgXcQ';
            expect(YouTubeExtractor.getThumbnailUrl(videoId)).toBe('https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg');
        });

        it('should return correct HQ thumbnail URL', () => {
            const videoId = 'dQw4w9WgXcQ';
            expect(YouTubeExtractor.getHQThumbnailUrl(videoId)).toBe('https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg');
        });
    });

    describe('formatDuration', () => {
        it('should format seconds correctly', () => {
            expect(YouTubeExtractor.formatDuration(45)).toBe('0:45');
        });

        it('should format minutes and seconds correctly', () => {
            expect(YouTubeExtractor.formatDuration(125)).toBe('2:05');
            expect(YouTubeExtractor.formatDuration(600)).toBe('10:00');
        });

        it('should format hours, minutes, and seconds correctly', () => {
            expect(YouTubeExtractor.formatDuration(3661)).toBe('1:01:01');
            expect(YouTubeExtractor.formatDuration(7200)).toBe('2:00:00');
        });
    });

    describe('formatTranscriptWithTimestamps', () => {
        it('should format transcript segments with timestamps', () => {
            const segments = [
                { text: 'Hello world', offset: 0, duration: 2000 },
                { text: 'This is a test', offset: 2000, duration: 3000 },
                { text: 'Goodbye', offset: 65000, duration: 1000 }
            ];

            const result = YouTubeExtractor.formatTranscriptWithTimestamps(segments);
            expect(result).toContain('[0:00] Hello world');
            expect(result).toContain('[0:02] This is a test');
            expect(result).toContain('[1:05] Goodbye');
        });
    });
});
