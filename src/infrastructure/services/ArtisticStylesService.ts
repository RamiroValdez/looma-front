import { type ArtisticStyleDTO } from "../../domain/dto/ArtisticStyleDTO.ts";
import { useApiQuery } from "../api/useApiQuery.ts";
import { useArtisticStyleStore } from "../../domain/store/ArtisticStyleStore";
import { useEffect } from "react";
import {useAuthStore} from "../../domain/store/AuthStore.ts";

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
        ['artisticStyles'], 
        {
            url: import.meta.env.VITE_API_GET_ARTISTIC_STYLES_URL,
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
            enabled: artisticStyles.length === 0 
        }
    );
    useEffect(() => {
        if (data && data.length > 0) {
            setArtisticStyles(data);
        }
    }, [data, setArtisticStyles]);

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

export const getArtisticStylesFromStore = () => {
    return useArtisticStyleStore.getState().artisticStyles;
};