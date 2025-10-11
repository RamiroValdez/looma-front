import { type ArtisticStyleDTO } from "../dto/ArtisticStyleDTO";
import { useApiQuery } from "../api/useApiQuery.ts";
import { useArtisticStyleStore } from "../store/ArtisticStyleStore";
import { useEffect } from "react";
import {useAuthStore} from "../store/AuthStore.ts";

export const useArtisticStyles = () => {
    const {
        artisticStyles,
        setArtisticStyles,
        setLoading,
        setError
    } = useArtisticStyleStore();

    const { token } = useAuthStore();

    const {
        data,
        isLoading: apiLoading,
        error: apiError
    } = useApiQuery<ArtisticStyleDTO[]>(
        ['artisticStyles'], // Clave de caché para React Query
        {
            url: import.meta.env.VITE_API_GET_ARTISTIC_STYLES_URL,
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
            enabled: artisticStyles.length === 0 
        }
    );
    // Sincronizar datos de la API con el store
    useEffect(() => {
        if (data && data.length > 0) {
            setArtisticStyles(data);
        }
    }, [data, setArtisticStyles]);

    // Sincronizar estados de loading y error
    useEffect(() => {
        setLoading(apiLoading);
        setError(apiError ? String(apiError) : null);
    }, [apiLoading, apiError, setLoading, setError]);

    return {
        artisticStyles: artisticStyles.length > 0 ? artisticStyles : data || [],
        isLoading: artisticStyles.length > 0 ? false : apiLoading,
        error: apiError ? String(apiError) : null
    };
};

// Función helper para obtener estilos desde el store (solo lectura)
export const getArtisticStylesFromStore = () => {
    return useArtisticStyleStore.getState().artisticStyles;
};