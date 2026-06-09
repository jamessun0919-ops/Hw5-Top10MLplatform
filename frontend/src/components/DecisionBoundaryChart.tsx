'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface DataPoint { x1: number; x2: number; label: number; cluster?: number; }
interface Props {
  data: DataPoint[];
  boundary?: { x1: number[][]; x2: number[][]; z: number[][] };
  supportVectors?: { x1: number; x2: number }[];
  accuracy?: number;
  showBoundary?: boolean;
  xLabel?: string;
  yLabel?: string;
  colors?: string[];
}

const DEFAULT_COLORS = ['#00f0ff', '#7c3aed', '#f59e0b', '#10b981', '#ec4899', '#ef4444', '#06b6d4', '#8b5cf6'];

export default function DecisionBoundaryChart({
  data, boundary, supportVectors, accuracy, showBoundary = true, xLabel, yLabel, colors: customColors,
}: Props) {
  const colors = customColors || DEFAULT_COLORS;
  const uniqueLabels = [...new Set(data.map((d) => d.label ?? d.cluster ?? 0))];

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-cyan uppercase tracking-wider">決策邊界</h3>
        {accuracy !== undefined && (
          <span className="text-xs text-secondary">
            準確率: <span className="text-emerald">{(accuracy * 100).toFixed(1)}%</span>
          </span>
        )}
      </div>
      <div className="relative">
        {showBoundary && boundary && (
          <svg
            viewBox={`0 0 ${boundary.x1[0]?.length || 50} ${boundary.x1.length || 50}`}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.3 }}
          >
            {boundary.z.map((row, i) =>
              row.map((val, j) => {
                const x1Min = Math.min(...boundary.x1[0]);
                const x1Max = Math.max(...boundary.x1[0]);
                const x2Min = Math.min(...boundary.x1.map((r) => Math.min(...r)));
                const x2Max = Math.max(...boundary.x1.map((r) => Math.max(...r)));
                return (
                  <rect
                    key={`${i}-${j}`}
                    x={j}
                    y={i}
                    width={1}
                    height={1}
                    fill={colors[val % colors.length] || '#333'}
                    opacity={0.25}
                  />
                );
              })
            )}
          </svg>
        )}
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
                data={data.filter((d) => (d.label ?? d.cluster ?? 0) === label)}
                fill={colors[label % colors.length]}
                opacity={0.8}
              />
            ))}
            {supportVectors && (
              <Scatter name="支援向量" data={supportVectors} fill="#f59e0b" stroke="#f59e0b" strokeWidth={2} opacity={1}
                shape={(p: { cx?: number; cy?: number }) => (
                  <circle cx={p.cx ?? 0} cy={p.cy ?? 0} r={6} fill="none" stroke="#f59e0b" strokeWidth={2} />
                )}
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
