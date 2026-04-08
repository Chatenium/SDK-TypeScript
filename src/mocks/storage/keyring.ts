import {KeyringAPI} from '../../storage/keyring.js';

export class KeyringMock implements KeyringAPI {
    ring: { [key: string]: string } = {};

    set(key: string, value: any) {
        this.ring[key] = value;
    }

    get(key: string): Promise<string> {
        return Promise.resolve(this.ring[key]);
    }

    getAll(): Promise<string[]> {
        return Promise.resolve(Object.keys(this.ring));
    }

    delete(key: string) {
        delete this.ring[key];
    }
}