import {beforeAll, beforeEach} from 'vitest';
import {environment, SDKConfig} from "../src/core/environment";
import {getClient} from "../src/core/http";

beforeEach(async () => {
    await getClient(false).post("v2/reset")
})
