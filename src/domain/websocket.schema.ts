export interface WSListenerPipe {
    identifier: string; // Any identifier that is unique to the service (chatid, networkId, etc...)
    onNewConnId: (newConnId: string) => void;
    onNewMessage: MessageListener;
}

export type MessageListener = (action: string, data: string) => void

export interface WSMakeTokenReq {
    userid: string
}

export interface WSMakeTokenResp {
    token: string
}

export interface WSConnIdPayload {
    connId: string
}

export interface WSConnIdPayload {
    connId: string
}

export interface WSMessagePayload {
    action: string,
    data: string
}