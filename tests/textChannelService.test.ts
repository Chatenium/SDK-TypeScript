import {describe, expect, it} from "vitest";
import {DMService} from '../src/services/dmService.js';
import {ChatService} from '../src/services/chatService.js';
import {DatabaseMock} from '../src/mocks/storage/database.js';
import {faker} from "@faker-js/faker/locale/en";
import {TextChannelServiceService} from '../src/services/textChannelService.js';

describe("DmService Integration Testing", () => {
    const TXT_CHAN_SERVICE_TESTING_CHANNEL_ID = "222222222222222222222222"
    const TXT_CHAN_SERVICE_TESTING_USER_ID = "000000000000000000000000"
    const TXT_CHAN_SERVICE_TESTING_MESSAGE_ID = "111111111111111111111111"
    const TXT_CHAN_SERVICE_TESTING_TOKEN = "testingToken"
    const NETWORK_SERVICE_TESTING_NETWORK_ID = "000000000000000000000000"
    const NETWORK_SERVICE_TESTING_CATEGORY_ID = "111111111111111111111111"

    const service = new TextChannelServiceService(
        TXT_CHAN_SERVICE_TESTING_USER_ID,
        TXT_CHAN_SERVICE_TESTING_TOKEN,
        NETWORK_SERVICE_TESTING_NETWORK_ID,
        NETWORK_SERVICE_TESTING_CATEGORY_ID,
        TXT_CHAN_SERVICE_TESTING_CHANNEL_ID,
        new DatabaseMock(),
        () => {}
    )

    it('should get messages', async () => {
        const messages = await service.get()
        expect(messages[0].message).toBe("This is a message")
        expect(messages[0].isEdited).toBeTruthy()
    });

    it('should get message position', async () => {
        const pos = await service.getMessagePos(TXT_CHAN_SERVICE_TESTING_MESSAGE_ID)
        expect(pos).toBe(0)
    });

    it('should edit message', async () => {
        const newMessage = faker.lorem.paragraph()
        await service.editMessage(TXT_CHAN_SERVICE_TESTING_MESSAGE_ID, newMessage)
        const messages = await service.get()
        expect(messages[0].message).toBe(newMessage)
    });

    it('should send a message', async () => {
        const message = faker.lorem.paragraph()
        const newMessage = await service.sendMessage("", message)
        expect(newMessage.message).toBe(message)
    });

    it('should read messages', async () => {
        await service.readMessages()
    });

    it('should pin and unpin messages', async () => {
        let pinnedMessages = await service.getPinnedMessages()
        expect(pinnedMessages.length).toBe(0)

        await service.pinMessage(TXT_CHAN_SERVICE_TESTING_MESSAGE_ID, "message")
        pinnedMessages = await service.getPinnedMessages()
        expect(pinnedMessages.length).toBe(1)

        await service.unpinMessage(TXT_CHAN_SERVICE_TESTING_MESSAGE_ID)
        pinnedMessages = await service.getPinnedMessages()
        expect(pinnedMessages.length).toBe(0)
    });
})