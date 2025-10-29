import { type ColorPaletteDTO } from "../../domain/dto/ColorPaletteDTO.ts";
import { useApiQuery } from "../api/useApiQuery.ts";
import { useColorPaletteStore } from "../../domain/store/ColorPaletteStore";
import { useEffect } from "react";
import {useAuthStore} from "../../domain/store/AuthStore.ts";

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
        ['colorPalettes'], 
        {
            url: import.meta.env.VITE_API_GET_COLOR_PALETTES_URL,
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
            enabled: colorPalettes.length === 0
        }
    );

    useEffect(() => {
        if (data && data.length > 0) {
            setColorPalettes(data);
        }
    }, [data, setColorPalettes]);

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

export const getColorPalettesFromStore = () => {
    return useColorPaletteStore.getState().colorPalettes;
};