import {setupServer} from "msw/node";
import {allHandlers} from "./index";

export const mockServer = setupServer(...allHandlers)