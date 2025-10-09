import { type LanguageDTO } from "../dto/LanguageDTO";
import { useApiQuery } from "../api/useApiQuery.ts";
import { useLanguageStore } from "../store/LanguageStore";
import { useEffect } from "react";

// Custom hook que maneja la lógica de store + API
export const useLanguages = () => {
    const {
        languages,
        setLanguages,
        setLoading,
        setError
    } = useLanguageStore();

    const {
        data,
        isLoading: apiLoading,
        error: apiError
    } = useApiQuery<LanguageDTO[]>(
        ['languages'],
        {
            url: import.meta.env.VITE_API_GET_FORMATS_URL,
            method: 'GET'
        },
        {
            staleTime: 5 * 60 * 1000,
            enabled: languages.length === 0 // Solo hace la llamada si no hay idiomas en el store
        }
    );

    // Sincronizar datos de la API con el store
    useEffect(() => {
        if (data && data.length > 0) {
            setLanguages(data);
        }
    }, [data, setLanguages]);

    // Sincronizar estados de loading y error
    useEffect(() => {
        setLoading(apiLoading);
        setError(apiError ? String(apiError) : null);
    }, [apiLoading, apiError, setLoading, setError]);

    return {
        languages: languages.length > 0 ? languages : data || [],
        isLoading: languages.length > 0 ? false : apiLoading,
        error: apiError ? String(apiError) : null
    };
};

// Función helper para obtener idiomas desde el store (solo lectura)
export const getLanguagesFromStore = () => {
    return useLanguageStore.getState().languages;
};