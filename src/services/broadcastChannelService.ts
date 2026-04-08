import {AxiosInstance, isAxiosError} from "axios";
import {getClient} from '../core/http.js';
import {MessageListener} from '../domain/websocket.schema.js';
import {WebSocketHandler} from '../core/webSocketHandler.js';
import {AcceptInviteReq} from '../domain/networkService.schema.js';
import {GenericErrorBody} from '../domain/http.schema.js';
import {
    CreateServerReq,
    GetRTMPDataReq,
    JoinWebsocketRoomReq,
    StreamRegistry
} from '../domain/broadcastChannelService.schema.js';

export class BroadcastChannelService {
    userid: string
    channelId: string
    networkId: string
    categoryId: string
    client: AxiosInstance;

    constructor(token: string, userid: string, networkId: string, categoryId: string, channelId: string, wsMessageListener: MessageListener) {
        this.userid = userid;
        this.channelId = channelId;
        this.categoryId = categoryId;
        this.networkId = networkId;
        this.client = getClient(false).create({
            headers: {
                "Authorization": token,
                "X-WS-ID": WebSocketHandler.getInstance().connId
            }
        })
        WebSocketHandler.getInstance().registerService({
            identifier: channelId,
            onNewConnId: this.onNewConnId,
            onNewMessage: wsMessageListener,
        })
    }

    private onNewConnId(newConnId: string) {
        console.log("NetworkService: New connection id")
        this.client.defaults.headers["X-WS-ID"] = newConnId;
    }

    async getData(): Promise<StreamRegistry> {
        try {
            const resp = await this.client.get<StreamRegistry>(`network/channel/rtmpData?userid=${this.userid}&channelId=${this.channelId}&networkId=${this.networkId}&categoryId=${this.categoryId}`);
            return resp.data
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async createServer(): Promise<StreamRegistry> {
        try {
            const resp = await this.client.post<StreamRegistry>("network/channel/createServer", <CreateServerReq>{
                userid: this.userid,
                channelId: this.channelId,
                networkId: this.networkId,
                type: "rtmp",
                categoryId: this.categoryId,
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

    async joinWebSocketRoom(): Promise<void> {
        try {
            await this.client.post("v2/network/channel/joinWebSocketRoom", <JoinWebsocketRoomReq>{
                userid: this.userid,
                channelId: this.channelId,
                networkId: this.networkId,
                connId: WebSocketHandler.getInstance().connId,
                categoryId: this.categoryId,
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