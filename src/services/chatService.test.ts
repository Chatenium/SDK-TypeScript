import {describe, expect, it} from "vitest";
import {ChatService} from './chatService.js';
import {DatabaseMock} from '../mocks/storage/database.js';
import {faker} from "@faker-js/faker/locale/en";

describe("ChatService", () => {
    const service = new ChatService("", "", new DatabaseMock(), (action, data) => {})

    it('should get chats', async () => {
        const chats = await service.get()
        expect(chats[0].userid).toBe("chatPartnerId")
    })

    it('should get availability', async () => {
        const available = await service.getUserAvailability("")
        expect(available).toBeTruthy()
    });

    it('should create a new chat', async () => {
        const chatPartnerName = faker.internet.displayName()
        const newChat = await service.startNew(chatPartnerName)
        expect(newChat.username).toBe(chatPartnerName)
    });
})