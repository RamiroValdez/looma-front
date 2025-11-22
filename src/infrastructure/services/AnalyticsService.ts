import { useState, useEffect } from "react";
import { useAuthStore } from "../store/AuthStore";
import { apiClient } from "../api/apiClient";

export interface AnalyticsSavedWorkDto {
    savedId: number;
    userId: number;
    workId: number;
    savedAt: Date;
}

export interface AnalyticsSuscribersPerWorkDto {
    userId: number;
    workId: number;
    suscribedAt: Date;
}

export interface AnalyticsReadingChapterDto {
    id: number;
    chapterId: number;
    readAt: Date;
    userId: number;
    workId: number;
}

export interface AnalyticsRetentionDto {
    chapter: number;
    totalReaders: number;
    percentFromFirst: number;
    percentFromPrevious: number;
}

export interface AnalyticsLikeChapterDto {
    likeId: number;
    chapterId: number;
    userId: number;
    likedAt: Date;
}

interface AnalyticsData {
    savedWorks: AnalyticsSavedWorkDto[];
    subscribers: AnalyticsSuscribersPerWorkDto[];
    readings: AnalyticsReadingChapterDto[];
    likes: AnalyticsLikeChapterDto[];
    retention: AnalyticsRetentionDto[];
    totalSuscribers: number;
    totalSuscribersAuthor: number;
    totalSuscribersWorks: number;
}

export const useAnalytics = (workId: number, chapterId: number, authorId: number) => {
    const { token } = useAuthStore();

    const [data, setData] = useState<AnalyticsData>({
        savedWorks: [],
        subscribers: [],
        readings: [],
        likes: [],
        retention: [],
        totalSuscribers: 0,
        totalSuscribersAuthor: 0,
        totalSuscribersWorks: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = async () => {
        if (!workId || !authorId) return; // sanity guard
        setLoading(true);
        setError(null);

        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
            const headers = {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            const [
                savedWorksResponse,
                subscribersResponse,
                readingsResponse,
                likesResponse,
                retentionResponse,
                totalSuscribersResponse,
                totalSuscribersPerAuthorResponse,
                totalSuscribersPerWorkResponse,
            ] = await Promise.all([
                apiClient.request<AnalyticsSavedWorkDto[]>({
                    url: `${baseUrl}${import.meta.env.VITE_API_ANALYTICS_URL}/savesPerWork/${workId}`,
                    method: 'GET',
                    headers,
                }).catch(() => ({ data: [] })),
                apiClient.request<AnalyticsSuscribersPerWorkDto[]>({
                    url: `${baseUrl}${import.meta.env.VITE_API_ANALYTICS_URL}/listSuscribersPerWork/${workId}`,
                    method: 'GET',
                    headers,
                }).catch(() => ({ data: [] })),
                apiClient.request<AnalyticsReadingChapterDto[]>({
                    url: `${baseUrl}${import.meta.env.VITE_API_ANALYTICS_URL}/readingPerChapter/${chapterId}`,
                    method: 'GET',
                    headers,
                }).catch(() => ({ data: [] })),
                apiClient.request<AnalyticsLikeChapterDto[]>({
                    url: `${baseUrl}${import.meta.env.VITE_API_ANALYTICS_URL}/likesPerChapter/${chapterId}`,
                    method: 'GET',
                    headers,
                }).catch(() => ({ data: [] })),
                apiClient.request<AnalyticsRetentionDto[]>({
                    url: `${baseUrl}${import.meta.env.VITE_API_ANALYTICS_URL}/readerRetention/${workId}`,
                    method: 'GET',
                    headers,
                }).catch(() => ({ data: [] })),
                apiClient.request<number>({
                    url: `${baseUrl}${import.meta.env.VITE_API_ANALYTICS_URL}/totalSuscribers/${authorId}`,
                    method: 'GET',
                    headers,
                }).catch(() => ({ data: 0 })),
                apiClient.request<number>({
                    url: `${baseUrl}${import.meta.env.VITE_API_ANALYTICS_URL}/totalSuscribersPerAuthor/${authorId}`,
                    method: 'GET',
                    headers,
                }).catch(() => ({ data: 0 })),
                apiClient.request<number>({
                    url: `${baseUrl}${import.meta.env.VITE_API_ANALYTICS_URL}/totalSuscribersPerWork/${workId}`,
                    method: 'GET',
                    headers,
                }).catch(() => ({ data: 0 })),
            ]);

            const savedWorks = savedWorksResponse.data || [];
            const subscribers = subscribersResponse.data || [];
            const readings = readingsResponse.data || [];
            const likes = likesResponse.data || [];
            const retention = retentionResponse.data || [];
            const totalSuscribers = totalSuscribersResponse.data || 0;
            const totalSuscribersPerAuthor = totalSuscribersPerAuthorResponse.data || 0;
            const totalSuscribersPerWork = totalSuscribersPerWorkResponse.data || 0;

            setData({
                savedWorks,
                subscribers,
                readings,
                likes,
                retention,
                totalSuscribers,
                totalSuscribersAuthor: totalSuscribersPerAuthor,
                totalSuscribersWorks: totalSuscribersPerWork
            });

        } catch (err: any) {
            console.error('Error fetching analytics:', err);
            setError(err?.message || 'Error al cargar las estadísticas');
        } finally {
            setLoading(false);
        }
    };

    const refetch = () => {
        fetchAll();
    };

    useEffect(() => {
        if (workId && token) {
            fetchAll();
        }
    }, [workId, authorId, chapterId, token]);

    return {
        data,
        loading,
        error,
        refetch,
    };
};
