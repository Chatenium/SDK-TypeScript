import {http, HttpResponse} from "msw";
import {Chat} from '../../domain/chatService.schema.js';
import {FinishMessageReq, GetMessagePosResp, Message, PinnedMessage} from '../../domain/dmService.schema.js';
import {CreateNetworkReq, Network} from '../../domain/networkService.schema.js';

export const dmHandlers = [
    http.get('*/chat/dm/messages', () => {
        return HttpResponse.json(<Message[]>[{
            message: "This is a message",
        }])
    }),

    http.get('*/chat/dm/getMessagePosition', () => {
        return HttpResponse.json(<GetMessagePosResp>{
            messagePos: 5000
        })
    }),

    http.get('*/chat/dm/pinnedMessages', () => {
        return HttpResponse.json(<PinnedMessage[]>[{
            message: "This is a pinned message",
        }])
    }),

    http.post('*/chat/dm/finishMessage', async ({request}) => {
        const body = await request.json() as FinishMessageReq
        return HttpResponse.json(<Message>{
            message: body.message,
        })
    }),

    http.post('*/v2/chat/dm/joinWebSocketRoom', async () => {
        return HttpResponse.json()
    }),
]