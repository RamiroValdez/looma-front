import { useFormats } from '../../hooks/useFormats';
import { useCategories } from '../../hooks/useCategories';
import { WorkItemSearch } from '../../components/WorkItemSearch';
import { useExplore } from './hooks/useExplore';
import type { ExploreFiltersDto } from '../../../domain/dto/ExploreFiltrersDTO';

const EPISODE_RANGES = [
  { label: 'Cualquiera', value: 'cualquiera' },
  { label: '1-5 capítulos', value: '1-5' },
  { label: '6-10 capítulos', value: '6-10' },
  { label: '11-20 capítulos', value: '11-20' },
  { label: '21+ capítulos', value: '21+' },
];

const UPDATE_PERIODS = [
  { label: 'Hoy', value: 'today' },
  { label: 'Última semana', value: 'last_week' },
  { label: 'Último mes', value: 'last_month' },
  { label: 'Últimos 3 meses', value: 'last_3_months' },
  { label: 'Último año', value: 'last_year' },
];

interface RenderFilterGroupsProps {
  filters: ExploreFiltersDto;
  handleEpisodeRangeChange: (rangeValue: string, isChecked: boolean) => void;
  handleUpdateRangeChange: (updateValue: string, isChecked: boolean) => void;
  handleFinishedChange: (isChecked: boolean) => void;
}

function RenderFilterGroups({
  filters,
  handleEpisodeRangeChange,
  handleUpdateRangeChange,
  handleFinishedChange,
}: RenderFilterGroupsProps) {
  return (
    <div className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-2">
        <legend className="font-semibold mb-2 text-lg">Longitud</legend>
        {EPISODE_RANGES.map(({ label, value }) => (
          <label key={value} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.rangeEpisodes?.includes(value) || false}
              onChange={(e) => handleEpisodeRangeChange(value, e.target.checked)}
              className="form-checkbox accent-gray-900 cursor-pointer"
            />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="font-semibold mb-2 text-lg">Última actualización</legend>
        {UPDATE_PERIODS.map(({ label, value }) => (
          <label key={value} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.lastUpdated?.includes(value) || false}
              onChange={(e) => handleUpdateRangeChange(value, e.target.checked)}
              className="form-checkbox accent-gray-900 cursor-pointer"
            />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className='font-semibold mb-2 text-lg'>Contenido</legend>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filters.state === 'finished'}
            onChange={(e) => handleFinishedChange(e.target.checked)}
            className="form-checkbox accent-gray-900 cursor-pointer"
          />
          <span className='whitespace-nowrap'>Historias completas</span>
        </label>
      </fieldset>
    </div>
  );
}

export default function ExplorePage() {
  const { formats, isLoading: loadingFormats } = useFormats();
  const { categories, isLoading: loadingCategories } = useCategories();
  const {
    filters,
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
  } = useExplore();

  if (loadingFormats || loadingCategories) return <div>Cargando catálogos...</div>;
  if (error) return <div>Error al cargar obras: {typeof error === 'string' ? error : error.message}</div>;

  return (
    <div className="min-h-screen">
      <div className="p-4 min-h-[calc(100vh-100px)]">
        <div className="flex gap-6">
          <aside className="hidden md:block w-56 flex-shrink-0 mt-2 bg-white rounded-lg p-4 shadow-sm h-fit">
            <RenderFilterGroups
              filters={filters}
              handleEpisodeRangeChange={handleEpisodeRangeChange}
              handleUpdateRangeChange={handleUpdateRangeChange}
              handleFinishedChange={handleFinishedChange}
            />
          </aside>
          <div className="flex-1">
            <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-2 md:gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold text-[#172fa6]">
                    Explorar obras {qParam && <span className="text-base text-gray-600">– "{qParam}"</span>}
                  </h2>
                  {qParam && (
                    <button
                      onClick={() => handleFilterChange({ text: undefined })}
                      className="text-sm text-violet-600 cursor-pointer hover:underline"
                    >
                      Limpiar búsqueda
                    </button>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium mb-1">Categoría</label>
                    <select
                      className="sm:w-48 w-full border rounded-full cursor-pointer px-3 py-2 pr-10 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[right_0.9rem_center] bg-[length:1.25em]"
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
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium mb-1">Formato</label>
                    <select
                      className="sm:w-48 w-full border rounded-full cursor-pointer px-3 py-2 pr-10 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[right_0.9rem_center] bg-[length:1.25em]"
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
            </div>
            <div className="mb-4 md:hidden flex justify-center items-center text-center">
              <button
                onClick={() => setShowMobileFilters(prev => !prev)}
                className="px-4 py-2 border rounded-full text-sm font-medium bg-white shadow-sm active:scale-[.97] transition"
                aria-expanded={showMobileFilters}
                aria-controls="mobile-filters"
              >
                {showMobileFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
              </button>
            </div>
            <div
              id="mobile-filters"
              className={`md:hidden overflow-hidden transition-all duration-300 ${showMobileFilters ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'} bg-white border rounded-lg shadow-sm px-4 ${showMobileFilters ? 'py-4 mt-0 mb-6' : 'py-0 mt-0 mb-2'}`}
              aria-hidden={!showMobileFilters}
            >
              {showMobileFilters && (
                <RenderFilterGroups
                  filters={filters}
                  handleEpisodeRangeChange={handleEpisodeRangeChange}
                  handleUpdateRangeChange={handleUpdateRangeChange}
                  handleFinishedChange={handleFinishedChange}
                />
              )}
            </div>
            {isLoading ? (
              <div>Cargando obras...</div>
            ) : (
              <>
                {data?.content && data.content.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] justify-items-center gap-6">
                    {data.content.map((work) => (
                      <WorkItemSearch key={work.id} work={work} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center py-16 text-gray-600 w-full text-center">
                    <img src="/img/triste_1.png" alt="Sin obras encontradas" className="w-70 h-70 mb-6" />
                    <p className="text-lg">No se encontraron obras</p>
                  </div>
                )}
                {data?.content && data.content.length > 0 && (data?.totalPages ?? 0) > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      disabled={page === 0}
                      onClick={() => setPage((p) => p - 1)}
                      className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50 transition"
                    >
                      Anterior
                    </button>
                    <span className="px-4 py-2 text-sm">
                      Página {page + 1} de {data?.totalPages ?? 1}
                    </span>
                    <button
                      disabled={page + 1 >= (data?.totalPages ?? 1)}
                      onClick={() => setPage((p) => p + 1)}
                      className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50 transition"
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
    </div>
  );
}