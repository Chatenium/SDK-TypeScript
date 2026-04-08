import {DatabaseAPI} from '../storage/database.js';
import {AxiosInstance, isAxiosError} from "axios";
import {MessageListener} from '../domain/websocket.schema.js';
import {getClient} from '../core/http.js';
import {WebSocketHandler} from '../core/webSocketHandler.js';
import {CreateNetworkReq, Network} from '../domain/networkService.schema.js';
import {GenericErrorBody} from '../domain/http.schema.js';
import {
    AcceptFileTransferReq, DeclineFileTransferReq, FileTransferSendAnswerRTCReq,
    FileTransferSendICERTCReq, FileTransferSendOfferRTCReq,
    StartNewFileTransferReq,
    StartNewFileTransferResp,
    TransferableFileMetadata
} from '../domain/fileTransferService.schema.js';

export class FileTransferService {
    userid: string;
    peerId: string;
    transferId: string = "";
    client: AxiosInstance

    constructor(userid: string, token: string, peerId: string) {
        this.userid = userid;
        this.peerId = peerId;
        this.client = getClient(false).create({
            headers: {
                "Authorization": token,
            }
        })
    }

    /**
     * Starts a new file transfer with the specified user. The new transferId will be saved automatically and not required to be provided later.
     * @param transferableFiles
     */
    async startNew(transferableFiles: TransferableFileMetadata[]): Promise<string> {
        try {
            const resp = await this.client.post<StartNewFileTransferResp>("v2/chat/dm/startNewFileTransfer", <StartNewFileTransferReq>{
                userid: this.userid,
                targetUserId: this.peerId,
                metadata: transferableFiles
            });
            this.transferId = resp.data.transferId
            return resp.data.transferId
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Accepts the file transfer with the specified transferId. The transferId will be saved automatically and not required to be provided later.
     * @param transferId
     */
    async accept(transferId: string): Promise<RTCConfiguration> {
        try {
            const resp = await this.client.post<RTCConfiguration>("v2/chat/dm/acceptFileTransfer", <AcceptFileTransferReq>{
                userid: this.userid,
                senderId: this.peerId,
                transferId: transferId
            });
            this.transferId = transferId
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Declines the file transfer with the specified transferId.
     * @param transferId
     */
    async decline(transferId: string): Promise<void> {
        try {
            await this.client.post("v2/chat/dm/declineFileTransfer", <DeclineFileTransferReq>{
                userid: this.userid,
                senderId: this.peerId,
                transferId: transferId
            });
            return
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Forwards your RTC offer to the specified user.
     * @param offer
     */
    async sendRtcOffer(offer: string): Promise<void> {
        try {
            await this.client.post("v2/chat/dm/sendRtcOfferFileTransfer", <FileTransferSendOfferRTCReq>{
                userid: this.userid,
                peerId: this.peerId,
                transferId: this.transferId,
                offer: offer,
            });
            return
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Forwards your RTC answer to the specified user.
     * @param answer
     */
    async sendRtcAnswer(answer: string): Promise<void> {
        try {
            await this.client.post("v2/chat/dm/sendRtcAnswerFileTransfer", <FileTransferSendAnswerRTCReq>{
                userid: this.userid,
                peerId: this.peerId,
                transferId: this.transferId,
                answer: answer,
            });
            return
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Forwards your RTC ICE candidate to the specified user.
     * @param candidate
     */
    async sendRtcICE(candidate: string): Promise<void> {
        try {
            await this.client.post("v2/chat/dm/sendRtcICEFileTransfer", <FileTransferSendICERTCReq>{
                userid: this.userid,
                peerId: this.peerId,
                transferId: this.transferId,
                candidate: candidate,
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