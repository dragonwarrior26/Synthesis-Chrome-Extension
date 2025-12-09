import { ExtractedContent } from './extractor'

export type MessageType = 'EXTRACT_CONTENT' | 'CONTENT_EXTRACTED' | 'ERROR' | 'START_CROP' | 'CROP_RESULT'

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

export type ExtensionMessage =
    | ExtractContentMessage
    | ContentExtractedMessage
    | ErrorMessage
    | StartCropMessage
    | CropResultMessage
