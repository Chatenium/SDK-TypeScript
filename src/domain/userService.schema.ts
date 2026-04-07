import {TimeStamp} from "./common.schema";

export interface ChangeUsernameReq {
    newUsername: string;
    userid: string;
}

export interface ChangeDisplayNameReq {
    newDisplayName: string;
    userid: string;
}

export interface ChangePasswordReq {
    newPassword: string;
    currentPassword: string;
    userid: string;
}

export interface ChangeEmailReq {
    currentPassword: string;
    newMail: string;
    userid: string;
}

export interface VerifyMailChangeReq {
    userid: string;
    vCodeCurrent: number;
    vCodeNew: number;
    newAddress: string;
}

export interface ChangePhoneReq {
    currentPassword: string;
    newPhone: string;
    userid: string;
}

export interface VerifyPhoneChange {
    userid: string;
    vCodeCurrent: number;
    vCodeNew: number;
    newPhone: string;
}

export interface UploadNewPfpReq {
    userid: string;
    pfpId: string;
}

export interface UploadNewPfpCdnReq {
    userid: string;
    data: string | null;
    isImage: boolean;
    monogramLetter: string | null;
    monogramColors: string | null;
}

export interface DeleteReq {
    userid: string;
    password: string;
}

export interface RegisterFCMTokenReq {
    userid: string;
    token: string;
    language: string;
}

export interface GetSessionsReq {
    userid: string;
}

export interface UpdateUserDataReq {
    userid: string;
}

export interface ToggleGifSaveReq {
    userid: string;
    url: string;
}

export interface UploadNewPfpCdnResp {
    pfpId: string;
}

export interface Session {
    token: string;
    os: string;
    language: string;
    login_at: TimeStamp | string;
}

export interface GIF {
    gifId: string;
    url: string;
    path: string;
}

export interface CurrNewCodeTestingResp {
    codeCurr: number|null;
    codeNew: number|null;
}

export interface PersonalUserData {
    userid: string;
    username: string;
    displayName: string;
    pfp: string;
    pictureDiscovery: boolean;
    gifs: GIF[];
    passwordSet: boolean;
    emailSet: boolean;
    phoneSet: boolean;
}