import type { WorkDTO } from '../../domain/dto/WorkDTO.ts';
import { useApiQuery } from "../api/useApiQuery.ts";
import { useAuthStore } from "../../domain/store/AuthStore.ts";
import {buildEndpoint} from "../api/endpoints.ts";

export function useMyWorks(creatorId: number) {
    const { token } = useAuthStore();
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
            refetchOnMount: "always",
            staleTime: 0,
            select: (allWorks: WorkDTO[]) =>
                allWorks.filter(work => work.creator.id === creatorId)
        }
    );
}