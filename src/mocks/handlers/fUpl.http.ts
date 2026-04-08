import {http, HttpResponse} from "msw";
import {GetRTCAccessResp} from '../../domain/callService.schema.js';
import {RegisterUploadResp} from '../../domain/fileUploadService.schema.js';

export const fileUploadHandlers = [
    http.post('*/chat/cdnRegisterUpload', () => {
        return HttpResponse.json(<RegisterUploadResp>{
            uploadId: "MockUploadId"
        })
    }),

    http.post('*/chat/uploadChunk', () => {
        return HttpResponse.json()
    }),

    http.post('*/chat/finishUpload', () => {
        return HttpResponse.json()
    }),
]