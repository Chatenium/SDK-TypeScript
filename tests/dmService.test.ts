import {describe, expect, it} from "vitest";
import {DMService} from "../src/services/dmService";
import {ChatService} from "../src/services/chatService";
import {DatabaseMock} from "../src/mocks/storage/database";
import {faker} from "@faker-js/faker/locale/en";

describe("DmService Integration Testing", () => {
    const DM_SERVICE_TESTING_CHAT_ID = "000000000000000000000000"
    const DM_SERVICE_TESTING_USER_ID = "000000000000000000000000"
    const DM_SERVICE_TESTING_MESSAGE_ID = "111111111111111111111111"
    const DM_SERVICE_TESTING_TOKEN = "testingToken"

    const service = new DMService(
        DM_SERVICE_TESTING_USER_ID,
        DM_SERVICE_TESTING_TOKEN,
        DM_SERVICE_TESTING_CHAT_ID,
        new DatabaseMock(),
        () => {}
    )

    it('should get messages', async () => {
        const messages = await service.get()
        expect(messages[0].message).toBe("This is a message")
        expect(messages[0].isEdited).toBeTruthy()
    });

    it('should get message position', async () => {
        const pos = await service.getMessagePos(DM_SERVICE_TESTING_MESSAGE_ID)
        expect(pos).toBe(0)
    });

    it('should edit message', async () => {
        const newMessage = faker.lorem.paragraph()
        await service.editMessage(DM_SERVICE_TESTING_MESSAGE_ID, newMessage)
        const messages = await service.get()
        expect(messages[0].message).toBe(newMessage)
    });

    it('should send a message', async () => {
        const message = faker.lorem.paragraph()
        const newMessage = await service.sendMessage(message)
        expect(newMessage.message).toBe(message)
    });

    it('should read messages', async () => {
        await service.readMessages()
    });

    it('should pin and unpin messages', async () => {
        let pinnedMessages = await service.getPinnedMessages()
        expect(pinnedMessages.length).toBe(0)

        await service.pinMessage(DM_SERVICE_TESTING_MESSAGE_ID, "message")
        pinnedMessages = await service.getPinnedMessages()
        expect(pinnedMessages.length).toBe(1)

        await service.unpinMessage(DM_SERVICE_TESTING_MESSAGE_ID)
        pinnedMessages = await service.getPinnedMessages()
        expect(pinnedMessages.length).toBe(0)
    });
})