import {beforeAll, describe, expect, it} from "vitest";
import {jezus} from "./index";
import {KeyringAPI} from "./storage/keyring";
import {KeyringMock} from "./mocks/storage/keyring";

describe("Testing", () => {
    it("should be defined", () => {
        let keyringMock = new KeyringMock();
        jezus(keyringMock)

        expect(keyringMock.get("keyring")).toBe("apad");
    })
})