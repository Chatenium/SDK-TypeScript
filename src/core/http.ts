import axios, { AxiosInstance } from 'axios';
import {environment} from "./environment";

let client: AxiosInstance;

export const getClient = () => {
    if (!client) {
        const env = environment.get();

        client = axios.create({
            baseURL: env.apiUrl,
            timeout: 1000,
            headers: { 'Content-Type': 'application/json' }
        });

        /*client.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });*/
    }
    return client;
};