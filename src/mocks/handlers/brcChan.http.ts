import {http, HttpResponse} from "msw";
import {GetRTCAccessResp} from "../../domain/callService.schema";
import {StreamRegistry} from "../../domain/broadcastChannelService.schema";

export const brcChanHandlers = [
    http.get('*/network/channel/rtmpData', () => {
        return HttpResponse.json(<StreamRegistry>{
            status: "broadcasting_starting"
        })
    }),
]