import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { apiRequest } from "../../infrastructure/api/apiClient.ts";

export const useApiQuery = <TQueryFnData, TData = TQueryFnData, TError = unknown>(
    key: string[],
    config: {
        url: string;
        method: 'GET' | 'POST' | 'PUT' | 'DELETE';
        data?: unknown;
        headers?: Record<string, string>;
    },
    options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, string[]>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<TQueryFnData, TError, TData, string[]>({
        queryKey: key,
        queryFn: () => apiRequest<TQueryFnData>({
            url: config.url,
            method: config.method,
            data: config.data,
            customHeaders: config.headers,
        }),
        ...options,
    });
};