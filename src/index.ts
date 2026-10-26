import {AuthApi, Configuration} from "./generated";
import {DatabaseAPI} from "./storage/database";
import {KeyringAPI} from "./storage/keyring";
import {KeyValueAPI} from "./storage/keyvalue";

export class ChateniumClient {
    public auth: AuthApi;

    constructor(config: { baseUrl: string, storage: {database: DatabaseAPI, keyring: KeyringAPI, keyValue: KeyValueAPI} }) {
        const apiConfig = new Configuration({
            basePath: config.baseUrl+"/v3"
        })

        this.auth = new AuthApi(apiConfig);
    }
}