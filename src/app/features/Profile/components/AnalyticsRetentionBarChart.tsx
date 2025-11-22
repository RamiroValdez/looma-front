import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import type { AnalyticsRetentionDto } from '../../../../infrastructure/services/AnalyticsService';
import { useMemo } from 'react';

interface Props {
  retentionData: AnalyticsRetentionDto[];
  metric: 'percentFromFirst' | 'percentFromPrevious';
  title: string;
}

export function AnalyticsRetentionBarChart({ retentionData, metric, title }: Props) {
    const data = useMemo(() => {
        if (!retentionData || !retentionData.length) return [];
        const ordenados = [...retentionData].sort((a, b) => a.chapter - b.chapter);
        return ordenados.map((r, idx) => ({
            position: idx + 1,
            chapterId: r.chapter,
            value: r[metric],
            totalReaders: r.totalReaders,
        }));
    }, [retentionData, metric]);

    if (!data.length) {
        return <div className="p-4 border rounded text-sm text-gray-500">No hay datos de retención disponibles.</div>;
    }

    return (
        <div className="space-y-2">
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="position" tickFormatter={(v) => `Cap ${v}`} />
                    <YAxis tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                        formatter={(val) => [`${val}%`, 'Retención']}
                        labelFormatter={(pos) => {
                            const item = data.find(d => d.position === pos);
                            return `Capítulo ${pos}`;
                        }}
                    />
                    <Legend />
                    <Bar
                        dataKey="value"
                        name="Retención (%)"
                        fill={metric === 'percentFromFirst' ? '#6366f1' : '#10b981'}
                        radius={[4,4,0,0]}
                    >
                        <LabelList dataKey="value" position="top" className="text-xs" formatter={(v: number) => `${v}%`} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500">
                Lectores totales considerados: {retentionData[0]?.totalReaders ?? 'N/A'}
            </p>
        </div>
    );
}
