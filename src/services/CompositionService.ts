import { type CompositionDTO } from "../dto/CompositionDTO";
import { useApiQuery } from "../api/useApiQuery.ts";
import { useCompositionStore } from "../store/CompositionStore";
import { useEffect } from "react";
import {useAuthStore} from "../store/AuthStore.ts";

// Custom hook que maneja la lógica de store + API para Composiciones
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
        ['compositions'], // Clave de caché para React Query
        {
            url: import.meta.env.VITE_API_GET_COMPOSITIONS_URL,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        },
        {
            staleTime: 5 * 60 * 1000, // Cache de 5 minutos
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            // Solo hace la llamada si no hay composiciones en el store
            enabled: compositions.length === 0
        }
    );

    // Sincronizar datos de la API con el store
    useEffect(() => {
        if (data && data.length > 0) {
            setCompositions(data);
        }
    }, [data, setCompositions]);

    // Sincronizar estados de loading y error
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

// Función helper para obtener composiciones desde el store (solo lectura)
export const getCompositionsFromStore = () => {
    return useCompositionStore.getState().compositions;
};