import {networkHandlers} from "./handlers/auth.http";
import {authHandlers} from "./handlers/network.http";
import {pictureHandlers} from "./handlers/picture.http";

export const allHandlers = [
    ...authHandlers,
    ...networkHandlers,
    ...pictureHandlers
]