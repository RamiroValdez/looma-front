import { useApiQuery } from "../api/useApiQuery";
import { useFormatStore } from "../store/FormatStore";
import { useEffect } from "react";
import type { WorkFormatDTO } from "../../domain/dto/WorkFormatDTO";

export const useFormats = () => {
  const { formats, setFormats, setLoading, setError } = useFormatStore();

  const { data, isLoading: apiLoading, error: apiError } = useApiQuery<WorkFormatDTO[]>(
    ['formats'],
    {
      url: import.meta.env.VITE_API_GET_FORMATS_URL,
      method: 'GET'
    },
    {
      staleTime: 5 * 60 * 1000,
      enabled: formats.length === 0
    }
  );

  useEffect(() => {
    if (data && data.length > 0) setFormats(data);
  }, [data, setFormats]);

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