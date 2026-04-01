import {describe, expect, it} from "vitest";
import {AuthService} from "./authService";
import {VerificationTypeEmail} from "../domain/authService.schema";
import {faker} from "@faker-js/faker/locale/en";

describe("AuthService", () => {
    it("should return authMethods", async () => {
        const service = new AuthService();
        const methods = await service.getAuthMethods("")
        expect(methods.sms).toBeFalsy()
        expect(methods.email).toBeTruthy()
        expect(methods.password).toBeTruthy()
    })

    it("should send OTP code", async () => {
        const service = new AuthService();
        const code = await service.otpSendCode("bob@example.com", VerificationTypeEmail)
        expect(code).toBe(5000)
    })

    it("should send password reset code", async () => {
        const service = new AuthService();
        const code = await service.resetPassword("bob@example.com")
        expect(code).toBe(5000)
    })

    it("should send PLE code", async () => {
        const service = new AuthService();
        const code = await service.pleSendVCode("bob@example.com", VerificationTypeEmail)
        expect(code).toBe(5000)
    })

    it("should throw on wrong OTP code", async () => {
        const service = new AuthService();
        await expect(service.otpVerifyCode("bob@example.com", VerificationTypeEmail, 9999)).rejects.toThrow()
    })

    it("should throw on wrong password reset code", async () => {
        const service = new AuthService();
        await expect(service.verifyPasswordReset("bob@example.com", 9999, "newPassword")).rejects.toThrow()
    })

    it("should throw on wrong PLE code", async () => {
        const service = new AuthService();
        await expect(service.pleVerifyCode("bob@example.com", VerificationTypeEmail, 9999)).rejects.toThrow()
    })

    it("should throw on wrong password", async () => {
        const service = new AuthService();
        await expect(service.loginPasswordAuth("bob@example.com", "wrongPasswd")).rejects.toThrow();
    })

    it("should detect taken username", async () => {
        const service = new AuthService();
        const taken = await service.isUsernameUsed("username")
        expect(taken).toBeTruthy()
    })

    it("should detect taken e-mail address", async () => {
        const service = new AuthService();
        const taken = await service.isEmailUsed("taken@example.com")
        expect(taken).toBeTruthy()
    })

    it("should register passwordless account", async () => {
        const service = new AuthService();
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