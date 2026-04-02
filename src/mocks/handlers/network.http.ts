import {http, HttpResponse} from "msw";
import {
    CreateCategoryReq, CreateInviteReq,
    CreateNetworkReq, DetailedMemberList,
    Network,
    NetworkCategory,
    NetworkInvite, POW
} from "../../domain/networkService.schema";
import {PublicUserData} from "../../domain/common.schema";

export const authHandlers = [
    http.get('*/network/invites', () => {
        return HttpResponse.json(<NetworkInvite[]>[
            {
                inviteId: "inviteId"
            }
        ])
    }),

    http.post('*/network/create', async ({request}) => {
        const body = await request.json() as CreateNetworkReq
        return HttpResponse.json(<Network>{
            name: body.name,
            visibility: body.visibility
        })
    }),

    http.post('*/network/get', async () => {
        return HttpResponse.json(<Network[]>[{
            name: "Test network"
        }])
    }),

    http.post('*/network/createCategory', async ({request}) => {
        const body = await request.json() as CreateCategoryReq
        return HttpResponse.json(<NetworkCategory>{
            name: body.name,
            desc: body.description
        })
    }),

    http.post('*/network/createInvite', async ({request}) => {
        const body = await request.json() as CreateInviteReq
        return HttpResponse.json(<NetworkInvite>{
            onetime: body.times == "once"
        })
    }),

    http.patch('*/network/getOverwrites', async ({request}) => {
        return HttpResponse.json(<POW[]>[{
            permissionNumber: 5000
        }])
    }),

    http.patch('*/network/getChannelOverwrites', async ({request}) => {
        return HttpResponse.json(<POW[]>[{
            permissionNumber: 5000
        }])
    }),

    http.patch('*/network/getBannedMembers', async ({request}) => {
        return HttpResponse.json(<PublicUserData[]>[{
            username: "bob",
            displayName: "Bob",
        }])
    }),

    http.patch('*/network/getMembers', async ({request}) => {
        return HttpResponse.json(<DetailedMemberList[]>[{
            name: "Test rank",
            members: [{displayName: "Bob"}]
        }])
    }),
]