import { type WorkFormatDTO } from "../dto/WorkDTO";
import { useApiQuery } from "../api/useApiQuery.ts";
import { useFormatStore } from "../store/FormatStore";
import { useEffect } from "react";

// Custom hook que maneja la lógica de store + API
export const useFormats = () => {
    const {
        formats,
        setFormats,
        setLoading,
        setError
    } = useFormatStore();

    const {
        data,
        isLoading: apiLoading,
        error: apiError
    } = useApiQuery<WorkFormatDTO[]>(
        ['formats'],
        {
            url: import.meta.env.VITE_API_GET_FORMATS_URL,
            method: 'GET'
        },
        {
            staleTime: 5 * 60 * 1000,
            enabled: formats.length === 0 // Solo hace la llamada si no hay formatos en el store
        }
    );

    // Sincronizar datos de la API con el store
    useEffect(() => {
        if (data && data.length > 0) {
            setFormats(data);
        }
    }, [data, setFormats]);

    // Sincronizar estados de loading y error
    useEffect(() => {
        setLoading(apiLoading);
        setError(apiError ? String(apiError) : null);
    }, [apiLoading, apiError, setLoading, setError]);

    return {
        formats: formats.length > 0 ? formats : data || [],
        isLoading: formats.length > 0 ? false : apiLoading,
        error: apiError ? String(apiError) : null
    };
};

// Función helper para obtener formatos desde el store (solo lectura)
export const getFormatsFromStore = () => {
    return useFormatStore.getState().formats;
};