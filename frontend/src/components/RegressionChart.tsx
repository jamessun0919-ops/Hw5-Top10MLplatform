'use client';

import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  Line, ResponsiveContainer, ComposedChart, ZAxis,
} from 'recharts';

interface Point { x: number; y: number; }
interface Props {
  data: Point[];
  line?: Point[];
  equation?: string;
  rSquared?: number;
  xLabel?: string;
  yLabel?: string;
}

export default function RegressionChart({ data, line, equation, rSquared, xLabel, yLabel }: Props) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-cyan uppercase tracking-wider">資料分布</h3>
        {(equation || rSquared !== undefined) && (
          <div className="text-xs text-secondary space-x-3">
            {equation && <span>方程式: <span className="text-cyan">{equation}</span></span>}
            {rSquared !== undefined && <span>R²: <span className="text-emerald">{rSquared.toFixed(4)}</span></span>}
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="x" label={xLabel ? { value: xLabel, position: 'bottom', fill: '#94a3b8', fontSize: 12 } : undefined} stroke="#94a3b8" fontSize={12} />
          <YAxis label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 } : undefined} stroke="#94a3b8" fontSize={12} />
          <Tooltip
            contentStyle={{ background: 'rgba(17,22,56,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
            labelStyle={{ color: '#f1f5f9' }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Scatter name="資料點" data={data} fill="#00f0ff" opacity={0.7} />
          {line && (
            <Line name="回歸線" data={line} type="monotone" dataKey="y" stroke="#7c3aed" strokeWidth={2} dot={false} />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
