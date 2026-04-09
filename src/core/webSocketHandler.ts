import {
    WSListenerPipe,
    WSConnIdPayload,
    WSMakeTokenReq,
    WSMakeTokenResp,
    WSMessagePayload
} from '../domain/websocket.schema.js';
import {getClient} from './http.js';
import {CreateNetworkReq, Network} from '../domain/networkService.schema.js';
import {isAxiosError} from "axios";
import {GenericErrorBody} from '../domain/http.schema.js';
import {environment} from './environment.js';

export class WebSocketHandler {
    private static instance: WebSocketHandler;
    private listeners: Set<WSListenerPipe> = new Set();
    private connection: WebSocket | null = null;
    private connectionId: string | null = null;

    public static getInstance(): WebSocketHandler {
        if (!WebSocketHandler.instance) {
            WebSocketHandler.instance = new WebSocketHandler();
        }
        return WebSocketHandler.instance;
    }

    /**
     * Connects to Chatenium WS. The ConnectionId is applied automatically in every service. The onMessage pipe is accessible in every service where needed
     * @param userid
     * @param token Session token
     */
    public async connect(userid: string, token: string): Promise<void> {
        const client = getClient(false).create({
            headers: {
                "Authorization": token
            }
        })

        try {
            const resp = await client.post<WSMakeTokenResp>("v2/ws/makeToken", <WSMakeTokenReq>{
                userid: userid,
            });
            this.connection = new WebSocket(`${environment.get().wsUrl}/v2/ws?userid=${userid}&access_token=${resp.data.token}`)
            console.log("Connected to websocket successfully")
            this.startListening()
            return
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    public get connId(): string | null {
        return this.connectionId;
    }

    private startListening() {
        if (this.connection) {
            this.connection.onmessage = (event) => {
                const payl: WSMessagePayload = JSON.parse(event.data);
                if (payl.action == "connectionId") {
                    console.log("ConnectionID received")
                    const data: WSConnIdPayload = JSON.parse(payl.data);
                    this.listeners.forEach(listener => {
                        console.log(data.connId, listener)
                        listener.onNewConnId(data.connId)
                        this.connectionId = data.connId;
                    })
                } else {
                    this.listeners.forEach(listener => {
                        listener.onNewMessage(payl.action, payl.data)
                    })
                }
            }
        }
    }

    public registerService(service: WSListenerPipe) {
        console.log("Registering service", service)
        this.listeners.add(service);
    }

    public unregisterService(service: WSListenerPipe) {
        this.listeners.delete(service);
    }
}