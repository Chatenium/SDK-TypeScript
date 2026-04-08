import {describe, expect, it} from "vitest";
import {NetworkService} from "../src/services/networkService";
import {DatabaseMock} from "../src/mocks/storage/database";
import {environment, SDKConfig} from "../src/core/environment";
import {getClient} from "../src/core/http";
import {faker} from "@faker-js/faker/locale/en";
import {AuthService} from "../src/services/authService";
import {RGB} from "../src/domain/common.schema";
import {NetworkPermissions, PermissionUpdate} from "../src/domain/networkService.schema";

const NETWORK_SERVICE_TESTING_NETWORK_ID = "000000000000000000000000"
const NETWORK_SERVICE_TESTING_USER_ID = "000000000000000000000000"
const NETWORK_SERVICE_TESTING_CATEGORY_ID = "111111111111111111111111"
const NETWORK_SERVICE_TESTING_SECONDARY_MEMBER_ID = "111111111111111111111111"
const NETWORK_SERVICE_TESTING_CHANNEL_ID = "222222222222222222222222"
const NETWORK_SERVICE_TESTING_RANK_ID = "333333333333333333333333"
const NETWORK_SERVICE_TESTING_INVITE_ID = "444444444444444444444444"
const NETWORK_SERVICE_TESTING_TOKEN = "testingToken"

describe("NetworkService Integration Testing", () => {
    const service = new NetworkService(
        NETWORK_SERVICE_TESTING_USER_ID,
        NETWORK_SERVICE_TESTING_TOKEN,
        NETWORK_SERVICE_TESTING_NETWORK_ID,
        new DatabaseMock(),
        (action, data) => {}
    )

    it("should get invites", async () => {
        const invites = await service.getInvites()
        expect(invites[0].onetime).toBeFalsy()
    })

    it("should create network", async () => {
        const netName = faker.internet.displayName()
        const network = await service.create(
            netName,
            "private",
            null
        )
        expect(network.name).toBe(netName)
    })

    it('should get networks', async () => {
        const networks = await service.get()
        expect(networks[0].name).toBe("Test Network")
    });

    it('should create category', async () => {
        const catName = faker.internet.displayName()
        const category = await service.createCategory(
            catName,
            faker.lorem.sentence(),
        )

        expect(category.name).toBe(catName)
    });

    it('should delete category', async () => {
        await service.deleteCategory(NETWORK_SERVICE_TESTING_CATEGORY_ID)
        const networks = await service.get()
        expect(networks[0].categories.length).toBe(0)
    });

    it('should move category', async () => {
        await service.createCategory("Test name", "Test desc")
        await service.moveCategory(0, 1)
        const networks = await service.get()
        expect(networks[0].categories[1].categoryId).toBe(NETWORK_SERVICE_TESTING_CATEGORY_ID)
    });

    it('should throw when leaving self-owned network', async () => {
        await expect(service.leave()).rejects.toThrow()
    });

    it('should create rank', async () => {
        const rankName = faker.internet.displayName().substring(0, 10)
        const rank = await service.createRank(rankName, <RGB>{r: 0, g: 0, b: 0}, null)
        expect(rank.name).toBe(rankName)
    });

    it('should create invite', async () => {
        const invite = await service.createInvite("unlimited")
        expect(invite.onetime).toBeFalsy()
    });

    it('should move rank', async () => {
        await service.createRank(faker.internet.displayName(), <RGB>{r: 0, g: 0, b: 0}, null)
        await service.moveRank(0, 1)
        const networks = await service.get()
        expect(networks[0].ranks[1].name).toBe("Rank name")
    });

    it('should kick member', async () => {
        await service.kickMember(NETWORK_SERVICE_TESTING_SECONDARY_MEMBER_ID)
    });

    it('should ban member', async () => {
        await service.banMember(NETWORK_SERVICE_TESTING_SECONDARY_MEMBER_ID)
    });

    it('should modify rank permissions', async () => {
        await service.modifyRankPermissions([
            {
                granted: true,
                permissionNumber: NetworkPermissions.banMembers
            }
        ], NETWORK_SERVICE_TESTING_RANK_ID)
        const networks = await service.get()
        expect(networks[0].ranks[0].permissions).toBe(NetworkPermissions.banMembers)
    });

    it('should overwrite category permissions', async () => {
        await service.overwritePermission(NetworkPermissions.banMembers, "grant", NETWORK_SERVICE_TESTING_RANK_ID, NETWORK_SERVICE_TESTING_CATEGORY_ID)
        const overwrites = await service.getOverwrites(NETWORK_SERVICE_TESTING_RANK_ID, NETWORK_SERVICE_TESTING_CATEGORY_ID)
        expect(overwrites.length).not.toBe(0)
    });

    it('should overwrite channel permissions', async () => {
        await service.overwriteChannelPermission(
            NetworkPermissions.banMembers,
            "grant",
            NETWORK_SERVICE_TESTING_RANK_ID,
            NETWORK_SERVICE_TESTING_CATEGORY_ID,
            NETWORK_SERVICE_TESTING_CHANNEL_ID
        )
        const overwrites = await service.getChannelOverwrites(NETWORK_SERVICE_TESTING_RANK_ID, NETWORK_SERVICE_TESTING_CATEGORY_ID, NETWORK_SERVICE_TESTING_CHANNEL_ID)
        expect(overwrites.length).not.toBe(0)
    });

    it('should edit the category', async () => {
        await service.editCategory(NETWORK_SERVICE_TESTING_CATEGORY_ID, "Edited name", "Edited desc")
        const network = await service.get()
        expect(network[0].categories[0].name).toBe("Edited name")
        expect(network[0].categories[0].desc).toBe("Edited desc")
    });

    it('should edit the rank', async () => {
        await service.editRank(NETWORK_SERVICE_TESTING_RANK_ID, "Edited rank name", <RGB>{r: 0, g: 0, b: 0}, null)
        const networks = await service.get()
        expect(networks[0].ranks[0].name).toBe("Edited rank name")
    });

    it('should edit the channel', async () => {
        await service.editChannel(NETWORK_SERVICE_TESTING_CATEGORY_ID, NETWORK_SERVICE_TESTING_CHANNEL_ID, "Edited channel name", "Edited channel desc")
        const networks = await service.get()
        expect(networks[0].categories[0].channels[0].name).toBe("Edited channel name")
        expect(networks[0].categories[0].channels[0].desc).toBe("Edited channel desc")
    });

    it('should should assign and remove rank to/from a member', async () => {
        await service.assignRankToMember(NETWORK_SERVICE_TESTING_USER_ID, NETWORK_SERVICE_TESTING_RANK_ID)
        let networks = await service.get()
        expect(networks[0].ranks[0].members.length).toBe(1)
        await service.removeRankFromMember(NETWORK_SERVICE_TESTING_USER_ID, NETWORK_SERVICE_TESTING_RANK_ID)
        networks = await service.get()
        expect(networks[0].ranks[0].members.length).toBe(0)
    });

    it('should change the visibility', async () => {
        await service.changeVisibility("private")
        const networks = await service.get()
        expect(networks[0].visibility).toBe("private")
    });

    it('should edit the network\'s name', async () => {
        const newNetName = faker.internet.displayName()
        await service.editName(newNetName)
        const networks = await service.get()
        expect(networks[0].name).toBe(newNetName)
    });

    it('should create a new channel', async () => {
        const chanName = faker.internet.displayName()
        const chanDesc = faker.lorem.sentence()
        const channel = await service.createChannel(NETWORK_SERVICE_TESTING_CATEGORY_ID, "voice", chanDesc, chanName)
        expect(channel.name).toBe(chanName)
        expect(channel.desc).toBe(chanDesc)
        expect(channel.type).toBe("voice")
    });

    it('should get network from invite', async () => {
        const network = await service.getFromInvite(`${NETWORK_SERVICE_TESTING_INVITE_ID}.${NETWORK_SERVICE_TESTING_NETWORK_ID}`)
        expect(network.name).toBe("Test Network")
    });

    it('should get discovery', async () => {
        const network = await service.getDiscovery()
        expect(network[0].name).toBe("Test Network")
    });
})