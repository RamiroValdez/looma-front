
import { apiRequest } from "../api/apiClient";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export const useLogin = async (email: string, password: string): Promise<string> => {

    const loginData: LoginRequest = {
        email: email,
        password: password
    };

    const response = await apiRequest<LoginResponse>({
        url: import.meta.env.VITE_API_AUTH_URL,
        method: 'POST',
        data: loginData
    });

    return response.token;
};