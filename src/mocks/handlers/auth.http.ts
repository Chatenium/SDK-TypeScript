import { http, HttpResponse } from 'msw'
import {
    AuthMethods, FinishPleAccountReq, LoginPasswordAuthReq,
    OtpPleCodeSendTestingResp,
    OtpSendCodeReq,
    OtpVerifyCodeReq, PleVerifyCodeReq, PleVerifyCodeResp, RegisterReq, SignInSuccessResp,
    UserDataValidationResp, VerifyPasswordResetReq
} from '../../domain/authService.schema.js';
import {GenericSuccessBody} from '../../domain/http.schema.js';

export const networkHandlers = [
    http.get('*/user/authOptions', () => {
        return HttpResponse.json(<AuthMethods>{
            email: true,
            password: true,
            sms: false,
        })
    }),

    http.post('*/v2/user/otpSendCode', () => {
        return HttpResponse.json(<OtpPleCodeSendTestingResp>{
            code: 5000
        })
    }),

    http.post('*/v2/user/otpVerifyCode', async ({request}) => {
        const body = await request.json() as OtpVerifyCodeReq;
        return HttpResponse.json(<SignInSuccessResp>{
            username: "bob",
            displayName: "Bob",
            token: "token"
        }, {status: body.code == 5000 ? 200 : 401})
    }),

    http.post('*/v2/user/loginPasswordAuth', async ({request}) => {
        const body = await request.json() as LoginPasswordAuthReq;
        return HttpResponse.json(<GenericSuccessBody>{
            response: "success"
        }, {status: body.password == "password" ? 200 : 401})
    }),

    http.get('*/v2/user/unameUsage', async ({request}) => {
        const url = new URL(request.url);
        return HttpResponse.json(<UserDataValidationResp>{
            used: url.searchParams.get('username') == "username"
        })
    }),

    http.get('*/v2/user/emailUsage', async ({request}) => {
        const url = new URL(request.url);
        return HttpResponse.json(<UserDataValidationResp>{
            used: url.searchParams.get('email') == "taken@example.com"
        })
    }),

    http.post('*/v2/user/pleSendVCode', () => {
        return HttpResponse.json(<OtpPleCodeSendTestingResp>{
            code: 5000
        })
    }),

    http.post('*/v2/user/pleVerifyCode', async ({request}) => {
        const body = await request.json() as PleVerifyCodeReq;
        return HttpResponse.json(<GenericSuccessBody>{
            response: "success"
        }, {status: body.code == 5000 ? 200 : 401})
    }),

    http.post('*/v2/user/finishPLEAccount', async ({request}) => {
        const body = await request.json() as FinishPleAccountReq;
        return HttpResponse.json(<SignInSuccessResp>{
            username: body.username,
            displayName: body.displayName,
            token: "token"
        }, {status: body.authCode == "goodAuthCode" ? 200 : 401})
    }),

    http.post('*/v2/user/register', async ({request}) => {
        const body = await request.json() as RegisterReq;
        return HttpResponse.json(<SignInSuccessResp>{
            username: body.username,
            displayName: body.displayName,
            token: "token"
        }, {status: 200})
    }),

    http.post('*/user/resetPassword', () => {
        return HttpResponse.json(<OtpPleCodeSendTestingResp>{
            code: 5000
        })
    }),

    http.post('*/user/verifyResetCode', async ({request}) => {
        const body = await request.json() as VerifyPasswordResetReq;
        return HttpResponse.json(<GenericSuccessBody>{
            response: "success"
        }, {status: body.vCode == 5000 ? 200 : 401})
    })
]