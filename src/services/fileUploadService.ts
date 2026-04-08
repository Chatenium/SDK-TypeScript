import {
    ChunkUploadReq,
    FileData, FileUploadProgressListener,
    FileUploadRegistration, FinishUploadReq,
    RegisterUploadReq,
    RegisterUploadResp
} from '../domain/fileUploadService.schema.js';
import {AxiosInstance, isAxiosError} from "axios";
import {getClient} from '../core/http.js';
import {InviteToCallReq} from '../domain/callService.schema.js';
import {GenericErrorBody} from '../domain/http.schema.js';
import {v4 as uuidv4} from 'uuid';

export class FileUploadService {
    client: AxiosInstance;
    cdnClient: AxiosInstance;

    constructor(token: string) {
        this.client = getClient(false).create({
            headers: {
                "Authorization": token
            }
        })
        this.cdnClient = getClient(true).create({
            headers: {
                "Authorization": token
            }
        })
    }

    private MIN_CHUNK_SIZE = 25000000

    private calculateChunkSize(totalSize: number) {
        let chunks = Math.floor(totalSize / this.MIN_CHUNK_SIZE);
        if (chunks === 0) return totalSize;
        const chunkSize = Math.ceil(totalSize / chunks);
        return Math.max(chunkSize, this.MIN_CHUNK_SIZE);
    }

    /**
     * Automatically registers the upload, calculates chunksize and uploads each chunk and returns with an uploadId that must be provided when sending the message
     * @param roomId chatid or channelId
     * @param userid
     * @param files
     * @param listener
     */
    async uploadFiles(roomId: string, userid: string, files: FileData[], listener: FileUploadProgressListener): Promise<string> {
        let registrations: FileUploadRegistration[] = [];

        files.forEach(file => {
            registrations.push({
                fileId: file.fileId,
                name: file.name,
                type: file.type,
                size: file.data.size,
            })
        })

        try {
            const resp = await this.client.post<RegisterUploadResp>("chat/cdnRegisterUpload", <RegisterUploadReq>{
                roomId: roomId,
                userid: userid,
                files: registrations,
            });
            for (let filesUploaded = 0; filesUploaded < files.length; filesUploaded++) {
                await this.uploadFile(resp.data.uploadId, roomId, userid, files[filesUploaded], registrations[filesUploaded], listener)
            }
            await this.finishUpload(roomId, userid, resp.data.uploadId)
            return resp.data.uploadId
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    private async finishUpload(roomId: string, userid: string, uploadId: string): Promise<void> {
        try {
            await this.cdnClient.post("chat/finishUpload", <FinishUploadReq>{
                roomId: roomId,
                userid: userid,
                uploadId: uploadId
            });
            return
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    private async uploadFile(uploadId: string, roomId: string, userid: string, file: FileData, registration: FileUploadRegistration, listener: FileUploadProgressListener): Promise<void> {
        const chunkSize = this.calculateChunkSize(file.data.size);
        const totalChunks = Math.ceil(file.data.size / chunkSize);

        const arrayBuffer = await file.data.arrayBuffer();

        for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, file.data.size);
            const chunk = new Uint8Array(arrayBuffer.slice(start, end));
            const base64 = this.uint8ToBase64(chunk);
            await this.uploadChunk(uploadId, roomId, userid, registration.fileId, base64);
            listener.fileProgressUpdate(file.fileId, totalChunks, i)
        }
    }

    private uint8ToBase64(uint8: Uint8Array): string {
        let binString = "";
        for (let i = 0; i < uint8.length; i++) {
            binString += String.fromCharCode(uint8[i]);
        }
        return btoa(binString);
    }

    private async uploadChunk(uploadId: string, roomId: string, userid: string, fileId: string, chunk: string): Promise<void> {
        try {
            await this.cdnClient.post<RegisterUploadResp>("chat/uploadChunk", <ChunkUploadReq>{
                roomId: roomId,
                userid: userid,
                fileId: fileId,
                chunk: chunk,
                uploadId: uploadId,
            });
            return
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }
}