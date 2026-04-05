// Request schemas
export interface GetChatsReq {
    userid: string
}

export interface StartNewReq {
    userid: string
    peerUsername: string
}

export interface ToggleChatMuteReq {
    userid: string
    chatid: string
}

export interface GetAvailabilityReq {
    targetId: string
    connId: string
}

export interface GetAvailabilityResp {
    available: boolean
}

// Types
export interface Chat {
    userid: string
    chatid: string
    username: string
    displayName: string
    pfp: string
    status: 0 | 1
    type: "outgoing" | "incoming"
    notifications: number
    muted: boolean
    latestMessage: LatestMessage
}

export interface LatestMessage {
    message: string
    isAuthor: boolean
    msgid: string
}