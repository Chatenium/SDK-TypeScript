export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface TimeStamp {
    T: number;
    I: number;
}

export interface PublicUserData {
    pfp: string
    displayName: string
    username: string
    userid: string
}

export interface Attachment {
    fileId: string
    fileName: string
    format: string
    type: string
    path: string
    height: number
    width: number
    extraMetaData: Record<string, string> // Used by clients
}