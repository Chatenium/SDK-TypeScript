import {describe, expect, it} from "vitest";
import {NetworkService} from "./networkService";
import {DatabaseMock} from "../mocks/storage/database";
import {faker} from "@faker-js/faker/locale/en";
import {getClient} from "../core/http";
import {environment, SDKConfig} from "../core/environment";

describe("NetworkService", () => {
    const service = new NetworkService("", "", "", new DatabaseMock(), getClient(false))

    it('should get invites', async () => {
        const invites = await service.getInvites();
        expect(invites[0].inviteId).toBe("inviteId")
    });

    it('should create a network', async () => {
        const netName = faker.internet.displayName()
        const network = await service.create(
            netName,
            "private",
            null
        );
        expect(network.name).toBe(netName)
        expect(network.visibility).toBe("private")
    });

    it('should create a category', async () => {
        const catName = faker.internet.displayName()
        const catDesc = faker.lorem.sentence()
        const category = await service.createCategory(
            catName,
            catDesc
        );
        expect(category.name).toBe(catName)
        expect(category.desc).toBe(catDesc)
    });

    it('should create an invite', async () => {
        const invite = await service.createInvite(
            "once",
        );
        expect(invite.onetime).toBeTruthy()
    });

    it('should get permission overwrites', async () => {
        const ow = await service.getOverwrites("", "");
        expect(ow[0].permissionNumber).toBe(5000)
    });

    it('should get channel permission overwrites', async () => {
        const ow = await service.getChannelOverwrites("", "", "");
        expect(ow[0].permissionNumber).toBe(5000)
    });

    it('should get banned members', async () => {
        const bannedMembers = await service.getBannedMembers();
        expect(bannedMembers[0].username).toBe("bob")
        expect(bannedMembers[0].displayName).toBe("Bob")
    });

    it('should get the detailed member list', async () => {
        const members = await service.getMembers();
        expect(members[0].name).toBe("Test rank")
        expect(members[0].members[0].displayName).toBe("Bob")
    });
})