export const permissions = {
    createAndEditCategories: 2,
    deleteCategories: 4,
    createAndEditChannels: 8,
    deleteChannels: 16,
    deleteAnyMessage: 32,
    pinMessages: 64,
    createAndEditRanks: 128,
    deleteRanks: 256,
    changeNetworkNamePictureAndVisibility: 512,
    createEmojis: 1024,
    deleteEmojis: 2048,
    manageEmbed: 4096,
    createWebhooks: 8192,
    deleteWebhooks: 16384,
    createInvites: 32768,
    deleteInvites: 65536,
    sendMessages: 131072,
    seeChannels: 262144,
    banMembers: 524288,
    kickMembers: 1048576,
    unAndAssignRanksToMember: 2097152,
}

/**
 * Determines whether the set of permissions includes the permission. Note that network owners have regular permissions just like the other members, so if the userid matches with the network's creator ID, then the permission is automatically granted. This logic is not included in this function.
 * @param permissions
 * @param permission
 */
export function permissionGranted(permissions: number, permission: number): Boolean {
    return (permissions & permission) === permission;
}