import {getClient} from "../core/http";
import {AuthMethods} from "../domain/authService.schema";
import {isAxiosError} from "axios";
import {GenericErrorBody} from "../domain/common.schema";

export class AuthService {
    async getAuthMethods(unameMailPhone: String): Promise<AuthMethods> {
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
}