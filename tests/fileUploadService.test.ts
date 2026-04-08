import {describe, it} from "vitest";
import {FileUploadService} from '../src/services/fileUploadService.js';
import {environment, SDKConfig} from '../src/core/environment.js';
import {getClient} from '../src/core/http.js';
import {FileData} from '../src/domain/fileUploadService.schema.js';
import axios from "axios";
import {v4 as uuidv4} from 'uuid';

describe("FileUploadService Integration Testing", () => {
    const FILE_UPL_SERVICE_TESTING_USER_ID = "000000000000000000000000"
    const FILE_UPL_SERVICE_TESTING_CHAT_ID = "000000000000000000000000"
    const FILE_UPL_SERVICE_TESTING_TOKEN = "testingToken"

    it('should upload all files', async () => {
        const response = await axios.get("https://picsum.photos/500", {
            responseType: 'blob'
        });

        const service = new FileUploadService(FILE_UPL_SERVICE_TESTING_TOKEN);
        await service.uploadFiles(
            FILE_UPL_SERVICE_TESTING_CHAT_ID,
            FILE_UPL_SERVICE_TESTING_USER_ID,
            [
                {
                    fileId: uuidv4(),
                    name: "filename",
                    type: "image",
                    extension: "jpeg",
                    data: new File([response.data], "filename", { type: "image/jpeg" })
                }
            ],
            {
                fileProgressUpdate: () => {},
            }
        )
    });
})