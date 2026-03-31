import {KeyringAPI} from "./storage/keyring";

export function jezus(keyring: KeyringAPI) {
    keyring.set("keyring", "apad");
}