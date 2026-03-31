import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import {mockServer} from "./src/mocks/node";

beforeAll(() => mockServer.listen({ onUnhandledRequest: 'error' }));
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());