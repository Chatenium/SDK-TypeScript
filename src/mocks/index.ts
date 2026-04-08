import {networkHandlers} from './handlers/auth.http.js';
import {authHandlers} from './handlers/network.http.js';
import {pictureHandlers} from './handlers/picture.http.js';
import {callHandlers} from './handlers/call.http.js';
import {fileUploadHandlers} from './handlers/fUpl.http.js';
import {chatHandlers} from './handlers/chat.http.js';
import {dmHandlers} from './handlers/dm.http.js';
import {userHandler} from './handlers/user.http.js';
import {brcChanHandlers} from './handlers/brcChan.http.js';

export const allHandlers = [
    ...authHandlers,
    ...networkHandlers,
    ...pictureHandlers,
    ...callHandlers,
    ...fileUploadHandlers,
    ...chatHandlers,
    ...dmHandlers,
    ...userHandler,
    ...brcChanHandlers
]