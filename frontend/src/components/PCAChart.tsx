'use client';

import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  pcaData: { x1: number; x2: number }[];
  explainedVariance: number[];
  cumulativeVariance: number;
}

export default function PCAChart({ pcaData, explainedVariance, cumulativeVariance }: Props) {
  const varianceData = explainedVariance.map((v, i) => ({ component: `PC${i + 1}`, variance: v }));

  return (
    <div className="space-y-4">
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-cyan uppercase tracking-wider mb-3">PCA 投影 (2D)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="x1" stroke="#94a3b8" fontSize={12} label={{ value: '第一主成分', position: 'bottom', fill: '#94a3b8', fontSize: 12 }} />
            <YAxis dataKey="x2" stroke="#94a3b8" fontSize={12} label={{ value: '第二主成分', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: 'rgba(17,22,56,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
            />
            <Scatter name="投影點" data={pcaData} fill="#00f0ff" opacity={0.7} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-cyan uppercase tracking-wider">解釋變異量</h3>
          <span className="text-xs text-secondary">
            累積: <span className="text-emerald">{(cumulativeVariance * 100).toFixed(1)}%</span>
          </span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={varianceData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="component" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 1]} tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`} />
            <Tooltip
              contentStyle={{ background: 'rgba(17,22,56,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
              formatter={(v: unknown) => `${(Number(v) * 100).toFixed(1)}%`}
            />
            <Bar dataKey="variance" fill="#00f0ff" opacity={0.8} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
