import {Attachment, TimeStamp} from './common.schema.js';

export interface GetMessageReq {
    from: number
    chatid: string
}

export interface GetMessagePosReq {
    messageId: string
    chatid: string
}

export interface GetPinnedMessagesReq {
    chatid: string
}

export interface EditMessageReq {
    message: string
    messageId: string
    chatid: string
    userid: string
}

export interface FinishMessageReq {
    uploadId: string | null
    message: string
    replyTo: string
    replyToMessage: string
    chatid: string
    userid: string
}

export interface ReadMessagesReq {
    chatid: string
    userid: string
}

export interface PinMessageReq {
    chatid: string
    messageId: string
    userid: string
    message: string
}

export interface UnpinMessageReq {
    chatid: string,
    messageId: string,
    userid: string
}

export interface DeleteMessagesReq {
    messageIds: string[]
    chatid: string
    userid: string
}

export interface JoinWsRoomReq {
    connId: string
    chatid: string
    userid: string
}

// Response schemas
export interface GetMessagePosResp {
    messagePos: number
}

// Types
export interface Message {
    msgid: string
    author: string
    message: string
    sent_at: TimeStamp
    isEdited: boolean
    chatid: string
    files: Attachment[]
    seen: boolean
    replyTo: string
    replyToId: string
    forwardedFrom: string
    forwardedFromName: string
}

export interface PinnedMessage {
    message: string
    messageId: string
}

// WebSocket payloads
export interface WSMessageDeletedPayload {
    messageId: string
}

export interface WSMessageEditedPayload {
    messageId: string
    message: string
}

export interface WSMessagePinnedPayload {
    chatid: string
    messageId: string
    message: string
}

export interface WSMessagesReadPayload {
    userid: string
}

export interface WSMessageUnpinnedPayload {
    chatid: string
    messageId: string
}