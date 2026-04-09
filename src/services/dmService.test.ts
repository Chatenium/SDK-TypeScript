import {describe, expect, it} from "vitest";
import {DMService} from './dmService.js';
import {DatabaseMock} from '../mocks/storage/database.js';
import {faker} from "@faker-js/faker/locale/en";

describe("DmService", () => {
    const service = new DMService("", "", "", new DatabaseMock(), () => {})

    it("should get messages", async () => {
        const messages = await service.get()
        expect(messages[0].message).toBe("This is a message")
    })

    it('should get message position', async () => {
        const pos = await service.getMessagePos("")
        expect(pos).toBe(5000)
    });

    it('should get pinned messages', async () => {
        const pinnedMessages = await service.getPinnedMessages()
        expect(pinnedMessages[0].message).toBe("This is a pinned message")
    });

    it('should send a new message', async () => {
        const message = faker.internet.displayName()
        const newMessage = await service.sendMessage("", message)
        expect(newMessage.message).toBe(message)
    });
})