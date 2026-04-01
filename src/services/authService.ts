import {getClient} from "../core/http";
import {
    AuthMethods, FinishPleAccountReq,
    LoginPasswordAuthReq, LoginWithApple, LoginWithGoogleReq,
    OtpPleSendCodeReq,
    OtpPleVerifyCodeReq, PleVerifyCodeResp, RegisterReq, ResetPasswordReq, ResetPasswordResp,
    SignInSuccessResp, UserDataValidationResp, VerifyPasswordResetReq
} from "../domain/authService.schema";
import {isAxiosError} from "axios";
import {GenericErrorBody, GenericSuccessBody} from "../domain/http.schema";

export class AuthService {
    async getAuthMethods(unameMailPhone: string): Promise<AuthMethods> {
        try {
            const resp = await getClient().get<AuthMethods>(`user/authOptions?unameMailPhone=${unameMailPhone}`);
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async otpSendCode(unameMailPhone: string, type: number): Promise<void> {
        try {
            await getClient().post<GenericSuccessBody>("v2/user/otpSendCode", <OtpPleSendCodeReq>{
                unameMailPhone: unameMailPhone,
                type: type
            });
            return
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async otpVerifyCode(unameMailPhone: string, type: number, code: number): Promise<void> {
        try {
            await getClient().post<GenericSuccessBody>("v2/user/otpVerifyCode", <OtpPleVerifyCodeReq>{
                unameMailPhone: unameMailPhone,
                type: type,
                code: code
            });
            return
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async loginPasswordAuth(usernamePhoneMail: string, password: string): Promise<SignInSuccessResp> {
        try {
            const resp = await getClient().post<SignInSuccessResp>("v2/user/loginPasswordAuth", <LoginPasswordAuthReq>{
                unameMailPhone: usernamePhoneMail,
                password: password
            });
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async isUsernameUsed(username: string): Promise<Boolean> {
        try {
            const resp = await getClient().get<UserDataValidationResp>(`v2/user/unameUsage?username=${username}`);
            return resp.data.used
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async isEmailUsed(email: string): Promise<Boolean> {
        try {
            const resp = await getClient().get<UserDataValidationResp>(`v2/user/emailUsage?email=${email}`);
            return resp.data.used
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async pleSendVCode(phoneMail: string, type: number): Promise<void> {
        try {
            await getClient().post<UserDataValidationResp>("v2/user/pleSendVCode", <OtpPleSendCodeReq>{
                unameMailPhone: phoneMail,
                type: type,
            });
            return
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async pleVerifyCode(phoneMail: string, type: number, code: number): Promise<string> {
        try {
            const resp = await getClient().post<PleVerifyCodeResp>("v2/user/pleVerifyCode", <OtpPleVerifyCodeReq>{
                unameMailPhone: phoneMail,
                type: type,
                code: code
            });
            return resp.data.authCode
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async finishPLEAccount(phoneMail: string, type: number, authCode: string, username: string, displayName: string): Promise<SignInSuccessResp> {
        try {
            const resp = await getClient().post<SignInSuccessResp>("v2/user/finishPLEAccount", <FinishPleAccountReq>{
                phoneMail: phoneMail,
                authCode: authCode,
                displayName: displayName,
                username: username,
            });
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async loginWithGoogle(code: string): Promise<SignInSuccessResp> {
        try {
            const resp = await getClient().post<SignInSuccessResp>("user/loginWithGoogle", <LoginWithGoogleReq>{
                code: code
            });
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async loginWithApple(code: string): Promise<SignInSuccessResp> {
        try {
            const resp = await getClient().post<SignInSuccessResp>("user/loginWithGoogle", <LoginWithApple>{
                code: code,
                isApple: false,
            });
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async register(username: string, displayName: string, password: string): Promise<SignInSuccessResp> {
        try {
            const resp = await getClient().post<SignInSuccessResp>("v2/user/register", <RegisterReq>{
                username: username,
                displayName: displayName,
                password: password,
            });
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async resetPassword(unameMailPhone: string): Promise<string> {
        try {
            const resp = await getClient().post<ResetPasswordResp>("user/resetPassword", <ResetPasswordReq>{
                unameMailPhone: unameMailPhone,
            });
            return resp.data.userid
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    async verifyPasswordReset(unameMailPhone: string, code: number, newPassword: string): Promise<void> {
        try {
            await getClient().post<GenericSuccessBody>("user/resetPassword", <VerifyPasswordResetReq>{
                unameMailPhone: unameMailPhone,
                vCode: code,
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
}