import { ExtractedContent } from './extractor'

export type MessageType = 'EXTRACT_CONTENT' | 'CONTENT_EXTRACTED' | 'ERROR' | 'START_CROP' | 'CROP_RESULT' | 'CAPTURE_YOUTUBE_AUDIO' | 'AUDIO_CAPTURED' | 'EXTRACT_YOUTUBE_CAPTIONS' | 'CAPTIONS_EXTRACTED'

export interface BaseMessage {
    type: MessageType
}

export interface ExtractContentMessage extends BaseMessage {
    type: 'EXTRACT_CONTENT'
}

export interface ContentExtractedMessage extends BaseMessage {
    type: 'CONTENT_EXTRACTED'
    payload: ExtractedContent
}

export interface ErrorMessage extends BaseMessage {
    type: 'ERROR'
    error: string
}

export interface StartCropMessage extends BaseMessage {
    type: 'START_CROP'
}

export interface CropResultMessage extends BaseMessage {
    type: 'CROP_RESULT'
    payload: { x: number, y: number, width: number, height: number, pixelRatio: number } | null
}

export interface CaptureYouTubeAudioMessage extends BaseMessage {
    type: 'CAPTURE_YOUTUBE_AUDIO'
    payload?: { maxDurationSeconds?: number }
}

export interface AudioCapturedMessage extends BaseMessage {
    type: 'AUDIO_CAPTURED'
    payload: { audioData: string; mimeType: string }
}

export interface ExtractYouTubeCaptionsMessage extends BaseMessage {
    type: 'EXTRACT_YOUTUBE_CAPTIONS'
}

export interface CaptionsExtractedMessage extends BaseMessage {
    type: 'CAPTIONS_EXTRACTED'
    payload: { transcript: string; segments: any[] }
}

export type ExtensionMessage =
    | ExtractContentMessage
    | ContentExtractedMessage
    | ErrorMessage
    | StartCropMessage
    | CropResultMessage
    | CaptureYouTubeAudioMessage
    | AudioCapturedMessage
    | ExtractYouTubeCaptionsMessage
    | CaptionsExtractedMessage
