import {describe, it} from "vitest";
import {WebSocketHandler} from "../src/core/webSocketHandler";

const WEBSOCKET_HANDLER_TESTING_USER_ID = "000000000000000000000000"
const WEBSOCKET_HANDLER_TESTING_USER_TOKEN = "testingToken"

describe("WebSocketHandler", () => {
    it("should connect", async () => {
        await WebSocketHandler.getInstance().connect(
            WEBSOCKET_HANDLER_TESTING_USER_ID,
            WEBSOCKET_HANDLER_TESTING_USER_TOKEN
        )
    })
})