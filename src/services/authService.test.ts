import {describe, expect, it} from "vitest";
import {AuthService} from "./authService";

describe("AuthService", () => {
    it("should return authMethods", async () => {
        const service = new AuthService();
        const methods = await service.getAuthMethods("")
        expect(methods.sms).toBeFalsy()
        expect(methods.email).toBeTruthy()
        expect(methods.password).toBeTruthy()
    })
})