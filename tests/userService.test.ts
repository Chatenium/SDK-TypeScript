import {describe, expect, it} from "vitest";
import {UserService} from '../src/services/userService.js';
import {DatabaseMock} from '../src/mocks/storage/database.js';
import {RGB} from '../src/domain/common.schema.js'

const USER_SERVICE_TESTING_USER_ID = "000000000000000000000000"
const USER_SERVICE_TESTING_TOKEN = "testingToken"


describe("UserService Integration Testing", () => {
    const service = new UserService(USER_SERVICE_TESTING_USER_ID, USER_SERVICE_TESTING_TOKEN, new DatabaseMock())
    
    it('should not throw on username change', async () => {
        await service.changeUsername("bob2")
    });

    it('should not throw on displayName change', async () => {
        await service.changeDisplayName("New Display Name")
    });

    it('should set new password', async () => {
        await service.changePassword("newPasswd", "") // The filler user doesn't have a password set yet
    });

    it('should set new e-mail', async () => {
        const code = await service.changeEmail("bob2@example.com", "")
        expect(code).not.toBeNull()
        if (code != null) {
            await service.verifyEmailChange(code.codeCurr??0, code.codeNew??0, "bob2@example.com")
        }
    });

    it('should upload a new pfp', async () => {
        const pfpId = await service.uploadNewPfpCdn(null, "A", <RGB>{r: 255, g: 255, b: 255})
        await service.uploadNewPfp(pfpId)
    });

    it('should get sessions', async () => {
        const sessions = await service.getSessions()
        expect(sessions[0].token).toBe(USER_SERVICE_TESTING_TOKEN)
    });

    it('should set new phone', async () => {
        const code = await service.changePhoneNumber("", "+36201234567")
        expect(code).not.toBeNull()
        if (code != null) {
            await service.verifyPhoneNumberChange("+36201234567", code.codeCurr??0, code.codeNew??0)
        }
    });
})