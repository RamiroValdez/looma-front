import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../infrastructure/api/apiClient';
import { useAuthStore } from '../store/AuthStore';
import type { ExploreFiltersDto } from '../../domain/dto/ExploreFiltrersDTO';
import type { WorkCardDto } from '../../domain/dto/WorkCardDTO';

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const useExploreWorks = (filters: ExploreFiltersDto, page = 0, size = 20) => {
  const { token } = useAuthStore();

  return useQuery<PaginatedResponse<WorkCardDto>>({
    queryKey: ['explore', filters, page, size, !!token],
    queryFn: async () => {
      const qs = new URLSearchParams({ page: String(page), size: String(size) });

      const response = await apiClient.request<PaginatedResponse<WorkCardDto>>({
        url: `${import.meta.env.VITE_API_EXPLORE_URL}?${qs}`,
        method: 'POST',
        data: filters,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      return response.data;
    },
    staleTime: 5 * 60_000,
  });
};
