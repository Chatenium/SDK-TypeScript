import {PublicUserData} from "./common.schema";
import {GIF, PersonalUserData} from "./userService.schema";

export interface Session {
    userData: PersonalUserData
    token: string
}

export interface ValidateSessionReq {
    token: string
}

export interface ValidateSessionResp {
    validationOk: boolean
}

export interface UpdateUserDataReq {
    userid: string
}