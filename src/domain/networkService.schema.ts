// Request schemas
import {RGB, TimeStamp} from "./common.schema";

export interface GetInvitesReq {
    networkId: string
}

export interface CreateNetworkReq {
    userid: string
    name: string
    visibility: string
    isImage: boolean
    data: string | null
    monogramLetter: string | null
}

export interface GetNetworksReq {
    userid: string
}

export interface AcceptInviteReq {
    userid: string
    inviteId: string
}

export interface JoinPublicNetworkReq {
    userid: string
    networkId: string
}

export interface CreateCategoryReq {
    name: string
    description: string
    userid: string
    networkId: string
}

export interface DeleteCategoryReq {
    categoryId: string
    userid: string
    networkId: string
}

export interface MoveCategoryReq {
    from: number
    to: number
    userid: string
    networkId: string
}

export interface LeaveNetworkReq {
    networkId: string
    userid: string
}

export interface DeleteNetworkReq {
    networkId: string
    userid: string
}

export interface CreateRankReq {
    name: string
    icon: string | null
    colors: RGB
    userid: string
    networkId: string
}

export interface CreateInviteReq {
    times: "once" | "unlimited"
    userid: string
    networkId: string
}

export interface MoveRankReq {
    from: number
    to: number
    userid: string
    networkId: string
}

export interface KickMemberReq {
    memberId: string
    userid: string
    networkId: string
}

export interface BanMemberReq {
    memberId: string
    userid: string
    networkId: string
}

export interface ModifyPermissionsReq {
    permissionChanges: PermissionUpdate[]
    rankId: string
    userid: string
    networkId: string
}

export interface OverwritePermissionReq {
    permissionNumber: number
    to: "block" | "grant" | "inherit"
    rankId: string
    categoryId: string
    userid: string
    networkId: string
}

export interface OverwriteChannelPermissionReq {
    permissionNumber: number
    to: "block" | "grant" | "inherit"
    rankId: string
    categoryId: string
    userid: string
    channelId: string
    networkId: string
}

export interface GetOverwritesReq {
    rankId: string
    categoryId: string
    userid: string
    networkId: string
}

export interface GetChannelOverwritesReq {
    rankId: string
    categoryId: string
    userid: string
    networkId: string
    channelId: string
}

export interface EditCategoryReq {
    categoryId: string
    name: string
    desc: string
    userid: string
    networkId: string
}

export interface UnbanMemberReq {
    memberId: string
    userid: string
    networkId: string
}

export interface GetBannedMembersReq {
    userid: string
    networkId: string
}

export interface DeleteRankReq {
    rankId: string
    userid: string
    networkId: string
}

export interface EditRankReq {
    name: string
    icon: string | null
    colors: RGB
    userid: string
    networkId: string
    rankId: string
}

export interface DeleteRankReq {
    userid: string
    networkId: string
    rankId: string
}

export interface EditChannelReq {
    categoryId: string
    channelId: string
    name: string
    desc: string
    userid: string
    networkId: string
}

export interface RemoveRankFromMemberReq {
    targetUserId: string
    rankId: string
    userId: string
    networkId: string
}

export interface AssignRankToMemberReq {
    targetUserId: string
    rankId: string
    userId: string
    networkId: string
}

export interface GetMemberReq {
    userid: string
    networkId: string
}

export interface UploadNewPictureReq {
    picId: string
    userid: string
    networkId: string
}

export interface ChangeVisibilityReq {
    to: "private" | "public"
    userid: string
    networkId: string
}

export interface EditNameReq {
    name: string
    userid: string
    networkId: string
}

export interface CreateChannelReq {
    name: string
    description: string
    type: "message" | "broadcast" | "voice"
    categoryId: string
    userid: string
    networkId: string
}

export interface ToggleNetworkMuteReq {
    userid: string
    networkId: string
}

export interface ToggleCategoryMuteReq {
    userid: string
    networkId: string
    categoryId: string
}

export interface ToggleChannelNetworkMuteReq {
    userid: string
    networkId: string
    channelId: string
}

export interface JoinWebSocketRoomReq {
    userid: string
    connId: string
    networkId: string
}

export interface GetFromInviteReq {
    inviteId: string
}

// Types
export interface PermissionUpdate {
    granted: boolean
    permissionNumber: number
}

export interface NetworkInvite {
    inviteId: string
    createdBy: string
    created_at: TimeStamp
    onetime: boolean
    url: string
}

export interface Network {
    networkId: string
    name: string
    visibility: string
    createdBy: string
    created_at: TimeStamp
    picture: string
    members: NetworkMember[]
    bannedMembers: BannedMember[]
    categories: NetworkCategory[]
    invites: NetworkInvite[]
    ranks: NetworkRank[]
    permissions: number
    isMuted: boolean
}

export interface NetworkMember {
    userid: string
    memberSince: TimeStamp
}

export interface BannedMember {
    userid: string
    since: TimeStamp
}

export interface NetworkCategory {
    categoryId: string
    createdAt: TimeStamp
    name: string
    createdBy: string
    desc: string
    channels: NetworkChannel[]
    permissionOverwrites: PermissionOverwrite[]
    permissions: number
    isMuted: boolean
}

export interface NetworkChannel {
    name: string
    createdBy: string
    desc: string
    channelId: string
    created_at: TimeStamp
    type: "message" | "broadcast" | "voice"
    permissionOverwrites: PermissionOverwrite[]
    permissions: number
    notifications: number
    isMuted: boolean
}

export interface PermissionOverwrite {
    rankId: string
    overwrites: POW[]
}

export interface POW {
    permissionNumber: number
    to: "block" | "grant" | "inherit"
}

export interface NetworkRank {
    rankId: string
    name: string
    color: RGB
    icon: string
    permissions: number
    members: string[]
    createdBy: string
    createdAt: TimeStamp
}

export interface NetworkDiscovery {
    name: string
    picture: string
    members: number
    categories: number
    channels: number
    createdBy: string
    networkId: string
}

// WebSocket payloads
export interface WSCategoryDeletedPayload {
    categoryId: string
}

export interface WSCategoryMovedPayload {
    from: number
    to: number
}

export interface WSMemberLeftPayload {
    userid: string
}

export interface WSRankMovedPayload {
    from: number
    to: number
}

export interface WSKickedPayload {
    networkId: string
    name: string
}

export interface WSBannedPayload {
    networkId: string
    name: string
}

export interface WSModifiedPermissionsPayload {
    userid: string
    rankId: string
    newRankPermissions: number
    newPermissions: number
}

export interface WSOverwrittenPermissionPayload {
    userid: string
    rankId: string
    overwritten: "channel" | "category"
    newPermission: number
    categoryId: string
    channelId: string | null
}

export interface WSEditedCategoryPayload {
    categoryId: string
    name: string
    desc: string
}

export interface WSRankRemovedPayload {
    rankId: string
}

export interface WSRankEditedPayload {
    rankId: string
    name: string
    color: RGB
}

export interface WSChannelRemovedPayload {
    categoryId: string
    channelId: string
}

export interface WSEditedChannelPayload {
    categoryId: string
    channelId: string
    name: string
    desc: string
}

export interface WSRankRemovedFromMemberPayload {
    userid: string
    rankId: string
}

export interface WSRankAssignedToMemberPayload {
    userid: string
    rankId: string
}

export interface WSNewNetworkPicPayload {
    url: string
}

export interface WSNewVisibilityPayload {
    visibility: string
}

export interface WSNewNamePayload {
    name: string
}

export interface WSNewChannelPayload {
    in: string
    channel: NetworkChannel
}