import {networkHandlers} from "./handlers/auth.http";
import {authHandlers} from "./handlers/network.http";
import {pictureHandlers} from "./handlers/picture.http";
import {callHandlers} from "./handlers/call.http";
import {fileUploadHandlers} from "./handlers/fUpl.http";

export const allHandlers = [
    ...authHandlers,
    ...networkHandlers,
    ...pictureHandlers,
    ...callHandlers,
    ...fileUploadHandlers
]