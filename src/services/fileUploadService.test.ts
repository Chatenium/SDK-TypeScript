import {describe, expect, it} from "vitest";
import {FileUploadService} from "./fileUploadService";

describe("fileUploadService", () => {
    it('should upload files', async () => {
        const service = new FileUploadService("", null, null);
        const uploadId = await service.uploadFiles("", "", [])
        expect(uploadId).toBe("MockUploadId")
    });
})