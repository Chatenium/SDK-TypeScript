import {describe, expect, it} from "vitest";
import {DatabaseMock} from '../src/mocks/storage/database.js';
import {ChatService} from '../src/services/chatService.js';

describe("ChatService Integration Testing", () => {
    const CHAT_SERVICE_TESTING_USER_ID = "000000000000000000000000"
    const CHAT_SERVICE_TESTING_TOKEN = "testingToken"
    const service = new ChatService(CHAT_SERVICE_TESTING_USER_ID, CHAT_SERVICE_TESTING_TOKEN, new DatabaseMock(), () => {})

    it('should get chats', async () => {
        const chats = await service.get()
        expect(chats[0].username).toBe("bob")
    })
})