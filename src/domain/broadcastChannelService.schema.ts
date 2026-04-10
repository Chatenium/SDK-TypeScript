export interface CreateServerReq {
    type: "rtmp",
    channelId: string
    categoryId: string
    networkId: string
}

export interface GetRTMPDataReq {
    channelId: string
    networkId: string
    categoryId: string
}

export interface JoinWebsocketRoomReq {
    userid: string
    connId: string
    channelId: string
    networkId: string
    categoryId: string
    disableAutoRemove: boolean
}

export interface StreamRegistry {
    streamKey: string
    status: "idling" | "broadcasting" | "broadcasting_starting"
    type: "rtmp"
    streamURL: string
    channelId: string
}