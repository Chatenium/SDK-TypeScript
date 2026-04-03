import {http, HttpResponse} from "msw";
import {CreateNetworkReq, Network, NetworkInvite} from "../../domain/networkService.schema";
import {Album, Comment, CreateAlbumReq, GetResp} from "../../domain/pictureService.schema";

export const pictureHandlers = [
    http.get('*/picture/pictures', () => {
        return HttpResponse.json(<GetResp>{
            pictures: [{
                name: "Album name"
            }],
            userData: {
                username: "bob"
            }
        })
    }),

    http.post('*/picture/createAlbum', async ({request}) => {
        const body = await request.json() as CreateAlbumReq;
        return HttpResponse.json(<Album>{
            name: body.name,
        })
    }),

    http.get('*/picture/getAlbums', () => {
        return HttpResponse.json(<Album[]>[{
            name: "Album name"
        }])
    }),

    http.get('*/picture/comment', () => {
        return HttpResponse.json(<Comment[]>[{
            comment: "This is a comment",
        }])
    }),
]