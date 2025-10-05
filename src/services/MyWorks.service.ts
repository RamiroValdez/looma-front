
import type { WorkDTO } from '../dto/WorkDTO';
import { useApiQuery } from "../api/useApiQuery.ts";
import { useAuthStore } from "../store/AuthStore.ts";
import {buildEndpoint} from "../utils/endpoints.ts";

/**
 * Obtiene todas las obras y las filtra por el ID de creador proporcionado.
 * @param creatorId El ID del usuario cuyas obras se deben buscar.
 * @returns El resultado del hook useApiQuery con las obras filtradas.
 */
export function useMyWorks(creatorId: number) {
    const { token } = useAuthStore();
    console.log('Token:', token);
    return useApiQuery<WorkDTO[]>(
        ["get-my-works", creatorId.toString()],
        {
            url: buildEndpoint(import.meta.env.VITE_API_GET_MY_WORKS_URL, {creatorId}),
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        },
        {
            enabled: !!creatorId && !!token,
            select: (allWorks: WorkDTO[]) =>
                allWorks.filter(work => work.creator.id === creatorId)
        }
    );
}