import { useState, useEffect } from 'react';
import { useExploreWorks } from '../../../infrastructure/services/ExploreService';
import { useFormats } from '../../../infrastructure/services/FormatService';
import { useCategories } from '../../../infrastructure/services/CategoryService';
import type { ExploreFiltersDto } from '../../../domain/dto/ExploreFiltrersDTO';
import { WorkItemSearch } from '../../components/WorkItemSearch';
import { useSearchParams } from 'react-router-dom';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get('q') || undefined;

  const [filters, setFilters] = useState<ExploreFiltersDto>({ text: qParam });
  const [page, setPage] = useState(0);
  const { formats, isLoading: loadingFormats } = useFormats();
  const { categories, isLoading: loadingCategories } = useCategories();
  const { data, isLoading, error } = useExploreWorks(filters, page, 20);

  const EPISODE_RANGES = [
    { label: 'Cualquiera', value: 'cualquiera' },
    { label: '1-5 episodios', value: '1-5' },
    { label: '6-10 episodios', value: '6-10' },
    { label: '11-20 episodios', value: '11-20' },
    { label: '21+ episodios', value: '21+' },
  ];

  const UPDATE_PERIODS = [
    { label: 'Hoy', value: 'today' },
    { label: 'Última semana', value: 'last_week' },
    { label: 'Último mes', value: 'last_month' },
    { label: 'Últimos 3 meses', value: 'last_3_months' },
    { label: 'Último año', value: 'last_year' },
  ];

  useEffect(() => {
    if (qParam) {
      setFilters((prev) => ({ ...prev, text: qParam }));
      setPage(0);
    }
  }, [qParam]);

  const handleFilterChange = (newFilters: Partial<ExploreFiltersDto>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(0);

    if ('text' in newFilters) {
      if (newFilters.text) {
        searchParams.set('q', newFilters.text);
      } else {
        searchParams.delete('q');
      }
      setSearchParams(searchParams, { replace: true });
    }
  };

  const handleEpisodeRangeChange = (rangeValue: string, isChecked: boolean) => {
    const currentRanges = (filters.rangeEpisodes as string[] || []); 
    let updatedRanges: string[];

    if (isChecked) {
        updatedRanges = [...currentRanges, rangeValue];
    } else {
        updatedRanges = currentRanges.filter(val => val !== rangeValue);
    }

    const newFilters: Partial<ExploreFiltersDto> = {
        rangeEpisodes: updatedRanges,
    };
    handleFilterChange(newFilters);
};

const handleUpdateRangeChange = (updateValue: string, isChecked: boolean) => {
    const currentUpdates = (filters.lastUpdated as string[] || []); 
    let updatedUpdates: string[];
    if (isChecked) {
        updatedUpdates = [...currentUpdates, updateValue];
    } else {
        updatedUpdates = currentUpdates.filter(val => val !== updateValue);
    }
    const newFilters: Partial<ExploreFiltersDto> = {
        lastUpdated: updatedUpdates,
    };
    handleFilterChange(newFilters);
}

const handleFinishedChange = (isChecked: boolean) => {
    const newFilters: Partial<ExploreFiltersDto> = {
        state: isChecked ? 'finished' : undefined,
    };
    handleFilterChange(newFilters);
}


  if (loadingFormats || loadingCategories) return <div>Cargando catálogos...</div>;
  if (error) return <div>Error al cargar obras: {error.message}</div>;

  return (
    <div className="p-4">
      <div className="flex gap-6">
        <aside className="w-48 flex-shrink-0 mt-22">
          <h3 className="font-semibold mb-2 text-lg">Longitud</h3>
          <div className="filter-group ml-1">
                {EPISODE_RANGES.map(({ label, value }) => (
            <label key={value} className="flex items-center space-x-2 mb-2">
                <input
                    type="checkbox"
                    checked={filters.rangeEpisodes?.includes(value) || false}
                    onChange={(e) => 
                        handleEpisodeRangeChange(value, e.target.checked)
                    }
                    className="form-checkbox accent-gray-900"
                      />
                      <span>{label}</span>
                  </label>
              ))} 
          </div>

          <h3 className="font-semibold mb-2 text-lg mt-8">Última actualización</h3>
          <div className="mt-2 filter-group ml-1">
                {UPDATE_PERIODS.map(({ label, value }) => (
            <label key={value} className="flex items-center space-x-2 mb-2">
                <input
                    type="checkbox"
                    checked={filters.lastUpdated?.includes(value) || false}
                    onChange={(e) =>
                        handleUpdateRangeChange(value, e.target.checked)
                    }
                    className="form-checkbox accent-gray-900"
                />
                <span>{label}</span>
                    </label>
                ))}
            </div>
            
            <h3 className='font-semibold mb-2 text-lg mt-8'>Contenido</h3>
                <div className="filter-group">
                    <label className="flex items-center space-x-2 ml-1">
                        <input
                            type="checkbox"
                            checked={filters.state === 'finished'} 
                            onChange={(e) => 
                                handleFinishedChange(e.target.checked)
                            }
                            className="form-checkbox accent-gray-900"
                        />
                        <span className='whitespace-nowrap'>Solo historias completas</span>
                    </label>
                </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex items-end justify-between mr-17">
            <div className="flex items-end gap-3">
              <h2 className="text-2xl font-bold">
                Explorar obras {qParam && <span className="text-base text-gray-600">– "{qParam}"</span>}
              </h2>

              {qParam && (
                <button
                  onClick={() => handleFilterChange({ text: undefined })}
                  className="text-sm text-violet-500 cursor-pointer hover:underline"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>

            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <select
                  className="w-40 border rounded px-3 py-2"
                  value={filters.categoryIds?.[0] ?? ''}
                  onChange={(e) =>
                    handleFilterChange({
                      categoryIds: e.target.value ? [Number(e.target.value)] : undefined,
                    })
                  }
                >
                  <option value="">Todas</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Formato</label>
                <select
                  className="w-40 border rounded px-3 py-2"
                  value={filters.formatIds?.[0] ?? ''}
                  onChange={(e) =>
                    handleFilterChange({
                      formatIds: e.target.value ? [Number(e.target.value)] : undefined,
                    })
                  }
                >
                  <option value="">Todos</option>
                  {formats?.map((fmt) => (
                    <option key={fmt.id} value={fmt.id}>
                      {fmt.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div>Cargando obras...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-x-0 gap-y-8">
                {data?.content.map((work) => (
                  <WorkItemSearch key={work.id} work={work} />
                ))}
              </div>

              {(data?.totalPages ?? 0) > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <span className="px-4 py-2">
                    Página {page + 1} de {data?.totalPages ?? 1}
                  </span>
                  <button
                    disabled={page + 1 >= (data?.totalPages ?? 1)}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}