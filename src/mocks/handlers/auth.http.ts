import { http, HttpResponse } from 'msw'
import {AuthMethods} from "../../domain/authService.schema";

export const authHandlers = [
    http.get('*/user/authOptions', () => {
        return HttpResponse.json(<AuthMethods>{
            email: true,
            password: true,
            sms: false,
        })
    }),
]