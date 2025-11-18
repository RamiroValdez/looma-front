
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
    confirmPassword: string;
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

export const useRegister = async (data: RegisterRequest): Promise<{ status: number; data: any }> => {
    const response = await fetch(
        import.meta.env.VITE_API_BASE_URL + '/auth/register',
        {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }
    );
    const responseData = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error: any = new Error(responseData.message || "Error al registrarse");
        error.status = response.status;
        error.data = responseData;
        throw error;
    }
    return { status: response.status, data: responseData };
};