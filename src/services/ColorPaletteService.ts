import { type ColorPaletteDTO } from "../dto/ColorPaletteDTO";
import { useApiQuery } from "../api/useApiQuery.ts";
import { useColorPaletteStore } from "../store/ColorPaletteStore";
import { useEffect } from "react";
import {useAuthStore} from "../store/AuthStore.ts";

// Custom hook que maneja la lógica de store + API para Paletas de Colores
export const useColorPalettes = () => {
    const {
        colorPalettes,
        setColorPalettes,
        setLoading,
        setError
    } = useColorPaletteStore();

    const { token } = useAuthStore();

    const {
        data,
        isLoading: apiLoading,
        error: apiError
    } = useApiQuery<ColorPaletteDTO[]>(
        ['colorPalettes'], // Clave de caché para React Query
        {
            url: import.meta.env.VITE_API_GET_COLOR_PALETTES_URL,
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
            enabled: colorPalettes.length === 0
        }
    );

    // Sincronizar datos de la API con el store
    useEffect(() => {
        if (data && data.length > 0) {
            setColorPalettes(data);
        }
    }, [data, setColorPalettes]);

    // Sincronizar estados de loading y error
    useEffect(() => {
        setLoading(apiLoading);
        setError(apiError ? String(apiError) : null);
    }, [apiLoading, apiError, setLoading, setError]);

    return {
        colorPalettes: colorPalettes.length > 0 ? colorPalettes : data || [],
        isLoading: colorPalettes.length > 0 ? false : apiLoading,
        error: apiError ? String(apiError) : null
    };
};

// Función helper para obtener paletas desde el store (solo lectura)
export const getColorPalettesFromStore = () => {
    return useColorPaletteStore.getState().colorPalettes;
};