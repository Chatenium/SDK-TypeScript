import {getClient} from '../core/http.js';
import {
    AuthMethods, FinishPleAccountReq,
    LoginPasswordAuthReq, LoginWithApple, LoginWithGoogleReq, OtpPleCodeSendTestingResp,
    OtpSendCodeReq,
    OtpVerifyCodeReq, PleSendCodeReq,
    PleVerifyCodeReq, PleVerifyCodeResp, RegisterReq, ResetPasswordReq, ResetPasswordResp,
    SignInSuccessResp, UserDataValidationResp, VerifyPasswordResetReq
} from '../domain/authService.schema.js';
import {isAxiosError} from "axios";
import {GenericErrorBody, GenericSuccessBody} from '../domain/http.schema.js';

export class AuthService {
    /**
     * Fetches the available authentication methods for a user
     * @param unameMailPhone Username, e-mail address or phone number in international format
     */
    async getAuthMethods(unameMailPhone: string): Promise<AuthMethods> {
        try {
            const resp = await getClient(false).get<AuthMethods>(`user/authOptions?unameMailPhone=${unameMailPhone}`);
            return resp.data
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Starts the one-time-password sign-in procedure by sending a code to the preferred destination
     * @param unameMailPhone Username, e-mail address or phone number in international format
     * @param type Whether to send the code via e-mail or SMS
     * @returns void in production. Number (the code) is only returned when unit testing with the API in testing mode
     */
    async otpSendCode(unameMailPhone: string, type: number): Promise<void|number> {
        try {
            const resp = await getClient(false).post<OtpPleCodeSendTestingResp>("v2/user/otpSendCode", <OtpSendCodeReq>{
                usernamePhoneMail: unameMailPhone,
                type: type
            });
            if (resp.data.code != null) {
                return resp.data.code
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

    /**
     * With the provided code, this registers a new session and returns user data and auth token
     * @param unameMailPhone Username, e-mail address or phone number in international format
     * @param type Whether to send the code via e-mail or SMS
     * @param code The verification code
     */
    async otpVerifyCode(unameMailPhone: string, type: number, code: number): Promise<SignInSuccessResp> {
        try {
            const resp = await getClient(false).post<SignInSuccessResp>("v2/user/otpVerifyCode", <OtpVerifyCodeReq>{
                usernamePhoneMail: unameMailPhone,
                type: type,
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

    /**
     * Signs into a Chatenium account via password
     * @param usernamePhoneMail Username, e-mail address or phone number in international format
     * @param password The password associated with the account
     */
    async loginPasswordAuth(usernamePhoneMail: string, password: string): Promise<SignInSuccessResp> {
        try {
            const resp = await getClient(false).post<SignInSuccessResp>("v2/user/loginPasswordAuth", <LoginPasswordAuthReq>{
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

    /**
     * Checks whether the provided username is already taken
     */
    async isUsernameUsed(username: string): Promise<Boolean> {
        try {
            const resp = await getClient(false).get<UserDataValidationResp>(`v2/user/unameUsage?username=${username}`);
            return resp.data.used
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Checks whether the provided e-mail address is already taken
     */
    async isEmailUsed(email: string): Promise<Boolean> {
        try {
            const resp = await getClient(false).get<UserDataValidationResp>(`v2/user/emailUsage?email=${email}`);
            return resp.data.used
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Starts the passwordless register procedure by sending a code to the preferred destination
     * @param phoneMail E-mail address or phone number in international format
     * @param type Whether to send the code via e-mail or SMS
     * @returns void in production. Number (the code) is only returned when unit testing with the API in testing mode
     */
    async pleSendVCode(phoneMail: string, type: number): Promise<void|number> {
        try {
            const resp = await getClient(false).post<OtpPleCodeSendTestingResp>("v2/user/pleSendVCode", <PleSendCodeReq>{
                phoneMail: phoneMail,
                type: type,
            });
            if (resp.data.code == null) {
                return
            } else {
                return resp.data.code
            }
        } catch (e) {
            if (isAxiosError<GenericErrorBody>(e)) {
                throw e;
            }
            throw new Error("Unexpected error")
        }
    }

    /**
     * Verifies if the provided code is valid to continue the procedure
     * @param phoneMail E-mail address or phone number in international format
     * @param type Whether to send the code via e-mail or SMS
     * @param code The code that was sent out
     */
    async pleVerifyCode(phoneMail: string, type: number, code: number): Promise<string> {
        try {
            const resp = await getClient(false).post<PleVerifyCodeResp>("v2/user/pleVerifyCode", <PleVerifyCodeReq>{
                phoneMail: phoneMail,
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

    /**
     * Finishes the procedure by permanently registering the new account in the database
     * @param phoneMail E-mail address or phone number in international format
     * @param authCode Provided in pleVerifyCode
     * @param username Must be provided by the user
     * @param displayName Let the user optionally provide it
     */
    async finishPLEAccount(phoneMail: string, authCode: string, username: string, displayName: string|null): Promise<SignInSuccessResp> {
        try {
            const resp = await getClient(false).post<SignInSuccessResp>("v2/user/finishPLEAccount", <FinishPleAccountReq>{
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

    /**
     * A social login method via Google
     * @param code Provided by the Google JavaScript API
     */
    async loginWithGoogle(code: string): Promise<SignInSuccessResp> {
        try {
            const resp = await getClient(false).post<SignInSuccessResp>("user/loginWithGoogle", <LoginWithGoogleReq>{
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

    /**
     * A social login method via Apple
     * @param code Provided by AppleJS
     */
    async loginWithApple(code: string): Promise<SignInSuccessResp> {
        try {
            const resp = await getClient(false).post<SignInSuccessResp>("user/loginWithGoogle", <LoginWithApple>{
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

    /**
     * A quick way to register a new Chatenium account
     * @param username Must be provided by the user
     * @param password Must be provided by the user
     * @param displayName Let the user optionally provide it
     */
    async register(username: string, password: string, displayName: string|null): Promise<SignInSuccessResp> {
        try {
            const resp = await getClient(false).post<SignInSuccessResp>("v2/user/register", <RegisterReq>{
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


    /**
     * Starts the password reset procedure by sending out a code via phone (or via e-mail if SMS is not available)
     * @param unameMailPhone Username, e-mail address or phone number
     * @returns void in production. Number (the code) is only returned when unit testing with the API in testing mode
     */
    async resetPassword(unameMailPhone: string): Promise<void|number> {
        try {
            const resp = await getClient(false).post<OtpPleCodeSendTestingResp>("user/resetPassword", <ResetPasswordReq>{
                unameMailPhone: unameMailPhone,
            });
            if (resp.data.code != null) {
                return resp.data.code
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

    /**
     * Finishes the password reset procedure by verifying the code and providing a new password
     * @param unameMailPhone Username, e-mail address or phone number
     * @param code The code that was sent out
     * @param newPassword Must be provided by the user
     */
    async verifyPasswordReset(unameMailPhone: string, code: number, newPassword: string): Promise<void> {
        try {
            await getClient(false).post<GenericSuccessBody>("user/verifyResetCode", <VerifyPasswordResetReq>{
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