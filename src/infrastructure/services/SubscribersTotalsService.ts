import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/AuthStore';
import { apiClient } from '../api/apiClient';
import type { WorkDTO } from '../../domain/dto/WorkDTO';

interface SubscribersTotalsResult {
  authorTotal: number;
  perWork: Record<number, number>; // workId -> total subscribers
}

// Hook para obtener el total de suscriptores del autor y de cada obra simultáneamente.
// Nota: Las cifras pueden tener superposición (un usuario puede estar suscrito al autor y a una obra),
// por lo que el gráfico resultante es ilustrativo.
export function useSubscribersTotals(authorId: number, works: WorkDTO[]) {
  const { token } = useAuthStore();

  return useQuery<SubscribersTotalsResult>({
    queryKey: ['subs-totals', authorId, works.map(w => w.id).join(',')],
    queryFn: async () => {
      if (!authorId || !token || works.length === 0) {
        return { authorTotal: 0, perWork: {} };
      }
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const analyticsUrl = import.meta.env.VITE_API_ANALYTICS_URL || '';
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const authorReq = apiClient.request<number>({
        url: `${baseUrl}${analyticsUrl}/totalSuscribersPerAuthor/${authorId}`,
        method: 'GET',
        headers,
      }).catch(() => ({ data: 0 }));

      const workRequests = works.map(w => (
        apiClient.request<number>({
          url: `${baseUrl}${analyticsUrl}/totalSuscribersPerWork/${w.id}`,
          method: 'GET',
          headers,
        }).catch(() => ({ data: 0 })).then(res => ({ workId: w.id, total: res.data || 0 }))
      ));

      const [authorRes, perWorkArray] = await Promise.all([authorReq, Promise.all(workRequests)]);

      const perWork: Record<number, number> = {};
      perWorkArray.forEach(entry => { perWork[entry.workId] = entry.total; });

      return {
        authorTotal: authorRes.data || 0,
        perWork,
      };
    },
    enabled: !!authorId && !!token && works.length > 0,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
}
