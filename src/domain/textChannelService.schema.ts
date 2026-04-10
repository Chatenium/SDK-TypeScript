import {Attachment, PublicUserData, TimeStamp} from './common.schema.js';

export interface GetMessageReq {
    from: number
    channelId: string
    networkId: string
    categoryId: string
}

export interface GetMessagePosReq {
    messageId: string
    channelId: string
    networkId: string
    categoryId: string
}

export interface GetPinnedMessagesReq {
    channelId: string
    networkId: string
    categoryId: string
}

export interface EditMessageReq {
    message: string
    messageId: string
    channelId: string
    networkId: string
    categoryId: string
    userid: string
}

export interface FinishMessageReq {
    uploadId: string | null
    message: string
    replyTo: string
    replyToMessage: string
    channelId: string
    networkId: string
    categoryId: string
    userid: string
}

export interface ReadMessagesReq {
    channelId: string
    networkId: string
    categoryId: string
    userid: string
}

export interface PinMessageReq {
    channelId: string
    networkId: string
    categoryId: string
    messageId: string
    userid: string
    message: string
}

export interface UnpinMessageReq {
    channelId: string
    networkId: string
    categoryId: string,
    messageId: string,
    userid: string
}

export interface DeleteMessagesReq {
    messageIds: string[]
    channelId: string
    networkId: string
    categoryId: string
    userid: string
}

export interface JoinWsRoomReq {
    connId: string
    channelId: string
    networkId: string
    categoryId: string
    userid: string
    disableAutoRemove: boolean
}

// Response schemas
export interface GetMessagePosResp {
    messagePos: number
}

// Types
export interface Message {
    msgid: string
    author: PublicUserData
    message: string
    sent_at: TimeStamp
    isEdited: boolean
    channelId: string
    networkId: string
    categoryId: string
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
    channelId: string
    networkId: string
    categoryId: string
    messageId: string
    message: string
}

export interface WSMessagesReadPayload {
    userid: string
}

export interface WSMessageUnpinnedPayload {
    channelId: string
    networkId: string
    categoryId: string
    messageId: string
}