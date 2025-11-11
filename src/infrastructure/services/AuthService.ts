
import { apiRequest } from "../../infrastructure/api/apiClient";

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

export interface RegisterRequest {
    name: string;
    surname: string;
    username: string;
    email: string;
    password: string;
}

export const useLogin = async (email: string, password: string): Promise<LoginResponse> => {

    const loginData: LoginRequest = {
        email: email,
        password: password
    };

    const response = await apiRequest<LoginResponse>({
        url: import.meta.env.VITE_API_AUTH_URL + '/login',
        method: 'POST',
        data: loginData
    });

    return response;
};

export const useRegister = async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await apiRequest<LoginResponse>({
        url: import.meta.env.VITE_API_AUTH_URL + '/register',
        method: 'POST',
        data
    });

    return response;
};