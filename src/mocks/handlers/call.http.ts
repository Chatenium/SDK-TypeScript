import {http, HttpResponse} from "msw";
import {GetRTCAccessResp} from "../../domain/callService.schema";

export const callHandlers = [
    http.post('*/v2/chat/getRTCAccess', () => {
        return HttpResponse.json(<GetRTCAccessResp>{
            liveKitToken: "liveKitToken",
        })
    }),
]