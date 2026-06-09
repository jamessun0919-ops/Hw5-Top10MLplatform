'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface Props {
  data: { k?: number; name?: string; value: number }[];
  xKey?: string;
  yLabel?: string;
  color?: string;
}

export default function BarChartComponent({ data, xKey = 'k', yLabel = 'Value', color = '#00f0ff' }: Props) {
  const chartData = data.map((d) => ({ ...d, key: d.k ?? d.name ?? '' }));
  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-semibold text-cyan uppercase tracking-wider mb-3">{yLabel}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="key" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ background: 'rgba(17,22,56,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
          />
          <Bar dataKey="value" fill={color} opacity={0.8} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
