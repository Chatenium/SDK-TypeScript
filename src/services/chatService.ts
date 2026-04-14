import {DatabaseAPI} from '../storage/database.js';
import {MessageListener} from '../domain/websocket.schema.js';
import {getClient} from '../core/http.js';
import {WebSocketHandler} from '../core/webSocketHandler.js';
import {AxiosInstance, isAxiosError} from "axios";
import {NetworkInvite} from '../domain/networkService.schema.js';
import {GenericErrorBody} from '../domain/http.schema.js';
import {
    Chat,
    GetAvailabilityReq,
    GetAvailabilityResp,
    StartNewReq,
    ToggleChatMuteReq
} from '../domain/chatService.schema.js';
import {Message} from '../domain/dmService.schema.js';

/**
 * ChatService is an exception because it's one instance for all chats because it's unnecessary to create a new instance for each chat
 */
export class ChatService {
    userid: string;
    database: DatabaseAPI;
    client: AxiosInstance;

    constructor(userid: string, token: string, database: DatabaseAPI, wsMessageListener: MessageListener) {
        this.userid = userid;
        this.database = database;
        this.client = getClient(false).create({
            headers: {
                "Authorization": token,
            }
        })
        WebSocketHandler.getInstance().registerService({
            identifier: userid,
            onNewConnId: newConnId => this.onNewConnId(newConnId),
            onNewMessage: wsMessageListener,
        })
    }

    private onNewConnId(newConnId: string) {
        console.log("ChatService: New connection id")
        this.client.defaults.headers["X-WS-ID"] = newConnId;
    }

    /**
     * Fetches all chat partners
     */
    async get(): Promise<Chat[]> {
        try {
            const resp = await this.client.get<Chat[]>(`chat/get?userid=${this.userid}`);
            this.database.set("chats", this.userid, JSON.stringify(resp.data))
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async getQuick(): Promise<Chat[]> {
        const chats = await this.database.get("chats", this.userid)
        if (chats) {
            return JSON.parse(chats)
        } else {
            throw new Error("No chats in database")
        }
    }

    /**
     * Gets the availability of the specified user
     * @param userid
     */
    async getUserAvailability(userid: string): Promise<boolean> {
        try {
            const resp = await this.client.get<GetAvailabilityResp>(`chat/availability?target=${this.userid}&connId=${WebSocketHandler.getInstance().connId}`);
            return resp.data.available
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * (un)mutes the specified chat
     * @param chatid
     */
    async toggleMute(chatid: string): Promise<void> {
        try {
            const resp = await this.client.post("v2/chat/toggleMute", <ToggleChatMuteReq>{
                userid: this.userid,
                chatid: chatid,
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

    /**
     * Starts a new chat with the specified user
     * @param peerUsername
     */
    async startNew(peerUsername: string): Promise<Chat> {
        try {
            const resp = await this.client.post("chat/startNew", <StartNewReq>{
                userid: this.userid,
                peerUsername: peerUsername,
            });
            return resp.data
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }
}