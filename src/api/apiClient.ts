import axios, {type AxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const  apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const  apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
    try {
        const response = await apiClient.request<T>(config);
        return response.data;
    } catch (error) {
        // Handle error appropriately
        console.error('API request error:', error);
        throw error;
    }
}