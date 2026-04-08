import {describe, expect, it} from "vitest";
import {UserService} from './userService.js';
import {DatabaseMock} from '../mocks/storage/database.js';

describe("UserService", () => {
    const service = new UserService("", "", new DatabaseMock())

    it('should get all sessions', async () => {
        const sessions = await service.getSessions()
        expect(sessions[0].token).toBe("sessionToken")
    });
})