import axios, {AxiosInstance} from 'axios';
import {environment} from "./environment";

export const getClient = () => {
    const env = environment.get();

    return axios.create({
        baseURL: env.apiUrl,
        timeout: 5000,
        headers: {'Content-Type': 'application/json'}
    });
};