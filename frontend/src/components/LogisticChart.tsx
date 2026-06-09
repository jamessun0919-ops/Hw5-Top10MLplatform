'use client';

import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  Line, ResponsiveContainer, ComposedChart,
} from 'recharts';

interface DataPoint { x: number; y: number; }
interface SigmoidPoint { x: number; prob: number; }
interface Props {
  data: DataPoint[];
  sigmoid: SigmoidPoint[];
  decisionBoundary: number;
  accuracy: number;
}

export default function LogisticChart({ data, sigmoid, decisionBoundary, accuracy }: Props) {
  const sigmoidData = sigmoid.map((d) => ({ x: d.x, prob: d.prob }));
  const positive = data.filter((d) => d.y === 1);
  const negative = data.filter((d) => d.y === 0);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-cyan uppercase tracking-wider">Sigmoid 曲線</h3>
        <div className="text-xs text-secondary space-x-3">
          <span>決策邊界: <span className="text-amber">{decisionBoundary.toFixed(3)}</span></span>
          <span>準確率: <span className="text-emerald">{(accuracy * 100).toFixed(1)}%</span></span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="x" stroke="#94a3b8" fontSize={12} label={{ value: 'X', position: 'bottom', fill: '#94a3b8', fontSize: 12 }} />
          <YAxis stroke="#94a3b8" fontSize={12} label={{ value: 'P(y=1)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }} domain={[0, 1]} />
          <Tooltip
            contentStyle={{ background: 'rgba(17,22,56,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Scatter name="正類 (y=1)" data={positive.map((d) => ({ x: d.x, y: d.y }))} fill="#10b981" opacity={0.7} />
          <Scatter name="負類 (y=0)" data={negative.map((d) => ({ x: d.x, y: d.y }))} fill="#ef4444" opacity={0.7} />
          <Line name="Sigmoid 曲線" data={sigmoidData} type="monotone" dataKey="prob" stroke="#7c3aed" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
