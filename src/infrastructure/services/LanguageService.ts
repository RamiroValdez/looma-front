import { type LanguageDTO } from "../../domain/dto/LanguageDTO.ts";
import { useApiQuery } from "../api/useApiQuery.ts";
import { useLanguageStore } from "../store/LanguageStore.ts";
import { useEffect, useMemo } from "react";

// Intenta normalizar la respuesta del backend a un array de LanguageDTO
const normalizeLanguages = (raw: unknown): LanguageDTO[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw as LanguageDTO[];
    if (typeof raw === 'object') {
        const obj = raw as any;
        if (Array.isArray(obj.languages)) return obj.languages as LanguageDTO[];
        if (Array.isArray(obj.data)) return obj.data as LanguageDTO[];
        // Buscar primer propiedad que sea array de objetos con id/code/name
        const candidate = Object.values(obj).find(v => Array.isArray(v) && v.every(item => typeof item === 'object' && item && 'id' in item && 'code' in item));
        if (Array.isArray(candidate)) return candidate as LanguageDTO[];
    }
    return [];
};

export const useLanguages = () => {
    const {
        languages,
        setLanguages,
        setLoading,
        setError
    } = useLanguageStore();

    const {
        data: rawData,
        isLoading: apiLoading,
        error: apiError
    } = useApiQuery<unknown>(
        ['languages'],
        {
            url: import.meta.env.VITE_API_GET_LANGUAGES_URL,
            method: 'GET'
        },
        {
            staleTime: 5 * 60 * 1000,
            enabled: languages.length === 0 
        }
    );

    const normalized = useMemo(() => normalizeLanguages(rawData), [rawData]);

    useEffect(() => {
        if (normalized.length > 0 && languages.length === 0) {
            setLanguages(normalized);
        }
    }, [normalized, setLanguages, languages.length]);

    useEffect(() => {
        setLoading(apiLoading);
        setError(apiError ? String(apiError) : null);
    }, [apiLoading, apiError, setLoading, setError]);

    return {
        languages: languages.length > 0 ? languages : normalized,
        isLoading: languages.length > 0 ? false : apiLoading,
        error: apiError ? String(apiError) : null
    };
};

export const getLanguagesFromStore = () => {
    return useLanguageStore.getState().languages;
};