import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useExploreWorks } from '../../services/ExploreService';
import { useFormats } from '../../services/formatService';
import { useCategories } from '../../services/categoryService';
import type { ExploreFiltersDto } from '../../dto/ExploreFiltrersDTO';
import { WorkItemSearch } from '../../components/WorkItemSearch';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get('q') || undefined;

  const [filters, setFilters] = useState<ExploreFiltersDto>({ text: qParam });
  const [page, setPage] = useState(0);

  const { formats, isLoading: loadingFormats } = useFormats();
  const { categories, isLoading: loadingCategories } = useCategories();

  const { data, isLoading, error } = useExploreWorks(filters, page, 20);

  // Sincronizar el filtro de texto con el query param
  useEffect(() => {
    if (qParam) {
      setFilters((prev) => ({ ...prev, text: qParam }));
      setPage(0);
    }
  }, [qParam]);

  const handleFilterChange = (newFilters: Partial<ExploreFiltersDto>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(0);

    // Si cambia el texto de búsqueda, actualizar la URL
    if ('text' in newFilters) {
      if (newFilters.text) {
        searchParams.set('q', newFilters.text);
      } else {
        searchParams.delete('q');
      }
      setSearchParams(searchParams, { replace: true });
    }
  };

  if (loadingFormats || loadingCategories) return <div>Cargando catálogos...</div>;
  if (error) return <div>Error al cargar obras: {error.message}</div>;

  return (
    <div className="p-4">
      {/* Layout principal: sidebar de ordenamiento + grilla */}
      <div className="flex gap-6">
        {/* Sidebar de ordenamiento (izquierda) */}
        <aside className="w-48 flex-shrink-0 mt-22">
          <h3 className="font-semibold mb-3 text-sm">Ordenar por</h3>
          <div className="space-y-2 mb-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="sortBy"
                value="publicationDate"
                checked={filters.sortBy === 'publicationDate' || !filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              />
              Fecha de publicación
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="sortBy"
                value="title"
                checked={filters.sortBy === 'title'}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              />
              Título
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="sortBy"
                value="likes"
                checked={filters.sortBy === 'likes'}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              />
              Likes
            </label>
          </div>

          <h3 className="font-semibold mb-3 text-sm pt-3">Orden</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="order"
                value="asc"
                checked={filters.asc !== false}
                onChange={() => handleFilterChange({ asc: true })}
              />
              Ascendente
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="order"
                value="desc"
                checked={filters.asc === false}
                onChange={() => handleFilterChange({ asc: false })}
              />
              Descendente
            </label>
          </div>
        </aside>

        {/* Columna derecha: cabecera (título + selects) + grilla */}
        <div className="flex-1">
          {/* Cabecera alineada al inicio de la grilla */}
          <div className="mb-6 flex items-end justify-between mr-17">
            <h2 className="text-2xl font-bold">
              Explorar obras {qParam && <span className="text-base text-gray-600">– "{qParam}"</span>}
            </h2>

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

          {/* Grilla de obras */}
          {isLoading ? (
            <div>Cargando obras...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-x-0 gap-y-8">
                {data?.content.map((work) => (
                  <WorkItemSearch key={work.id} work={work} />
                ))}
              </div>

              {/* Paginación */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}