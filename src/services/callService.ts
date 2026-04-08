import {getClient} from '../core/http.js';
import {OtpPleCodeSendTestingResp, OtpSendCodeReq} from '../domain/authService.schema.js';
import {isAxiosError} from "axios";
import {GenericErrorBody} from '../domain/http.schema.js';
import {GetRTCAccessReq, GetRTCAccessResp, InviteToCallReq} from '../domain/callService.schema.js';

export class CallService {
    userid: string;
    token: string;

    constructor(token: string, userid: string) {
        this.token = token;
        this.userid = userid;
    }

    /**
     * Calls your chat partner (WebSocket + Apple VoIP PUSH)
     * @param targetId
     * @param chatid
     */
    async inviteToCall(targetId: string, chatid: string): Promise<void> {
        try {
            await getClient(false).post("v2/chat/rtcInvite", <InviteToCallReq>{
                userid: this.userid,
                chatid: chatid,
                targetId: targetId
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
     * Provides access to liveKit and a WebRTC configuration
     * @param targetId
     * @param roomId
     * @param roomType
     * @param networkId
     */
    async getRTCAccess(targetId: string, roomId: string, roomType: string, networkId: string|null): Promise<GetRTCAccessResp> {
        try {
            const resp = await getClient(false).post("v2/chat/getRTCAccess", <GetRTCAccessReq>{
                userid: targetId,
                networkId: networkId,
                roomId: roomId,
                roomType: roomType,
            });
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }
}