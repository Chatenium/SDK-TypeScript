// Request schemas
export interface OtpPleSendCodeReq {
    unameMailPhone: string;
    type: number;
}

export interface OtpPleVerifyCodeReq {
    unameMailPhone: string;
    type: number;
    code: number;
    os: string | null;
    language: string | null;
}

export interface LoginPasswordAuthReq {
    unameMailPhone: string;
    password: string;
    os: string | null;
    language: string | null;
}

export interface PleSendVCodeReq {
    phoneMail: string;
    type: number;
}

export interface PleVerifyCodeReq {
    phoneMail: string;
    code: number;
    type: number;
}

export interface FinishPleAccountReq {
    phoneMail: string;
    authCode: string;
    username: string;
    displayName: string;
    os: string | null;
    language: string | null;
}

export interface LoginWithGoogleReq {
    code: string;
    os: string | null;
    language: string | null;
}

export interface LoginWithApple {
    code: string;
    isApple: boolean;
    os: string | null;
    language: string | null;
}

export interface RegisterReq {
    username: string;
    displayName: string;
    password: string;
    os: string | null;
    language: string | null;
}

export interface ResetPasswordReq {
    unameMailPhone: string;
}

export interface VerifyPasswordResetReq {
    unameMailPhone: string;
    vCode: number;
    newPassword: string;
}

// Response schemas
export interface SignInSuccessResp {
    token: string;
    username: string;
    displayName: string;
    pfp: string;
    userid: string;
}

// Types
export interface AuthMethods {
    password: boolean;
    email: boolean;
    sms: boolean;
}

export interface UserDataValidationResp {
    used: boolean;
}

export interface PleVerifyCodeResp {
    authCode: string;
}

export interface ResetPasswordResp {
    userid: string;
}

export const VerificationTypeSMS = 0
export const VerificationTypeEmail = 1
