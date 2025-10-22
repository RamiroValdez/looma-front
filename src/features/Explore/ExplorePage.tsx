import { useState } from 'react';
import { useExploreWorks } from '../../services/ExploreService';
import { useFormats } from '../../services/formatService';
import { useCategories } from '../../services/categoryService';
import type { ExploreFiltersDto } from '../../dto/ExploreFiltrersDTO';
import { WorkItemSearch } from '../../components/WorkItemSearch';

export default function ExplorePage() {
  const [filters, setFilters] = useState<ExploreFiltersDto>({});
  const [page, setPage] = useState(0);

  const { formats, isLoading: loadingFormats } = useFormats();
  const { categories, isLoading: loadingCategories } = useCategories();

  const { data, isLoading, error } = useExploreWorks(filters, page, 20);

  const handleFilterChange = (newFilters: Partial<ExploreFiltersDto>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(0); 
  };

  if (loadingFormats || loadingCategories) return <div>Cargando catálogos...</div>;
  if (error) return <div>Error al cargar obras: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Explorar Obras</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <select
            className="w-full border rounded px-3 py-2"
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

        {/* Select de Formatos */}
        <div>
          <label className="block text-sm font-medium mb-1">Formato</label>
          <select
            className="w-full border rounded px-3 py-2"
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

        <div>
          <label className="block text-sm font-medium mb-1">Likes mínimos</label>
          <input
            type="number"
            min="0"
            className="w-full border rounded px-3 py-2"
            value={filters.minLikes ?? ''}
            onChange={(e) =>
              handleFilterChange({
                minLikes: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder="Ej: 100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ordenar por</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={filters.sortBy ?? 'publicationDate'}
            onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
          >
            <option value="publicationDate">Fecha de publicación</option>
            <option value="title">Título</option>
            <option value="likes">Likes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Orden</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={filters.asc === false ? 'desc' : 'asc'}
            onChange={(e) => handleFilterChange({ asc: e.target.value === 'asc' })}
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div>Cargando obras...</div>
      ) : (
           <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.content.map((work) => (
              <WorkItemSearch key={work.id} work={work} />
            ))}
          </div>

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
  );
}