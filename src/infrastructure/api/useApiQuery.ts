import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { apiRequest } from "../../infrastructure/api/apiClient.ts";

export const useApiQuery = <TData, TError = unknown>(
    key: string[],
    config: {
        url: string;
        method: 'GET' | 'POST' | 'PUT' | 'DELETE';
        data?: any;
        headers?: Record<string, string>;
    },
    options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<TData, TError>({
        queryKey: key,
        queryFn: () => apiRequest<TData>({
            url: config.url,
            method: config.method,
            data: config.data,
            customHeaders: config.headers,
        }),
        ...options,
    });
};