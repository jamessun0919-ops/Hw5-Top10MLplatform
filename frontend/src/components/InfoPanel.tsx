'use client';

interface InfoData {
  '適用情境': string;
  '優點': string;
  '缺點': string;
  '數學原理': string;
}

export default function InfoPanel({ info }: { info: Record<string, string> | null }) {
  if (!info) return null;

  const items = [
    { label: '🎯 適用情境', value: info['適用情境'], color: 'border-l-cyan' },
    { label: '✅ 優點', value: info['優點'], color: 'border-l-emerald' },
    { label: '⚠️ 缺點', value: info['缺點'], color: 'border-l-amber' },
    { label: '📐 數學原理', value: info['數學原理'], color: 'border-l-purple' },
  ];

  return (
    <div className="glass-card p-4 space-y-3">
      <h3 className="text-sm font-semibold text-cyan uppercase tracking-wider">演算法資訊</h3>
      {items.map((item) => (
        <div key={item.label} className={`border-l-2 border-l-cyan pl-3 py-1`}
          style={{ borderLeftColor: item.color.replace('border-l-', '') === 'cyan' ? '#00f0ff' : item.color.replace('border-l-', '') === 'emerald' ? '#10b981' : item.color.replace('border-l-', '') === 'amber' ? '#f59e0b' : '#7c3aed' }}>
          <div className="text-xs text-secondary mb-0.5">{item.label}</div>
          <div className="text-sm leading-relaxed">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
