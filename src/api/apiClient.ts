import axios, {type AxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const  apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const apiRequest = async <T>(
    config: AxiosRequestConfig & {
        customHeaders?: Record<string, string>
    }
): Promise<T> => {
    try {
        const { customHeaders, ...axiosConfig } = config;

        const response = await apiClient.request<T>({
            ...axiosConfig,
            headers: {
                ...apiClient.defaults.headers.common,
                ...customHeaders,
            }
        });

        return response.data;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
};