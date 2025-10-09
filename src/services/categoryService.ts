import { type CategoryDTO } from "../dtos/category.dto";
import { useApiQuery } from "../api/useApiQuery.ts";
import { useCategoryStore } from "../store/CategoryStore";
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

    // Sincronizar datos de la API con el store
    useEffect(() => {
        if (data && data.length > 0) {
            setCategories(data);
        }
    }, [data, setCategories]);

    // Sincronizar estados de loading y error
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

// Función helper para obtener categorías desde el store (solo lectura)
export const getCategoriesFromStore = () => {
    return useCategoryStore.getState().categories;
};