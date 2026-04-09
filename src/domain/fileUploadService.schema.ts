// Request schemas
export interface RegisterUploadReq {
    roomId: string
    userid: string
    files: FileUploadRegistration[]
}

export interface ChunkUploadReq {
    uploadId: string
    fileId: string
    chunk: string
    roomId: string
    userid: string
}

export interface FinishUploadReq {
    uploadId: string
    roomId: string
    userid: string
}

// Response schemas
export interface RegisterUploadResp {
    uploadId: string
}

// Types
export interface FileUploadRegistration {
    size: number
    type: string
    name: string
    fileId: string
}

export interface FileData {
    fileId: string
    name: string
    extension: string
    type: string
    data: File
}

export interface FileUploadProgressListener {
    fileProgressUpdate: (tempMsgId: string, fileId: string, allChunks: number, chunksDone: number) => void
}