import {describe, expect, it} from "vitest";
import {FileUploadService} from './fileUploadService.js';

describe("fileUploadService", () => {
    it('should upload files', async () => {
        const service = new FileUploadService("");
        const uploadId = await service.uploadFiles("", "", [], {
            fileProgressUpdate: () => {}
        })
        expect(uploadId).toBe("MockUploadId")
    });
})