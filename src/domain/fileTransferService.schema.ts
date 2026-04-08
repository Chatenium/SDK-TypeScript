export interface StartNewFileTransferReq {
    userid: string
    targetUserId: string
    metadata: TransferableFileMetadata[]
}

export interface AcceptFileTransferReq {
    userid: string
    senderId: string
    transferId: string
}

export interface DeclineFileTransferReq {
    userid: string
    senderId: string
    transferId: string
}

export interface FileTransferSendOfferRTCReq {
    userid: string
    peerId: string
    transferId: string
    offer: string
}

export interface FileTransferSendAnswerRTCReq {
    userid: string
    peerId: string
    transferId: string
    answer: string
}

export interface FileTransferSendICERTCReq {
    userid: string
    peerId: string
    transferId: string
    candidate: string
}

// Response schemas
export interface StartNewFileTransferResp {
    transferId: string
}

// WebSocket payloads
export interface WSNewFileTransferPayload {
    from: string
    transferId: string
    metadata: TransferableFileMetadata[]
}

export interface WSFileTransferAcceptedPayload {
    transferId: string
    rtcConfig: RTCConfiguration
}

export interface WSFileTransferDeclinedPayload {
    transferId: string
}

export interface WSFileTransferRTCOfferPayload {
    transferId: string
    offer: string
}

export interface WSFileTransferRTCAnswerPayload {
    transferId: string
    answer: string
}

export interface WSFileTransferRTCIcePayload {
    transferId: string
    candidate: string
}

// DataChannel payloads
export interface DCStartNewFilePayload {
    fileId: string
    fileIndex: number
    fileName: string
    totalChunks: number
}

export interface DCTransferFilePayload {
    fileId: string
    fileIndex: string
    chunk: string
}

// Types
export interface TransferableFileMetadata {
    fileId: string
    name: string
    size: number
}