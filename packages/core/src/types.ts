import { ExtractedContent } from './extractor'

export type MessageType = 'EXTRACT_CONTENT' | 'CONTENT_EXTRACTED' | 'ERROR'

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

export type ExtensionMessage =
    | ExtractContentMessage
    | ContentExtractedMessage
    | ErrorMessage
