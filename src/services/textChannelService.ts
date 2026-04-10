import {DatabaseAPI} from '../storage/database.js';
import {AxiosInstance, isAxiosError} from "axios";
import {MessageListener} from '../domain/websocket.schema.js';
import {getClient} from '../core/http.js';
import {WebSocketHandler} from '../core/webSocketHandler.js';
import {
    DeleteMessagesReq,
    EditMessageReq,
    FinishMessageReq,
    GetMessagePosResp, JoinWsRoomReq,
    Message, PinMessageReq,
    PinnedMessage, ReadMessagesReq, UnpinMessageReq
} from '../domain/textChannelService.schema.js';
import {NetworkInvite} from '../domain/networkService.schema.js';
import {GenericErrorBody} from '../domain/http.schema.js';
import {FileData, FileUploadProgressListener} from '../domain/fileUploadService.schema.js';
import {FileUploadService} from './fileUploadService.js';

export class TextChannelServiceService {
    userid: string;
    networkId: string;
    categoryId: string;
    channelId: string;
    token: string;
    database: DatabaseAPI;
    client: AxiosInstance

    constructor(userid: string, token: string, networkId: string, categoryId: string, channelId: string, database: DatabaseAPI, wsMessageListener: MessageListener) {
        this.userid = userid;
        this.networkId = networkId;
        this.categoryId = categoryId;
        this.channelId = channelId;
        this.database = database;
        this.token = token;
        this.client = getClient(false).create({
            headers: {
                "Authorization": token,
                "X-WS-ID": WebSocketHandler.getInstance().connId
            }
        })
        WebSocketHandler.getInstance().registerService({
            identifier: channelId,
            onNewConnId: newConnId => this.onNewConnId(newConnId),
            onNewMessage: wsMessageListener,
        })
    }

    private onNewConnId(newConnId: string) {
        console.log("NetworkService: New connection id")
        this.client.defaults.headers["X-WS-ID"] = newConnId;
    }

    /**
     * Fetches all messages in the chat
     * @param from
     */
    async get(from: number = 0): Promise<Message[]> {
        try {
            const resp = await this.client.get<Message[]>(`network/channel/messages?networkId=${this.networkId}&channelId=${this.channelId}&categoryId=${this.categoryId}&userid=${this.userid}&from=${from}`);
            if (from == 0) {
                this.database.set("networkmessages", this.channelId, JSON.stringify(resp.data))
            }
            console.log(resp.data, "ASD")
            return resp.data
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async getQuick(): Promise<Message[]> {
        const messages = await this.database.get("networkmessages", this.channelId)
        if (messages) {
            return JSON.parse(messages)
        } else {
            throw new Error("No messages in database")
        }
    }

    /**
     * Fetches the position of the specified message which can be used in get() to fetch an old message with it's surrounding messages
     * @param messageId
     */
    async getMessagePos(messageId: string): Promise<number> {
        try {
            const resp = await this.client.get<GetMessagePosResp>(`network/channel/getMessagePosition?networkId=${this.networkId}&channelId=${this.channelId}&categoryId=${this.categoryId}&userid=${this.userid}&messageId=${messageId}`);
            return resp.data.messagePos
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Gets all messages pinned in the chat
     */
    async getPinnedMessages(): Promise<PinnedMessage[]> {
        try {
            const resp = await this.client.get<PinnedMessage[]>(`network/channel/pinnedMessages?networkId=${this.networkId}&channelId=${this.channelId}&categoryId=${this.categoryId}&userid=${this.userid}`);
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Edits the specified message
     * @param messageId
     * @param newMessage
     */
    async editMessage(messageId: string, newMessage: string): Promise<void> {
        try {
            const resp = await this.client.patch("network/channel/editMessage", <EditMessageReq>{
                messageId: messageId,
                networkId: this.networkId,
                channelId: this.channelId,
                categoryId: this.categoryId,
                userid: this.userid,
                message: newMessage
            });
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Sends a new message to the chat
     * @param tempMsgId
     * @param message
     * @param replyTo
     * @param replyToMessage
     * @param attachments
     * @param progressListener
     */
    async sendMessage(tempMsgId: string, message: string, replyTo: string | null = null, replyToMessage: string | null = null, attachments: FileData[] | null = null, progressListener: FileUploadProgressListener | null = null): Promise<Message> {
        let uploadId = ""
        if (attachments) {
            const uploader = new FileUploadService(this.token)
            uploadId = await uploader.uploadFiles(tempMsgId, this.channelId, this.userid, attachments, progressListener!)
        }
        try {
            const resp = await this.client.post<Message>("network/channel/finishMessage", <FinishMessageReq>{
                message: message,
                networkId: this.networkId,
                channelId: this.channelId,
                categoryId: this.categoryId,
                replyTo: replyTo,
                replyToMessage: replyToMessage,
                userid: this.userid,
                uploadId: uploadId,
            });
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Reads all messages sent to you in the chat
     */
    async readMessages(): Promise<void> {
        try {
            await this.client.patch("network/channel/readMessages", <ReadMessagesReq>{
                networkId: this.networkId,
                channelId: this.channelId,
                categoryId: this.categoryId,
                userid: this.userid,
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
     * Pins the specified message
     * @param messageId
     * @param message
     */
    async pinMessage(messageId: string, message: string): Promise<void> {
        try {
            const resp = await this.client.patch("network/channel/pinMessage", <PinMessageReq>{
                messageId: messageId,
                networkId: this.networkId,
                channelId: this.channelId,
                categoryId: this.categoryId,
                userid: this.userid,
                message: message
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
     * Unpins the specified message
     * @param messageId
     */
    async unpinMessage(messageId: string): Promise<void> {
        try {
            const resp = await this.client.patch("network/channel/unpinMessage", <UnpinMessageReq>{
                messageId: messageId,
                networkId: this.networkId,
                channelId: this.channelId,
                categoryId: this.categoryId,
                userid: this.userid,
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
     * Deletes the message(s)
     * @param messageIds
     */
    async deleteMessages(messageIds: string[]): Promise<void> {
        try {
            const resp = await this.client.patch("network/channel/deleteMessages", <DeleteMessagesReq>{
                networkId: this.networkId,
                channelId: this.channelId,
                categoryId: this.categoryId,
                userid: this.userid,
                messageIds: messageIds
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
     * Joins the WebSocket room to start receiving realtime messages
     */
    async joinWebSocketRoom(): Promise<void> {
        try {
            const resp = await this.client.patch("network/channel/joinWebSocketRoom", <JoinWsRoomReq>{
                networkId: this.networkId,
                channelId: this.channelId,
                categoryId: this.categoryId,
                userid: this.userid,
                connId: WebSocketHandler.getInstance().connId,
                disableAutoRemove: true
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