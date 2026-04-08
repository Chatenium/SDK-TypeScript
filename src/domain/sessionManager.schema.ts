import {PublicUserData} from './common.schema.js';
import {GIF, PersonalUserData} from './userService.schema.js';

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