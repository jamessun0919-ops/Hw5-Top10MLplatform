'use client';

import { ReactNode } from 'react';

interface Param {
  key: string;
  label: string;
  type: 'number' | 'select' | 'range';
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string | number; label: string }[];
  default: number | string;
}

export default function ParameterPanel({
  params,
  values,
  onChange,
  onGenerate,
  loading,
}: {
  params: Param[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  onGenerate: () => void;
  loading: boolean;
}) {
  return (
    <div className="glass-card p-4 space-y-3">
      <h3 className="text-sm font-semibold text-cyan uppercase tracking-wider">參數調整</h3>
      {params.map((p) => (
        <div key={p.key}>
          <label className="input-label block mb-1">{p.label}</label>
          {p.type === 'number' || p.type === 'range' ? (
            <div className="flex items-center gap-2">
              {p.type === 'range' && (
                <input
                  type="range"
                  min={p.min}
                  max={p.max}
                  step={p.step}
                  value={values[p.key] as number}
                  onChange={(e) => onChange(p.key, parseFloat(e.target.value))}
                  className="flex-1 accent-cyan"
                />
              )}
              <input
                type="number"
                min={p.min}
                max={p.max}
                step={p.step}
                value={values[p.key] as number}
                onChange={(e) => onChange(p.key, parseFloat(e.target.value))}
                className="input-field w-20 text-center"
              />
            </div>
          ) : (
            <select
              value={values[p.key] as string}
              onChange={(e) => onChange(p.key, e.target.value)}
              className="input-field"
            >
              {p.options?.map((o) => (
                <option key={String(o.value)} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
      <button
        onClick={onGenerate}
        disabled={loading}
        className="btn-gradient w-full py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? '生成中...' : '生成資料'}
      </button>
    </div>
  );
}
