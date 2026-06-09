'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface Props {
  data: { step: number; [key: string]: unknown }[];
  xLabel?: string;
  yLabel?: string;
  lineName?: string;
  color?: string;
}

export default function CurveChart({ data, xLabel = 'Step', yLabel = 'Value', lineName = 'Curve', color = '#00f0ff' }: Props) {
  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-semibold text-cyan uppercase tracking-wider mb-3">學習曲線</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="step" stroke="#94a3b8" fontSize={12} label={{ value: xLabel, position: 'bottom', fill: '#94a3b8', fontSize: 12 }} />
          <YAxis stroke="#94a3b8" fontSize={12} label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ background: 'rgba(17,22,56,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line name={lineName} type="monotone" dataKey={yLabel === 'Loss' ? 'loss' : 'accuracy'} stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
