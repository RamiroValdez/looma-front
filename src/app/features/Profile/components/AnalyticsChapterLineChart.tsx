import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { useMemo } from 'react';
import type { AnalyticsReadingChapterDto, AnalyticsLikeChapterDto } from '../../../../infrastructure/services/AnalyticsService';

interface Props {
    readingsData: AnalyticsReadingChapterDto[];
    likesData: AnalyticsLikeChapterDto[];
}

const procesarDatosCapitulo = (readings: AnalyticsReadingChapterDto[], likes: AnalyticsLikeChapterDto[]) => {
    const mapa = new Map<string, { fecha: string; lecturas: number; likes: number }>();

    const initDay = (key: string) => {
        if (!mapa.has(key)) {
            mapa.set(key, { fecha: key, lecturas: 0, likes: 0 });
        }
    };

    readings.forEach(r => {
        const dateKey = new Date(r.readAt as any).toISOString().split('T')[0];
        initDay(dateKey);
        const entry = mapa.get(dateKey)!;
        entry.lecturas += 1;
    });

    likes.forEach(l => {
        const dateKey = new Date(l.likedAt as any).toISOString().split('T')[0];
        initDay(dateKey);
        const entry = mapa.get(dateKey)!;
        entry.likes += 1;
    });

    return Array.from(mapa.values()).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
};

export function AnalyticsChapterLineChart({ readingsData, likesData }: Props) {
    const chartData = useMemo(() => procesarDatosCapitulo(readingsData, likesData), [readingsData, likesData]);

    if (!readingsData?.length && !likesData?.length) {
        return <div className="p-4 border rounded text-sm text-gray-500">No hay datos de lecturas o likes para este capítulo.</div>;
    }

    return (
        <div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip labelFormatter={(str) => new Date(str).toLocaleDateString()} />
                    <Legend />
                    <Line type="monotone" dataKey="lecturas" name="Lecturas" stroke="#2563eb" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="likes" name="Likes" stroke="#dc2626" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

