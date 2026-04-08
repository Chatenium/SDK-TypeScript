import {describe, expect, it} from "vitest";
import {BroadcastChannelService} from '../src/services/broadcastChannelService.js';

const BRC_CHAN_SERVICE_TESTING_NETWORK_ID = "000000000000000000000000"
const BRC_CHAN_SERVICE_TESTING_USER_ID = "000000000000000000000000"
const BRC_CHAN_SERVICE_TESTING_CHANNEL_ID = "333333333333333333333333"
const BRC_CHAN_SERVICE_TESTING_TOKEN = "testingToken"
const BRC_CHAN_SERVICE_TESTING_CATEGORY_ID = "111111111111111111111111"

describe("BroadcastChannelService Integration Testing", () => {
    const service = new BroadcastChannelService(
        BRC_CHAN_SERVICE_TESTING_TOKEN,
        BRC_CHAN_SERVICE_TESTING_USER_ID,
        BRC_CHAN_SERVICE_TESTING_NETWORK_ID,
        BRC_CHAN_SERVICE_TESTING_CATEGORY_ID,
        BRC_CHAN_SERVICE_TESTING_CHANNEL_ID,
        (action, data) => {}
    )

    it('should create a new server and fetch it', async () => {
        await service.createServer()
        const registry = await service.getData()
        expect(registry.status).toBe("idling")
    });

    it('should join ws room', async () => {
        await service.joinWebSocketRoom()
    });
})