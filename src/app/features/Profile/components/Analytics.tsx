import {useAnalytics} from "../../../../infrastructure/services/AnalyticsService.ts";
import {AnalyticsLineChart} from "./AnalyticsLineChart.tsx";
import {AnalyticsChapterLineChart} from "./AnalyticsChapterLineChart.tsx";
import {AnalyticsRetentionBarChart} from "./AnalyticsRetentionBarChart.tsx";
import {useMyWorks} from "../../../../infrastructure/services/MyWorksService.ts";
import {getCurrentUser} from "../../../../infrastructure/services/DataUserService.ts";
import {useEffect, useState} from "react";
import type {UserDTO} from "../../../../domain/dto/UserDTO.ts";
import type { WorkDTO } from "../../../../domain/dto/WorkDTO.ts";
import { AnalyticsSubscribersPieChart } from "./AnalyticsSubscribersPieChart.tsx";
import { useSubscribersTotals } from "../../../../infrastructure/services/SubscribersTotalsService.ts";
import { Loader } from "../../../components/Loader.tsx";

export default function Analytics() {

    const [user, setUser] = useState<UserDTO | null>(null);
    const [selectedWork, setSelectedWork] = useState<WorkDTO | null>(null);
    const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
    const [userLoading, setUserLoading] = useState(true);
    const [userError, setUserError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const u = await getCurrentUser();
                if (active) {
                    setUser(u);
                }
            } catch (e: any) {
                if (active) setUserError(e?.message || 'Error obteniendo usuario');
            } finally {
                if (active) setUserLoading(false);
            }
        })();
        return () => { active = false; };
    }, []);

    const { data: myWorks, isLoading: worksLoading, error: worksError } = useMyWorks(user?.id ? Number(user.id) : 0);

    useEffect(() => {
        if (myWorks && myWorks.length > 0 && !selectedWork) {
            setSelectedWork(myWorks[0]);
        }
    }, [myWorks, selectedWork]);

    useEffect(() => {
        if (selectedWork) {
            const firstChapter = selectedWork.chapters?.[0];
            setSelectedChapterId(firstChapter ? firstChapter.id : null);
        } else {
            setSelectedChapterId(null);
        }
    }, [selectedWork]);

    const workId = selectedWork?.id || 0;
    const chapterId = selectedChapterId || 0;
    const authorId = selectedWork?.creator?.id || (user?.id ? Number(user.id) : 0);

    const { data, loading, error, refetch } = useAnalytics(workId, chapterId, authorId);
    const { data: subsTotals, isLoading: subsTotalsLoading, error: subsTotalsError } = useSubscribersTotals(authorId, myWorks || []);

    // Estados de loading global
    const globalLoading = userLoading || worksLoading || subsTotalsLoading || (loading && workId > 0);
    const globalError = userError || (worksError as any) || error || subsTotalsError;

    if (globalLoading) {
        return (
            <div className="flex-1 container p-4 flex">
                <div className="w-full min-h-[70vh] flex items-center justify-center">
                    <Loader size="md" color="primary" />
                </div>
            </div>
        );
    }

    if (globalError) {
        return <div className="p-6">Error al cargar las estadísticas: {String(globalError)}</div>;
    }

    if (!selectedWork) {
        return (
            <div className="flex-1 container p-4 flex">
                <div className="w-full min-h-[70vh] flex flex-col items-center justify-center text-gray-500">
                    <img src="/img/triste_1.png" alt="no data" className="w-70 h-70 mb-8" />
                    <div>No hay obras disponibles para mostrar estadísticas.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row w-full h-full gap-8 p-6">
            <div className="lg:w-1/3 xl:w-1/4 flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg shadow-sm bg-white/70 col-span-2">
                        <p className="font-medium text-sm">Total Suscriptores</p>
                        <p className="text-2xl font-semibold">{data.totalSuscribers}</p>
                    </div>
                    <div className="p-4 rounded-lg shadow-sm bg-white/70">
                        <p className="font-medium text-sm">Suscriptores Autor</p>
                        <p className="text-2xl font-semibold">{data.totalSuscribersAuthor}</p>
                    </div>
                    <div className="p-4 rounded-lg shadow-sm bg-white/70">
                        <p className="font-medium text-sm">Suscriptores Obra</p>
                        <p className="text-2xl font-semibold">{data.totalSuscribersWorks}</p>
                    </div>
                </div>
                <div className="rounded-lg shadow-sm p-4 bg-white/70">
                    <p className="font-medium text-sm mb-2">Distribución de Suscripciones</p>
                    {subsTotals && (
                        <AnalyticsSubscribersPieChart authorTotal={subsTotals.authorTotal} perWork={subsTotals.perWork} works={myWorks || []} />
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-6">
                <div className="flex flex-wrap gap-4 items-center rounded-lg p-4 bg-white/70 shadow-sm">
                    <div className="flex flex-col">
                        <label className="text-xs font-medium uppercase tracking-wide">Obra</label>
                        <select
                            className="mt-1 border rounded-xl px-2 py-1 text-sm bg-white"
                            value={selectedWork.id}
                            onChange={e => {
                                const id = Number(e.target.value);
                                const w = myWorks?.find(w => w.id === id) || null;
                                setSelectedWork(w);
                                refetch();
                            }}
                        >
                            {myWorks?.map(w => (
                                <option key={w.id} value={w.id}>{w.title}</option>
                            ))}
                        </select>
                    </div>
                    {selectedWork?.chapters && selectedWork.chapters.length > 0 && (
                        <div className="flex flex-col">
                            <label className="text-xs font-medium uppercase tracking-wide">Capítulo</label>
                            <select
                                className="mt-1 border rounded-xl px-2 py-1 text-sm bg-white"
                                value={selectedChapterId ?? ''}
                                onChange={e => {
                                    const cid = Number(e.target.value);
                                    setSelectedChapterId(cid);
                                    refetch();
                                }}
                            >
                                {selectedWork.chapters.map(c => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="rounded-lg shadow-sm p-4 bg-white/70">
                        <p className="font-medium text-sm mb-2">Guardados vs Suscriptores</p>
                        <AnalyticsLineChart savesData={data.savedWorks} subsData={data.subscribers} />
                    </div>
                    <div className="rounded-lg shadow-sm p-4 bg-white/70">
                        <p className="font-medium text-sm mb-2">Lecturas vs Likes (Capítulo)</p>
                        <AnalyticsChapterLineChart readingsData={data.readings} likesData={data.likes} />
                    </div>
                    <div className="rounded-lg shadow-sm p-4 bg-white/70">
                        <p className="font-medium text-sm mb-2">Retención Total</p>
                        <AnalyticsRetentionBarChart retentionData={data.retention} metric="percentFromFirst" title="Retención Total (desde el primer capítulo)" />
                    </div>
                    <div className="rounded-lg shadow-sm p-4 bg-white/70">
                        <p className="font-medium text-sm mb-2">Retención Neta</p>
                        <AnalyticsRetentionBarChart retentionData={data.retention} metric="percentFromPrevious" title="Retención Neta (respecto al capítulo previo)" />
                    </div>
                </div>
            </div>

        </div>
    );
}