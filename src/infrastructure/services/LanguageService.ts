import { type LanguageDTO } from "../../domain/dto/LanguageDTO.ts";
import { useApiQuery } from "../api/useApiQuery.ts";
import { useLanguageStore } from "../../domain/store/LanguageStore.ts";
import { useEffect } from "react";

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
            url: import.meta.env.VITE_API_GET_LANGUAGES_URL,
            method: 'GET'
        },
        {
            staleTime: 5 * 60 * 1000,
            enabled: languages.length === 0 
        }
    );

    useEffect(() => {
        if (data && data.length > 0) {
            setLanguages(data);
        }
    }, [data, setLanguages]);

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

export const getLanguagesFromStore = () => {
    return useLanguageStore.getState().languages;
};