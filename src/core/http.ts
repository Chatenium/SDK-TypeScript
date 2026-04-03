import axios, {AxiosInstance} from 'axios';
import {environment} from "./environment";

export const getClient = (cdn: boolean) => {
    const env = environment.get();

    return axios.create({
        baseURL: cdn ? env.cdnUrl : env.apiUrl,
        timeout: 5000,
        headers: {'Content-Type': 'application/json'}
    });
};