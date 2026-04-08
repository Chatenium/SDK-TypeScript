import {describe, expect, it} from "vitest";
import {AuthService} from '../src/services/authService.js';
import {VerificationTypeEmail} from '../src/domain/authService.schema.js';

describe("AuthService", () => {
    it("should return authMethods", async () => {
        const service = new AuthService();
        const methods = await service.getAuthMethods("")
        expect(methods.sms).toBeFalsy()
        expect(methods.password).toBeFalsy()
        expect(methods.email).toBeTruthy()
    })

    it("should register a password-less account", async () => {
        const service = new AuthService();
        const code = await service.pleSendVCode("alice@example.com", VerificationTypeEmail)
        expect(code).not.toBeNull()
        const authCode = await service.pleVerifyCode("alice@example.com", VerificationTypeEmail, code ?? 0)
        expect(authCode).not.toBeNull()
        const userData = await service.finishPLEAccount("alice@example.com", authCode, "alice", "Alice")
        expect(userData.displayName).toBe("Alice")
        expect(userData.username).toBe("alice")
        expect(userData.token).not.toBeNull()
    })

    it("should login via a one-time-password", async () => {
        const service = new AuthService();
        const code = await service.otpSendCode("bob@example.com", VerificationTypeEmail)
        expect(code).not.toBeNull()
        const userData = await service.otpVerifyCode("bob@example.com", VerificationTypeEmail, code ?? 0)
        expect(userData.displayName).toBe("Bob")
        expect(userData.username).toBe("bob")
        expect(userData.token).not.toBeNull()
    })

    it("should reset the password", async () => {
        const service = new AuthService();
        const code = await service.resetPassword("bob@example.com")
        expect(code).not.toBeNull()
        await service.verifyPasswordReset("bob@example.com", code ?? 0, "newPasswd")
        const methods = await service.getAuthMethods("bob@example.com")
        expect(methods.password).toBeTruthy()
    })
})