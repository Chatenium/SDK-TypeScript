import {DatabaseAPI} from "../storage/database";
import {getClient} from "../core/http";
import {AxiosInstance, isAxiosError} from "axios";
import {GenericErrorBody} from "../domain/http.schema";
import {
    AcceptInviteReq, AssignRankToMemberReq, BanMemberReq, ChangeVisibilityReq, CreateCategoryReq, CreateChannelReq,
    CreateInviteReq,
    CreateNetworkReq, CreateRankReq, DeleteCategoryReq,
    DeleteChannelReq, DeleteNetworkReq, DeleteRankReq,
    DetailedMemberList, EditCategoryReq, EditChannelReq, EditNameReq, EditRankReq,
    GetBannedMembersReq, GetChannelOverwritesReq, GetMembersReq,
    GetNetworksReq, GetOverwritesReq, JoinPublicNetworkReq, JoinWebSocketRoomReq, KickMemberReq, LeaveNetworkReq,
    ModifyPermissionsReq, MoveCategoryReq, MoveRankReq,
    Network, NetworkCategory, NetworkChannel, NetworkDiscovery,
    NetworkInvite, NetworkRank, OverwriteChannelPermissionReq, OverwritePermissionReq, PermissionUpdate, POW,
    RemoveRankFromMemberReq, ToggleCategoryMuteReq, ToggleChannelNetworkMuteReq, ToggleNetworkMuteReq,
    UnbanMemberReq, UploadNewPictureReq
} from "../domain/networkService.schema";
import {PublicUserData, RGB} from "../domain/common.schema";
import {WebSocketHandler} from "../core/webSocketHandler";
import {MessageListener} from "../domain/websocket.schema";

export class NetworkService {
    userid: string;
    networkId: string;
    database: DatabaseAPI;
    client: AxiosInstance

    constructor(userid: string, token: string, networkId: string, database: DatabaseAPI, wsMessageListener: MessageListener) {
        this.userid = userid;
        this.networkId = networkId;
        this.database = database;
        this.client = getClient(false).create({
            headers: {
                "Authorization": token,
                "X-WS-ID": WebSocketHandler.getInstance().connId
            }
        })
        WebSocketHandler.getInstance().registerService({
            identifier: networkId,
            onNewConnId: this.onNewConnId,
            onNewMessage: wsMessageListener,
        })
    }

    private onNewConnId(newConnId: string) {
        console.log("NetworkService: New connection id")
        this.client.defaults.headers["X-WS-ID"] = newConnId;
    }

    /**
     * Fetches all invites created for the network
     */
    async getInvites(): Promise<NetworkInvite[]> {
        try {
            const resp = await this.client.get<NetworkInvite[]>(`network/invites?networkId=${this.networkId}&userid=${this.userid}`);
            return resp.data
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Creates a new network
     * @param name Provided by the user
     * @param visibility name Provided by the user
     * @param data Optional base-64 encoded image for a custom network picture
     */
    async create(name: string, visibility: "public" | "private", data: string | null): Promise<Network> {
        try {
            const resp = await this.client.post<Network>("network/create", <CreateNetworkReq>{
                userid: this.userid,
                data: data,
                name: name,
                visibility: visibility,
                isImage: data != null,
                monogramLetter: name[0]
            });
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Gets all networks the user is in
     */
    async get(): Promise<Network[]> {
        try {
            const resp = await this.client.post<Network[]>("network/get", <GetNetworksReq>{
                userid: this.userid,
            });
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Accepts the invite and joins the network
     * @param inviteId
     */
    async acceptInvite(inviteId: string): Promise<void> {
        try {
            await this.client.post("network/acceptInvite", <AcceptInviteReq>{
                userid: this.userid,
                inviteId: inviteId,
            });
            return
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Joins a public network
     * @param networkId
     */
    async joinPublicNetwork(networkId: string): Promise<void> {
        try {
            const resp = await this.client.post("network/joinNetworkDiscovery", <JoinPublicNetworkReq>{
                userid: this.userid,
                networkId: networkId,
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
     * Creates a new category in the network
     * @param name Provided by the user
     * @param description Provided by the user
     */
    async createCategory(name: string, description: string): Promise<NetworkCategory> {
        try {
            const resp = await this.client.post<NetworkCategory>("network/createCategory", <CreateCategoryReq>{
                userid: this.userid,
                networkId: this.networkId,
                name: name,
                description: description
            });
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Deletes the selected category
     * @param categoryId
     */
    async deleteCategory(categoryId: string): Promise<void> {
        try {
            const resp = await this.client.patch("network/deleteCategory", <DeleteCategoryReq>{
                userid: this.userid,
                categoryId: categoryId,
                networkId: this.networkId,
            });
            return
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Moves a category from a specific place to another
     * @param from The category that will be moved
     * @param to The place where to category will be moved to
     */
    async moveCategory(from: number, to: number): Promise<void> {
        try {
            await this.client.patch("network/moveCategory", <MoveCategoryReq>{
                userid: this.userid,
                networkId: this.networkId,
                from: from,
                to: to,
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
     * Leaves the network
     */
    async leave(): Promise<void> {
        try {
            await this.client.post("network/leave", <LeaveNetworkReq>{
                userid: this.userid,
                networkId: this.networkId
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
     * Deletes the network (Must be owned by the user)
     */
    async delete(): Promise<void> {
        try {
            await this.client.post("network/delete", <DeleteNetworkReq>{
                userid: this.userid,
                networkId: this.networkId
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
     * Creates a new rank
     * @param name Provided by the user
     * @param colors Provided by the user
     * @param icon Optionally provided by the user
     */
    async createRank(name: string, colors: RGB, icon: string | null): Promise<NetworkRank> {
        try {
            const resp = await this.client.post<NetworkRank>("network/createRank", <CreateRankReq>{
                userid: this.userid,
                networkId: this.networkId,
                colors: colors,
                icon: icon,
                name: name,
            });
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Creates a new invite
     * @param times Whether the invite should be used once or unlimited times
     */
    async createInvite(times: "once" | "unlimited"): Promise<NetworkInvite> {
        try {
            const resp = await this.client.post<NetworkInvite>("network/createInvite", <CreateInviteReq>{
                userid: this.userid,
                networkId: this.networkId,
                times: times,
            });
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Moves a rank from a specific place to another
     * @param from The rank that will be moved
     * @param to The place where to rank will be moved to
     */
    async moveRank(from: number, to: number): Promise<void> {
        try {
            const resp = await this.client.patch("network/moveRank", <MoveRankReq>{
                userid: this.userid,
                networkId: this.networkId,
                from: from,
                to: to,
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
     * Kicks a specific member
     * @param memberId
     */
    async kickMember(memberId: string): Promise<void> {
        try {
            const resp = await this.client.patch("network/kickMember", <KickMemberReq>{
                userid: this.userid,
                networkId: this.networkId,
                memberId: memberId,
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
     * Bans a specific member
     * @param memberId
     */
    async banMember(memberId: string): Promise<void> {
        try {
            const resp = await this.client.patch("network/banMember", <BanMemberReq>{
                userid: this.userid,
                networkId: this.networkId,
                memberId: memberId,
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
     * Modifies the permissions of the selected rank
     * @param permissionChanges
     * @param rankId
     */
    async modifyRankPermissions(permissionChanges: PermissionUpdate[], rankId: string): Promise<void> {
        try {
            await this.client.patch("network/modifyPermissions", <ModifyPermissionsReq>{
                userid: this.userid,
                networkId: this.networkId,
                permissionChanges: permissionChanges,
                rankId: rankId
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
     * Creates a permission overwrite for a category
     * @param permissionNumber
     * @param to
     * @param rankId
     * @param categoryId
     */
    async overwritePermission(permissionNumber: number, to: string, rankId: string, categoryId: string): Promise<void> {
        try {
            await this.client.patch("network/overwritePermission", <OverwritePermissionReq>{
                userid: this.userid,
                networkId: this.networkId,
                permissionNumber: permissionNumber,
                rankId: rankId,
                categoryId: categoryId,
                category: categoryId,
                to: to,
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
     * Creates a permission overwrite for a specific channel
     * @param permissionNumber
     * @param to
     * @param rankId
     * @param categoryId
     * @param channelId
     */
    async overwriteChannelPermission(permissionNumber: number, to: string, rankId: string, categoryId: string, channelId: string): Promise<void> {
        try {
            await this.client.patch("network/overwriteChannelPermission", <OverwriteChannelPermissionReq>{
                userid: this.userid,
                networkId: this.networkId,
                permissionNumber: permissionNumber,
                rankId: rankId,
                categoryId: categoryId,
                to: to,
                channelId: channelId,
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
     * Fetches all permission overwrites made for a category
     * @param rankId
     * @param categoryId
     */
    async getOverwrites(rankId: string, categoryId: string): Promise<POW[]> {
        try {
            const resp = await this.client.patch<POW[]>("network/getOverwrites", <GetOverwritesReq>{
                userid: this.userid,
                networkId: this.networkId,
                rankId: rankId,
                categoryId: categoryId,
                category: categoryId,
            });
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     Fetches all permission overwrites made for a channel
     * @param rankId
     * @param categoryId
     * @param channelId
     */
    async getChannelOverwrites(rankId: string, categoryId: string, channelId: string): Promise<POW[]> {
        try {
            const resp = await this.client.patch<POW[]>("network/getChannelOverwrites", <GetChannelOverwritesReq>{
                userid: this.userid,
                networkId: this.networkId,
                rankId: rankId,
                categoryId: categoryId,
                category: categoryId,
                channelId: channelId
            });
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Modifies the name and/or description of a channel
     * @param categoryId
     * @param name
     * @param desc
     */
    async editCategory(categoryId: string, name: string, desc: string): Promise<void> {
        try {
            await this.client.patch("network/editCategory", <EditCategoryReq>{
                userid: this.userid,
                networkId: this.networkId,
                categoryId: categoryId,
                name: name,
                desc: desc,
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
     * Unbans a specific member
     * @param memberId
     */
    async unbanMember(memberId: string): Promise<void> {
        try {
            await this.client.patch("network/unbanMember", <UnbanMemberReq>{
                userid: this.userid,
                networkId: this.networkId,
                memberId: memberId,
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
     * Gets all banned members public user data
     */
    async getBannedMembers(): Promise<PublicUserData[]> {
        try {
            const resp = await this.client.patch<PublicUserData[]>("network/getBannedMembers", <GetBannedMembersReq>{
                userid: this.userid,
                networkId: this.networkId
            });
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Deletes a specific rank
     * @param rankId
     */
    async deleteRank(rankId: string): Promise<void> {
        try {
            await this.client.patch<PublicUserData[]>("network/deleteRank", <DeleteRankReq>{
                userid: this.userid,
                networkId: this.networkId,
                rankId: rankId,
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
     * Modifies the name, colors and/or the icon of a specific rank
     * @param rankId
     * @param name
     * @param colors
     * @param icon
     */
    async editRank(rankId: string, name: string, colors: RGB, icon: string | null): Promise<void> {
        try {
            await this.client.patch<PublicUserData[]>("network/editRank", <EditRankReq>{
                userid: this.userid,
                networkId: this.networkId,
                rankId: rankId,
                colors: colors,
                icon: icon,
                name: name,
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
     * Deletes a specific channel
     * @param categoryId
     * @param channelId
     */
    async deleteChannel(categoryId: string, channelId: string): Promise<void> {
        try {
            await this.client.patch<PublicUserData[]>("network/deleteChannel", <DeleteChannelReq>{
                userid: this.userid,
                networkId: this.networkId,
                categoryId: categoryId,
                channelId: channelId,
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
     * Edits a specific channel
     * @param categoryId
     * @param channelId
     * @param name
     * @param desc
     */
    async editChannel(categoryId: string, channelId: string, name: string, desc: string): Promise<void> {
        try {
            await this.client.patch<PublicUserData[]>("network/editChannel", <EditChannelReq>{
                userid: this.userid,
                networkId: this.networkId,
                categoryId: categoryId,
                channelId: channelId,
                name: name,
                desc: desc,
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
     * Removes a rank from a specific member
     * @param targetUserId
     * @param rankId
     */
    async removeRankFromMember(targetUserId: string, rankId: string): Promise<void> {
        try {
            await this.client.patch<PublicUserData[]>("network/removeRankFromMember", <RemoveRankFromMemberReq>{
                userid: this.userid,
                networkId: this.networkId,
                rankId: rankId,
                targetUserId: targetUserId,
                userId: this.userid,
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
     * Assigns a rank to a specific member
     * @param targetUserId
     * @param rankId
     */
    async assignRankToMember(targetUserId: string, rankId: string): Promise<void> {
        try {
            await this.client.patch<PublicUserData[]>("network/assignRankToMember", <AssignRankToMemberReq>{
                userid: this.userid,
                networkId: this.networkId,
                rankId: rankId,
                targetUserId: targetUserId,
                userId: this.userid,
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
     * Gets a detailed member list with all ranks and members inside them
     */
    async getMembers(): Promise<DetailedMemberList[]> {
        try {
            const resp = await this.client.patch<DetailedMemberList[]>("network/getMembers", <GetMembersReq>{
                userid: this.userid,
                networkId: this.networkId,
            });
            return resp.data
        } catch (e) {
            console.error(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Uploads a new network picture
     * @param picId
     */
    async uploadNewPic(picId: string): Promise<void> {
        try {
            await this.client.patch<PublicUserData[]>("network/uploadNewPic", <UploadNewPictureReq>{
                userid: this.userid,
                networkId: this.networkId,
                picId: picId,
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
     * Changes the visibility of the network
     * @param to
     */
    async changeVisibility(to: "public" | "private"): Promise<void> {
        try {
            await this.client.patch<PublicUserData[]>("network/changeVisibility", <ChangeVisibilityReq>{
                userid: this.userid,
                networkId: this.networkId,
                to: to,
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
     * Edits the name of the network
     * @param name
     */
    async editName(name: string): Promise<void> {
        try {
            await this.client.patch<PublicUserData[]>("network/editName", <EditNameReq>{
                userid: this.userid,
                networkId: this.networkId,
                name: name,
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
     * Creates a new channel inside a category in the network
     * @param categoryId
     * @param type
     * @param description
     * @param name
     */
    async createChannel(categoryId: string, type: "message" | "broadcast" | "voice", description: string, name: string): Promise<NetworkChannel> {
        try {
            const resp = await this.client.patch<NetworkChannel>("network/createChannel", <CreateChannelReq>{
                userid: this.userid,
                networkId: this.networkId,
                categoryId: categoryId,
                name: name,
                description: description,
                type: type,
            });
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * (un)mutes the network
     */
    async toggleMute(): Promise<void> {
        try {
            await this.client.patch<PublicUserData[]>("network/toggleMute", <ToggleNetworkMuteReq>{
                userid: this.userid,
                networkId: this.networkId
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
     * (un)mutes a category inside the network
     * @param categoryId
     */
    async toggleCategoryMute(categoryId: string): Promise<void> {
        try {
            await this.client.patch<PublicUserData[]>("network/toggleCatMute", <ToggleCategoryMuteReq>{
                userid: this.userid,
                networkId: this.networkId,
                categoryId: categoryId,
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
     * (un)mutes a channel inside a category in the network
     * @param channelId
     */
    async toggleChannelMute(channelId: string): Promise<void> {
        try {
            await this.client.patch<PublicUserData[]>("network/toggleChanMute", <ToggleChannelNetworkMuteReq>{
                userid: this.userid,
                networkId: this.networkId,
                channelId: channelId,
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
     * Starts listening for live changes inside the network
     * @param connId
     */
    async joinWebSocketRoom(connId: string): Promise<void> {
        try {
            await this.client.patch<PublicUserData[]>("v2/network/joinWebSocketRoom", <JoinWebSocketRoomReq>{
                userid: this.userid,
                networkId: this.networkId,
                connId: connId,
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
     * Fetches network data from an invitation
     * @param inviteId
     */
    async getFromInvite(inviteId: string): Promise<Network> {
        try {
            const resp = await this.client.get<Network>(`network/fromInvite?inviteId=${inviteId}`);
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Fetches network discovery (A list of public networks)
     */
    async getDiscovery(): Promise<NetworkDiscovery[]> {
        try {
            const resp = await this.client.get<NetworkDiscovery[]>("network/discovery");
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }
}