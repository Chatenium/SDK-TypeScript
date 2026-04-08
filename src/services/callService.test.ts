import {describe, expect, it} from "vitest";
import {CallService} from './callService.js';

describe("CallService", () => {
    const handler = new CallService("", "")

    it('should get RTC access', async () => {
        const access = await handler.getRTCAccess("", "", "", null)
        expect(access.liveKitToken).toBe("liveKitToken");
    });
})