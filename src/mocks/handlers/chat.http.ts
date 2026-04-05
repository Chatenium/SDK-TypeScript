import {http, HttpResponse} from "msw";
import {Chat, GetAvailabilityResp, StartNewReq} from "../../domain/chatService.schema";

export const chatHandlers = [
    http.get('*/chat/get', () => {
        return HttpResponse.json(<Chat[]>[{
            userid: "chatPartnerId"
        }])
    }),

    http.get('*/chat/availability', () => {
        return HttpResponse.json(<GetAvailabilityResp>{
            available: true
        })
    }),

    http.post('*/chat/startNew', async ({request}) => {
        const body = await request.json() as StartNewReq
        return HttpResponse.json(<Chat>{
            username: body.peerUsername
        })
    }),
]