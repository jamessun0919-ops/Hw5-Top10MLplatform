'use client';

import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface Props {
  curves: Record<string, unknown>[];
  visibleAlgos: string[];
}

export const ALGORITHMS = [
  { id: 'pearson', name: '皮爾森相關 (Pearson)', color: '#38bdf8' },
  { id: 'f_regression', name: 'F-檢定 (F-Regression)', color: '#34d399' },
  { id: 'mutual_info', name: '互資訊法 (Mutual Info)', color: '#a78bfa' },
  { id: 'rfe', name: '遞迴特徵消除 (RFE)', color: '#fb7185' },
  { id: 'lasso', name: 'Lasso L1 正則化', color: '#fb923c' },
  { id: 'ridge', name: 'Ridge L2 正則化', color: '#facc15' },
  { id: 'random_forest', name: '隨機森林 (Random Forest)', color: '#4ade80' },
  { id: 'extra_trees', name: '極端隨機樹 (Extra Trees)', color: '#2dd4bf' },
  { id: 'gradient_boosting', name: '梯度提升樹 (GBDT)', color: '#ec4899' },
  { id: 'sfs', name: '順序前向選擇 (SFS)', color: '#6366f1' },
];

export default function MultipleRegressionChart({ curves, visibleAlgos }: Props) {
  if (!curves || curves.length === 0) return null;

  // Calculate sweet point (k) for each algorithm using Knee Point (Kneedle) logic on R-squared curves
  const sweetPoints = useMemo(() => {
    const points: Record<string, number> = {};
    if (!curves || curves.length === 0) return points;
    
    const N = curves.length;
    if (N <= 2) {
      ALGORITHMS.forEach(alg => {
        points[alg.id] = N;
      });
      return points;
    }
    
    ALGORITHMS.forEach(alg => {
      const r2Values = curves.map(c => (c[`${alg.id}_r2`] as number) ?? 0);
      const minR2 = Math.min(...r2Values);
      const maxR2 = Math.max(...r2Values);
      
      let bestK = N;
      if (maxR2 - minR2 < 1e-6) {
        bestK = 1;
      } else {
        let maxD = -Infinity;
        for (let i = 0; i < N; i++) {
          const xNorm = i / (N - 1);
          const yNorm = (r2Values[i] - minR2) / (maxR2 - minR2);
          const d = yNorm - xNorm;
          if (d > maxD) {
            maxD = d;
            bestK = (curves[i].k as number) ?? (i + 1);
          }
        }
      }
      points[alg.id] = bestK;
    });
    
    return points;
  }, [curves]);

  return (
    <div className="space-y-4">
      <div className="glass-card p-3.5 flex items-center gap-2.5 text-xs text-slate-300">
        <span className="text-[#facc15] text-base animate-pulse">💡</span>
        <span>
          圖表中的 <strong className="text-[#facc15] font-semibold">金色雙環點 (🟡)</strong> 表示該演算法的<strong>甜蜜點 (Sweet Point)</strong>，即在特徵選擇中「以最少特徵數量達到性價比最佳模型表現」的轉折點 (Knee Point)。
        </span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* R-squared Chart */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-cyan uppercase tracking-wider mb-3">特徵數量 vs R-squared (越接近 1 越佳)</h3>
        <ResponsiveContainer width="100%" height={480}>
          <LineChart data={curves} margin={{ top: 10, right: 20, bottom: 15, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" dataKey="k" domain={[1, 'dataMax']} ticks={curves.map((d) => d.k as number)} allowDecimals={false} stroke="#94a3b8" fontSize={12} label={{ value: '使用特徵數', position: 'bottom', fill: '#94a3b8', fontSize: 12, offset: 0 }} />
            <YAxis type="number" domain={[0, 1.05]} stroke="#94a3b8" fontSize={12} label={{ value: 'R-squared', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: 'rgba(17,22,56,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
              labelFormatter={(value) => `特徵數: ${value}`}
            />
            {ALGORITHMS.map((alg) => {
              const sweetK = sweetPoints[alg.id] ?? 1;
              return (
                <Line
                  key={alg.id}
                  hide={!visibleAlgos.includes(alg.id)}
                  name={alg.name}
                  type="monotone"
                  dataKey={`${alg.id}_r2`}
                  stroke={alg.color}
                  strokeWidth={2}
                  dot={(dotProps: any) => {
                    const { cx, cy, payload } = dotProps;
                    const isSweet = payload.k === sweetK;
                    if (isSweet) {
                      return (
                        <g key={`sweet-r2-${alg.id}-${payload.k}`}>
                          <circle cx={cx} cy={cy} r={6} fill="none" stroke="#facc15" strokeWidth={2.5} />
                          <circle cx={cx} cy={cy} r={2.5} fill="#facc15" />
                        </g>
                      );
                    }
                    return <circle cx={cx} cy={cy} r={2.5} fill={alg.color} stroke="none" key={`dot-r2-${alg.id}-${payload.k}`} />;
                  }}
                  activeDot={{ r: 5 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* MSE Chart */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-cyan uppercase tracking-wider mb-3">特徵數量 vs MSE (越低越佳)</h3>
        <ResponsiveContainer width="100%" height={480}>
          <LineChart data={curves} margin={{ top: 10, right: 20, bottom: 15, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" dataKey="k" domain={[1, 'dataMax']} ticks={curves.map((d) => d.k as number)} allowDecimals={false} stroke="#94a3b8" fontSize={12} label={{ value: '使用特徵數', position: 'bottom', fill: '#94a3b8', fontSize: 12, offset: 0 }} />
            <YAxis type="number" stroke="#94a3b8" fontSize={12} label={{ value: 'MSE', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: 'rgba(17,22,56,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
              labelFormatter={(value) => `特徵數: ${value}`}
            />
            {ALGORITHMS.map((alg) => {
              const sweetK = sweetPoints[alg.id] ?? 1;
              return (
                <Line
                  key={alg.id}
                  hide={!visibleAlgos.includes(alg.id)}
                  name={alg.name}
                  type="monotone"
                  dataKey={`${alg.id}_mse`}
                  stroke={alg.color}
                  strokeWidth={2}
                  dot={(dotProps: any) => {
                    const { cx, cy, payload } = dotProps;
                    const isSweet = payload.k === sweetK;
                    if (isSweet) {
                      return (
                        <g key={`sweet-mse-${alg.id}-${payload.k}`}>
                          <circle cx={cx} cy={cy} r={6} fill="none" stroke="#facc15" strokeWidth={2.5} />
                          <circle cx={cx} cy={cy} r={2.5} fill="#facc15" />
                        </g>
                      );
                    }
                    return <circle cx={cx} cy={cy} r={2.5} fill={alg.color} stroke="none" key={`dot-mse-${alg.id}-${payload.k}`} />;
                  }}
                  activeDot={{ r: 5 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    </div>
  );
}
