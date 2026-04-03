import {DatabaseAPI} from "../storage/database";
import {AxiosInstance, isAxiosError} from "axios";
import {getClient} from "../core/http";
import {NetworkInvite} from "../domain/networkService.schema";
import {GenericErrorBody} from "../domain/http.schema";
import {
    Album, ChangePictureVisibilityReq,
    CreateAlbumReq,
    DeleteImageReq,
    DiscoveryResp, EditPictureTitleReq,
    FinalizeUploadReq,
    GetResp, PostCommentReq, ToggleFollowReq, TogglePictureLikeReq, UploadImageReq
} from "../domain/pictureService.schema";
import {environment} from "../core/environment";

export class PictureService {
    userid: string;
    uploaderId: string;
    database: DatabaseAPI;
    client: AxiosInstance
    cdnClient: AxiosInstance

    constructor(token: string, uploaderId: string, userid: string, database: DatabaseAPI, httpClientOverwrite: AxiosInstance | null, cdnClientOverwrite: AxiosInstance | null) {
        this.userid = userid;
        this.uploaderId = uploaderId;
        this.database = database;
        this.client = (httpClientOverwrite ?? getClient(false)).create({
            headers: {
                "Authorization": token
            }
        })
        this.cdnClient = (cdnClientOverwrite ?? getClient(true)).create({
            headers: {
                "Authorization": token
            }
        })
    }

    async get(): Promise<GetResp> {
        try {
            const resp = await this.client.get<GetResp>(`picture/pictures?userid=${this.userid}&target=${this.uploaderId}`);
            return resp.data
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async discovery(): Promise<DiscoveryResp> {
        try {
            const resp = await this.client.get<DiscoveryResp>("picture/discovery");
            return resp.data
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async createAlbum(name: string): Promise<Album> {
        try {
            const resp = await this.client.post<Album>("picture/createAlbum", <CreateAlbumReq>{
                userid: this.userid,
                name: name
            });
            return resp.data
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async finalizeUpload(uploadId: string): Promise<void> {
        try {
            await this.client.post("picture/finalizeUpload", <FinalizeUploadReq>{
                userid: this.userid,
                uploadId: uploadId,
            });
            return
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async deletePicture(imageId: string): Promise<void> {
        try {
            await this.client.post("picture/delete", <DeleteImageReq>{
                userid: this.userid,
                imageId: imageId
            });
            return
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async changeVisibility(imageId: string, newVisibility: string): Promise<void> {
        try {
            await this.client.post("picture/changeVisibility", <ChangePictureVisibilityReq>{
                userid: this.userid,
                visibility: newVisibility
            });
            return
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async editTitle(imageId: string, newTitle: string): Promise<void> {
        try {
            await this.client.post("picture/editTitle", <EditPictureTitleReq>{
                userid: this.userid,
                title: newTitle
            });
            return
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async toggleLike(imageId: string): Promise<void> {
        try {
            await this.client.post("picture/toggleLike", <TogglePictureLikeReq>{
                userid: this.userid,
                imageId: imageId
            });
            return
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async postComment(imageId: string, comment: string): Promise<void> {
        try {
            await this.client.post("picture/comment", <PostCommentReq>{
                userid: this.userid,
                imageId: imageId,
                comment: comment
            });
            return
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async toggleFollow(): Promise<void> {
        try {
            await this.client.post("picture/toggleFollow", <ToggleFollowReq>{
                userid: this.userid,
                uploaderId: this.uploaderId,
            });
            return
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async getAlbums(): Promise<Album[]> {
        try {
            const resp = await this.client.get(`picture/getAlbums?userid=${this.userid}`);
            return resp.data
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async getComments(imageId: string): Promise<Album[]> {
        try {
            const resp = await this.client.get(`picture/comment?userid=${this.userid}&imageId=${imageId}`);
            return resp.data
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async uploadPicture(picture: string, title: string, visibility: string, album: string, uploadId: string, name: string): Promise<void> {
        try {
            await this.cdnClient.post("picture/upload", <UploadImageReq>{
                album: album,
                uploadId: uploadId,
                title: title,
                picture: picture,
                name: name,
                visibility: visibility,
                userid: this.userid,
            });
            return
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }
}