export interface GetAuthMethodsReq {
    unameMailPhone: string;
}

export interface AuthMethods {
    password: boolean;
    email: boolean;
    sms: boolean;
}