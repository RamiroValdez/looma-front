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

import type {
    AnalyticsSavedWorkDto,
    AnalyticsSuscribersPerWorkDto
} from '../../../../infrastructure/services/AnalyticsService';
import {useMemo} from "react";

const procesarDatosParaGrafico = (
    saves: AnalyticsSavedWorkDto[],
    subs: AnalyticsSuscribersPerWorkDto[]
) => {
    const mapaTimeline = new Map();

    const initDay = (dateKey) => {
        if (!mapaTimeline.has(dateKey)) {
            mapaTimeline.set(dateKey, { fecha: dateKey, guardados: 0, suscriptores: 0 });
        }
    };

    saves.forEach(item => {
        const dateKey = new Date(item.savedAt).toISOString().split('T')[0];
        initDay(dateKey);

        const entry = mapaTimeline.get(dateKey);
        entry.guardados += 1;
    });

    subs.forEach(item => {
        const dateKey = new Date(item.suscribedAt).toISOString().split('T')[0];
        initDay(dateKey);

        const entry = mapaTimeline.get(dateKey);
        entry.suscriptores += 1;
    });

    return Array.from(mapaTimeline.values())
        .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
};

export function AnalyticsLineChart({ savesData, subsData }: { savesData: AnalyticsSavedWorkDto[], subsData: AnalyticsSuscribersPerWorkDto[] }) {

    const chartData = useMemo(() => {
        return procesarDatosParaGrafico(savesData, subsData);
    }, [savesData, subsData]);

    if (!chartData.length) {
        return <div className="p-4 border rounded text-sm text-gray-500">No hay datos de retención disponibles.</div>;
    }

    return (
        <div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={chartData}
                >
                    <XAxis
                        dataKey="fecha"
                        tickFormatter={(str) => new Date(str).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="guardados"
                        name="Obras Guardadas"
                        stroke="#8884d8"
                    />
                    <Line
                        type="monotone"
                        dataKey="suscriptores"
                        name="Nuevos Suscriptores"
                        stroke="#82ca9d"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}