import {http, HttpResponse} from "msw";
import {GetResp} from "../../domain/pictureService.schema";
import {Session} from "../../domain/userService.schema";

export const userHandler = [
    http.post('*/user/getSessions', () => {
        return HttpResponse.json(<Session[]>[{
            token: "sessionToken"
        }])
    }),
]