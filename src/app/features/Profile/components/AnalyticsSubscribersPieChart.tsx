import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import type { WorkDTO } from '../../../../domain/dto/WorkDTO';

interface Props {
  authorTotal: number;
  perWork: Record<number, number>;
  works: WorkDTO[];
}

const COLORS = [
  '#6366f1', // author
  '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#0ea5e9', '#14b8a6', '#dc2626', '#84cc16', '#d946ef'
];

export function AnalyticsSubscribersPieChart({ authorTotal, perWork, works }: Props) {
  const workData = works.map(w => ({ name: w.title, value: perWork[w.id] || 0 }))
    .filter(d => d.value > 0);
  const chartData = [
    { name: 'Autor', value: authorTotal },
    ...workData
  ];

  if (!authorTotal && workData.length === 0) {
    return <div className="p-4 border rounded text-sm text-gray-500">No hay suscripciones registradas.</div>;
  }

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={0}
            label={({ name, value }) => `${name}: ${value}`}
            labelLine={false}
          >
            {chartData.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(val, name) => [`${val}`, name as string]} />
          <Legend 
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-500">Nota: Puede existir superposición entre suscriptores del autor y de obras.</p>
    </div>
  );
}
