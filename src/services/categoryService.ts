import { type CategoryDTO } from "../dto/CategoryDTO.ts";
import { useApiQuery } from "../api/useApiQuery.ts";
import { useCategoryStore } from "../store/CategoryStore.ts";
import { useEffect } from "react";

export const useCategories = () => {
    const {
        categories,
        setCategories,
        setLoading,
        setError
    } = useCategoryStore();

    const {
        data,
        isLoading: apiLoading,
        error: apiError
    } = useApiQuery<CategoryDTO[]>(
        ['categories'],
        {
            url: import.meta.env.VITE_API_GET_CATEGORIES_URL,
            method: 'GET'
        },
        {
            staleTime: 5 * 60 * 1000,
            enabled: categories.length === 0
        }
    );

    useEffect(() => {
        if (data && data.length > 0) {
            setCategories(data);
        }
    }, [data, setCategories]);

    useEffect(() => {
        setLoading(apiLoading);
        setError(apiError ? String(apiError) : null);
    }, [apiLoading, apiError, setLoading, setError]);

    return {
        categories: categories.length > 0 ? categories : data || [],
        isLoading: categories.length > 0 ? false : apiLoading,
        error: apiError ? String(apiError) : null
    };
};

export const getCategoriesFromStore = () => {
    return useCategoryStore.getState().categories;
};