import {networkHandlers} from "./handlers/auth.http";
import {authHandlers} from "./handlers/network.http";

export const allHandlers = [
    ...authHandlers,
    ...networkHandlers
]