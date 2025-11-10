import { type CompositionDTO } from "../../domain/dto/CompositionDTO.ts";
import { useApiQuery } from "../api/useApiQuery.ts";
import { useCompositionStore } from "../../domain/store/CompositionStore";
import { useEffect } from "react";
import {useAuthStore} from "../../domain/store/AuthStore.ts";

export const useCompositions = () => {
    const {
        compositions,
        setCompositions,
        setLoading,
        setError
    } = useCompositionStore();

    const { token } = useAuthStore();

    const {
        data,
        isLoading: apiLoading,
        error: apiError
    } = useApiQuery<CompositionDTO[]>(
        ['compositions'], 
        {
            url: import.meta.env.VITE_API_GET_COMPOSITIONS_URL,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        },
        {
            staleTime: 5 * 60 * 1000, 
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            enabled: compositions.length === 0
        }
    );

    useEffect(() => {
        if (data && data.length > 0) {
            setCompositions(data);
        }
    }, [data, setCompositions]);

    useEffect(() => {
        setLoading(apiLoading);
        setError(apiError ? String(apiError) : null);
    }, [apiLoading, apiError, setLoading, setError]);

    return {
        compositions: compositions.length > 0 ? compositions : data || [],
        isLoading: compositions.length > 0 ? false : apiLoading,
        error: apiError ? String(apiError) : null
    };
};

export const getCompositionsFromStore = () => {
    return useCompositionStore.getState().compositions;
};