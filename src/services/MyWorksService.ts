
import type { WorkDTO } from '../dto/WorkDTO';
import { useApiQuery } from "../api/useApiQuery.ts";
import { useAuthStore } from "../store/AuthStore.ts";
import {buildEndpoint} from "../utils/endpoints.ts";

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
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            staleTime: 1000 * 60 * 5,
            select: (allWorks: WorkDTO[]) =>
                allWorks.filter(work => work.creator.id === creatorId)
        }
    );
}