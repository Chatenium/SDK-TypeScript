import {beforeAll, beforeEach} from 'vitest';
import {environment, SDKConfig} from '../src/core/environment.js';
import {getClient} from '../src/core/http.js';

beforeEach(async () => {
    await getClient(false).post("v2/reset")
})
