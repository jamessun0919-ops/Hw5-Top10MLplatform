'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint { x1: number; x2: number; label: number; }
interface Props {
  data: DataPoint[];
  xLabel?: string;
  yLabel?: string;
  colors?: string[];
}

const DEFAULT_COLORS = ['#00f0ff', '#7c3aed', '#f59e0b'];

export default function SampleDistributionChart({ data, xLabel, yLabel, colors: customColors }: Props) {
  const colors = customColors || DEFAULT_COLORS;
  const uniqueLabels = [...new Set(data.map((d) => d.label ?? 0))];

  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-semibold text-cyan uppercase tracking-wider mb-3">2D 特徵平面樣本分布</h3>
      <ResponsiveContainer width="100%" height={340}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="x1" stroke="#94a3b8" fontSize={12}
            label={xLabel ? { value: xLabel, position: 'bottom', fill: '#94a3b8', fontSize: 12 } : undefined} />
          <YAxis dataKey="x2" stroke="#94a3b8" fontSize={12}
            label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 } : undefined} />
          <Tooltip
            contentStyle={{ background: 'rgba(17,22,56,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {uniqueLabels.map((label) => (
            <Scatter
              key={label}
              name={`類別 ${label}`}
              data={data.filter((d) => d.label === label)}
              fill={colors[label % colors.length]}
              opacity={0.8}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
