import {http, HttpResponse} from "msw";
import {GetResp} from '../../domain/pictureService.schema.js';
import {Session} from '../../domain/userService.schema.js';

export const userHandler = [
    http.post('*/user/getSessions', () => {
        return HttpResponse.json(<Session[]>[{
            token: "sessionToken"
        }])
    }),
]