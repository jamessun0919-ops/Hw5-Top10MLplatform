'use client';

import { useState } from 'react';
import { algorithmConfigs } from '@/lib/algorithmConfigs';
import AlgorithmPage from '@/components/AlgorithmPage';

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const config = algorithmConfigs[activeTab];

  return (
    <div className="flex flex-col min-h-screen bg-grid">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0e27]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-purple flex items-center justify-center text-sm font-bold text-white">
              ML
            </div>
            <div>
              <h1 className="text-lg font-bold text-gradient">TOP10ML</h1>
              <p className="text-[10px] text-secondary -mt-0.5">機器學習十大演算法</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-secondary">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
            Backend Connected
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="border-b border-white/5 bg-[#0a0e27]/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2 scrollbar-none">
            {algorithmConfigs.map((algo, idx) => (
              <button
                key={algo.id}
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  idx === activeTab ? 'tab-active' : 'tab-inactive'
                }`}
              >
                {algo.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">{config.name}</h2>
          <p className="text-xs text-secondary mt-0.5">{config.category}</p>
        </div>
        <AlgorithmPage key={config.id} config={config} />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-secondary">
          TOP10ML — 機器學習十大演算法互動學習平台
        </div>
      </footer>
    </div>
  );
}
