import {setupServer} from "msw/node";
import {allHandlers} from './index.js';

export const mockServer = setupServer(...allHandlers)