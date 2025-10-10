
import { apiRequest } from "../api/apiClient";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    userId: number;
    email: string;
    name: string;
    surname: string;
    username: string;
}

export const useLogin = async (email: string, password: string): Promise<LoginResponse> => {

    const loginData: LoginRequest = {
        email: email,
        password: password
    };

    const response = await apiRequest<LoginResponse>({
        // agregar el login en string
        url: import.meta.env.VITE_API_AUTH_URL + '/login',
        method: 'POST',
        data: loginData
    });

    return response;
};