import { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useExploreWorks } from '../../../../infrastructure/services/ExploreService';
import type { ExploreFiltersDto } from '../../../../domain/dto/ExploreFiltrersDTO';

export function useExplore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get('q') || undefined;
  const categoryIdsParam = searchParams.get('categoryIds');
  const formatIdsParam = searchParams.get('formatIds');
  const [filters, setFilters] = useState<ExploreFiltersDto>({ text: qParam });
  const [page, setPage] = useState(0);
  const location = useLocation();
  const { data, isLoading, error } = useExploreWorks(filters, page, 20);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setFilters({ text: qParam });
    setPage(0);
    setShowMobileFilters(false);
  }, [location.pathname, qParam]);

  useEffect(() => {
    if (qParam) {
      setFilters((prev) => ({ ...prev, text: qParam }));
      setPage(0);
    }
    if (categoryIdsParam) {
      setFilters((prev) => ({ ...prev, categoryIds: [Number(categoryIdsParam)] }));
      setPage(0);
    }
    if (formatIdsParam) {
      setFilters((prev) => ({ ...prev, formatIds: [Number(formatIdsParam)] }));
      setPage(0);
    }
  }, [qParam, categoryIdsParam, formatIdsParam]);

  const handleFilterChange = (newFilters: Partial<ExploreFiltersDto>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(0);

    if ('text' in newFilters) {
      if (newFilters.text) {
        searchParams.set('q', newFilters.text);
      } else {
        searchParams.delete('q');
      }
    }
    if ('categoryIds' in newFilters) {
      if (newFilters.categoryIds && newFilters.categoryIds.length > 0) {
        searchParams.set('categoryIds', String(newFilters.categoryIds[0]));
      } else {
        searchParams.delete('categoryIds');
      }
    }
    if ('formatIds' in newFilters) {
      if (newFilters.formatIds && newFilters.formatIds.length > 0) {
        searchParams.set('formatIds', String(newFilters.formatIds[0]));
      } else {
        searchParams.delete('formatIds');
      }
    }
    setSearchParams(searchParams, { replace: true });
  };

  const handleEpisodeRangeChange = (rangeValue: string, isChecked: boolean) => {
    const currentRanges = (filters.rangeEpisodes as string[] || []);
    const updatedRanges: string[] = isChecked
      ? [...currentRanges, rangeValue]
      : currentRanges.filter(val => val !== rangeValue);
    handleFilterChange({ rangeEpisodes: updatedRanges });
  };

  const handleUpdateRangeChange = (updateValue: string, isChecked: boolean) => {
    const currentUpdates = (filters.lastUpdated as string[] || []);
    const updatedUpdates: string[] = isChecked
      ? [...currentUpdates, updateValue]
      : currentUpdates.filter(val => val !== updateValue);
    handleFilterChange({ lastUpdated: updatedUpdates });
  };

  const handleFinishedChange = (isChecked: boolean) => {
    handleFilterChange({ state: isChecked ? 'finished' : undefined });
  };

  return {
    filters,
    setFilters,
    page,
    setPage,
    data,
    isLoading,
    error,
    showMobileFilters,
    setShowMobileFilters,
    handleFilterChange,
    handleEpisodeRangeChange,
    handleUpdateRangeChange,
    handleFinishedChange,
    qParam,
  };
}