import {describe, expect, it} from "vitest";
import {AuthService} from './authService.js';
import {VerificationTypeEmail} from '../domain/authService.schema.js';
import {faker} from "@faker-js/faker/locale/en";

describe("AuthService", () => {
    const service = new AuthService();

    it("should return authMethods", async () => {
        const methods = await service.getAuthMethods("")
        expect(methods.sms).toBeFalsy()
        expect(methods.email).toBeTruthy()
        expect(methods.password).toBeTruthy()
    })

    it("should send OTP code", async () => {
        const code = await service.otpSendCode("bob@example.com", VerificationTypeEmail)
        expect(code).toBe(5000)
    })

    it("should send password reset code", async () => {
        const code = await service.resetPassword("bob@example.com")
        expect(code).toBe(5000)
    })

    it("should send PLE code", async () => {
        const code = await service.pleSendVCode("bob@example.com", VerificationTypeEmail)
        expect(code).toBe(5000)
    })

    it("should throw on wrong OTP code", async () => {
        await expect(service.otpVerifyCode("bob@example.com", VerificationTypeEmail, 9999)).rejects.toThrow()
    })

    it("should throw on wrong password reset code", async () => {
        await expect(service.verifyPasswordReset("bob@example.com", 9999, "newPassword")).rejects.toThrow()
    })

    it("should throw on wrong PLE code", async () => {
        await expect(service.pleVerifyCode("bob@example.com", VerificationTypeEmail, 9999)).rejects.toThrow()
    })

    it("should throw on wrong password", async () => {
        await expect(service.loginPasswordAuth("bob@example.com", "wrongPasswd")).rejects.toThrow();
    })

    it("should detect taken username", async () => {
        const taken = await service.isUsernameUsed("username")
        expect(taken).toBeTruthy()
    })

    it("should detect taken e-mail address", async () => {
        const taken = await service.isEmailUsed("taken@example.com")
        expect(taken).toBeTruthy()
    })

    it("should register passwordless account", async () => {
        const username = faker.internet.username()
        const displayName = faker.internet.displayName()
        const userData = await service.finishPLEAccount(
            "bob@example.com",
            "goodAuthCode",
            username,
            displayName,
        )
        expect(userData.username).toBe(username)
        expect(userData.displayName).toBe(displayName)
        expect(userData.token).toBe("token")
    })
})