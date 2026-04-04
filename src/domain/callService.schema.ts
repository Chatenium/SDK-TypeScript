export interface InviteToCallReq {
    userid: string
    chatid: string
    targetId: string
}

export interface GetRTCAccessReq {
    roomId: string
    roomType: string
    userid: string
    networkId: string
}

export interface GetRTCAccessResp {
    rtcConfig: RTCConfiguration
    liveKitToken: string
}