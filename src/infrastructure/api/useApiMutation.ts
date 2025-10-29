import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { apiClient } from "../../infrastructure/api/apiClient";

interface ApiMutationConfig {
    url: string;
    method: 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
}

export const useApiMutation = <TData, TError = unknown, TVariables = unknown>(
    config: ApiMutationConfig,
    options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
) => {
    return useMutation<TData, TError, TVariables>({
        mutationFn: async (data: TVariables) => {
            const response = await apiClient.request<TData>({
                url: config.url,
                method: config.method,
                data: data,
                headers: config.headers
            });
            return response.data;
        },
        ...options,
    });
};