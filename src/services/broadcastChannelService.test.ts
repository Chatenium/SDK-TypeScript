import {describe, expect, it} from "vitest";
import {BroadcastChannelService} from "./broadcastChannelService";

describe("BroadcastChannelService", () => {
    const service = new BroadcastChannelService("", "", "", "", "", () => {})

    it("should get stream registry data", async () => {
        const data = await service.getData()
        expect(data.status).toBe("broadcasting_starting")
    })
})