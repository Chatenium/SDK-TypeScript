import {beforeAll, beforeEach} from 'vitest';
import {environment, SDKConfig} from "../src/core/environment";
import {getClient} from "../src/core/http";

beforeEach(async () => {
    environment.overwrite(<SDKConfig>{
        apiUrl: "http://localhost:3000"
    })

    await getClient().post("v2/reset")
})
