import {DatabaseAPI} from '../storage/database.js';
import {AxiosInstance, isAxiosError} from "axios";
import {MessageListener} from '../domain/websocket.schema.js';
import {getClient} from '../core/http.js';
import {WebSocketHandler} from '../core/webSocketHandler.js';
import {DeleteCategoryReq} from '../domain/networkService.schema.js';
import {GenericErrorBody} from '../domain/http.schema.js';
import {
    ChangeDisplayNameReq,
    ChangeEmailReq,
    ChangePasswordReq, ChangePhoneReq,
    ChangeUsernameReq, CurrNewCodeTestingResp, DeleteReq, GetSessionsReq, GIF, RegisterFCMTokenReq, Session,
    ToggleGifSaveReq, UploadNewPfpCdnReq, UploadNewPfpCdnResp,
    UploadNewPfpReq, VerifyMailChangeReq, VerifyPhoneChange
} from '../domain/userService.schema.js';
import {RGB} from '../domain/common.schema.js';
import {OtpPleCodeSendTestingResp} from '../domain/authService.schema.js';

export class UserService {
    userid: string;
    database: DatabaseAPI;
    client: AxiosInstance
    cdnClient: AxiosInstance

    constructor(userid: string, token: string, database: DatabaseAPI) {
        this.userid = userid;
        this.database = database;
        this.client = getClient(false).create({
            headers: {
                "Authorization": token,
            }
        })
        this.cdnClient = getClient(true).create({
            headers: {
                "Authorization": token,
            }
        })
    }

    async changeUsername(username: string): Promise<void> {
        try {
            await this.client.patch("user/changeUsername", <ChangeUsernameReq>{
                userid: this.userid,
                newUsername: username,
            });
            return
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async changeDisplayName(displayName: string): Promise<void> {
        try {
            await this.client.patch("user/changeDisplayName", <ChangeDisplayNameReq>{
                userid: this.userid,
                newDisplayName: displayName
            });
            return
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async changePassword(newPassword: string, currentPassword: string): Promise<void> {
        try {
            await this.client.patch("user/changePassword", <ChangePasswordReq>{
                userid: this.userid,
                currentPassword: currentPassword,
                newPassword: newPassword,
            });
            return
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async changeEmail(newMail: string, currentPassword: string): Promise<void|CurrNewCodeTestingResp> {
        try {
            const resp = await this.client.patch<CurrNewCodeTestingResp>("user/changeEmail", <ChangeEmailReq>{
                userid: this.userid,
                currentPassword: currentPassword,
                newMail: newMail,
            });
            if (resp.data.codeCurr != null) {
                return resp.data
            } else {
                return
            }
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async uploadNewPfp(pfpId: string): Promise<void> {
        try {
            await this.client.patch("user/uploadNewPfp", <UploadNewPfpReq>{
                userid: this.userid,
                pfpId: pfpId,
            });
            return
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async uploadNewPfpCdn(image: string | null, monogramLetter: string | null, monogramColors: RGB): Promise<string> {
        try {
            const resp = await this.cdnClient.post<UploadNewPfpCdnResp>("pfp", <UploadNewPfpCdnReq>{
                userid: this.userid,
                data: image,
                monogramColors: JSON.stringify(monogramColors),
                isImage: image !== null,
                monogramLetter: monogramLetter,
            });
            console.log(resp.data.pfpId, "PFPID")
            return resp.data.pfpId
        } catch (e) {
            console.log(e)
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async verifyEmailChange(vCodeCurrent: number, vCodeNew: number, newAddress: string): Promise<void> {
        try {
            await this.client.patch("user/verifyMailChange", <VerifyMailChangeReq>{
                userid: this.userid,
                newAddress: newAddress,
                vCodeCurrent: vCodeCurrent,
                vCodeNew: vCodeNew,
            });
            return
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async delete(password: string): Promise<void> {
        try {
            await this.client.post("user/deleteAccount", <DeleteReq>{
                userid: this.userid,
                password: password
            });
            return
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async registerFirebaseToken(fcmToken: string): Promise<void> {
        try {
            await this.client.post("user/registerFcmToken", <RegisterFCMTokenReq>{
                userid: this.userid,
                token: fcmToken,
            });
            return
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async getSessions(): Promise<Session[]> {
        try {
            const resp = await this.client.post<Session[]>("user/getSessions", <GetSessionsReq>{
                userid: this.userid,
            });
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async toggleGIFSave(url: string): Promise<GIF> {
        try {
            const resp = await this.client.patch<GIF>("user/toggleGIFSave", <ToggleGifSaveReq>{
                userid: this.userid,
                url: url
            });
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async changePhoneNumber(currentPassword: string, newPhone: string): Promise<CurrNewCodeTestingResp|void> {
        try {
            const resp = await this.client.patch<CurrNewCodeTestingResp>("user/changePhone", <ChangePhoneReq>{
                userid: this.userid,
                newPhone: newPhone,
                currentPassword: currentPassword,
            });
            if (resp.data.codeCurr != null) {
                return resp.data
            } else {
                return
            }
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async verifyPhoneNumberChange(newPhone: string, vCodeCurrent: number, vCodeNew: number): Promise<void> {
        try {
            const resp = await this.client.patch("user/verifyPhoneChange", <VerifyPhoneChange>{
                userid: this.userid,
                newPhone: newPhone,
                vCodeCurrent: vCodeCurrent,
                vCodeNew: vCodeNew,
            });
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }
}