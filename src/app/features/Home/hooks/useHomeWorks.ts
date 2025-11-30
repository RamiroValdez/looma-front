import { useEffect, useState } from "react";
import { getHomeWorkList } from "../../../../infrastructure/services/HomeService";
import { useUserStore } from "../../../../infrastructure/store/UserStorage";
import type { WorkDTO } from "../../../../domain/dto/WorkDTO";

export function useHomeWorks() {
    const { user } = useUserStore();
    const [top10, setTop10] = useState<WorkDTO[]>([]);
    const [newReleases, setNewReleases] = useState<WorkDTO[]>([]);
    const [recentlyUpdated, setRecentlyUpdated] = useState<WorkDTO[]>([]);
    const [continueReading, setContinueReading] = useState<WorkDTO[]>([]);
    const [preferences, setPreferences] = useState<WorkDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const workList = await getHomeWorkList(user?.userId || 0);
                setTop10(workList.topTen);
                if (workList.currentlyReading) setContinueReading(workList.currentlyReading);
                setNewReleases(workList.newReleases);
                setRecentlyUpdated(workList.recentlyUpdated);
                setPreferences(workList.userPreferences);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.userId]);

    const uniquePreferences = preferences.filter(
        (work, index, self) => self.findIndex(w => w.id === work.id) === index
    );

    const bannerBooks = top10
        .filter((work) => work.banner && work.banner.trim() !== '')
        .slice(0, 3)
        .map((work) => ({
            id: work.id,
            title: work.title,
            banner: work.banner,
            categories: work.categories?.map(cat => cat.name) || [],
            description: work.description,
        }));

    return {
        loading,
        top10,
        newReleases,
        recentlyUpdated,
        continueReading,
        uniquePreferences,
        bannerBooks,
    };
}