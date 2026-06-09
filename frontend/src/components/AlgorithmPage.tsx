'use client';

import { useState, useEffect, useCallback } from 'react';
import InfoPanel from './InfoPanel';
import ParameterPanel from './ParameterPanel';
import RegressionChart from './RegressionChart';
import LogisticChart from './LogisticChart';
import DecisionBoundaryChart from './DecisionBoundaryChart';
import CurveChart from './CurveChart';
import PCAChart from './PCAChart';
import BarChartComponent from './BarChartComponent';

interface AlgorithmConfig {
  id: string;
  name: string;
  defaultParams: Record<string, unknown>;
  paramDefs: { key: string; label: string; type: 'number' | 'select' | 'range'; min?: number; max?: number; step?: number; options?: { value: string | number; label: string }[]; default: number | string }[];
  fetchData: (params: Record<string, unknown>) => Promise<Record<string, unknown>>;
}

export default function AlgorithmPage({ config }: { config: AlgorithmConfig }) {
  const [params, setParams] = useState(config.defaultParams);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await config.fetchData(params);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成失敗');
    } finally {
      setLoading(false);
    }
  }, [config, params]);

  useEffect(() => {
    generate();
  }, []);

  const handleParamChange = (key: string, value: unknown) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const renderChart = () => {
    if (!result) return null;

    switch (config.id) {
      case 'linear-regression': {
        const r = result as { data: { x: number; y: number }[]; regression_line: { x: number; y: number }[]; equation: string; r_squared: number };
        return (
          <RegressionChart
            data={r.data}
            line={r.regression_line}
            equation={r.equation}
            rSquared={r.r_squared}
            xLabel="X"
            yLabel="Y"
          />
        );
      }
      case 'logistic-regression': {
        const r = result as { data: { x: number; y: number }[]; sigmoid: { x: number; prob: number }[]; decision_boundary: number; accuracy: number };
        return <LogisticChart data={r.data} sigmoid={r.sigmoid} decisionBoundary={r.decision_boundary} accuracy={r.accuracy} />;
      }
      case 'decision-tree':
      case 'random-forest':
      case 'svm':
      case 'knn':
      case 'gradient-boosting':
      case 'neural-network': {
        const r = result as { data: { x1: number; x2: number; label: number }[]; decision_boundary: { x1: number[][]; x2: number[][]; z: number[][] }; accuracy: number; support_vectors?: { x1: number; x2: number }[] };
        return (
          <>
            <DecisionBoundaryChart
              data={r.data}
              boundary={r.decision_boundary}
              supportVectors={r.support_vectors}
              accuracy={r.accuracy}
              xLabel="特徵 1"
              yLabel="特徵 2"
            />
            {config.id === 'neural-network' && (result as { loss_curve: { step: number; loss: number }[] }).loss_curve && (
              <CurveChart
                data={(result as { loss_curve: { step: number; loss: number }[] }).loss_curve}
                xLabel="迭代次數"
                yLabel="Loss"
                lineName="損失"
                color="#7c3aed"
              />
            )}
            {config.id === 'gradient-boosting' && (result as { learning_curve: { step: number; accuracy: number }[] }).learning_curve && (
              <CurveChart
                data={(result as { learning_curve: { step: number; accuracy: number }[] }).learning_curve}
                xLabel="估計器數量"
                yLabel="accuracy"
                lineName="準確率"
                color="#f59e0b"
              />
            )}
            {config.id === 'random-forest' && (result as { feature_importance: number[] }).feature_importance && (
              <BarChartComponent
                data={(result as { feature_importance: number[] }).feature_importance.map((v, i) => ({ name: `特徵 ${i + 1}`, value: v }))}
                xKey="name"
                yLabel="特徵重要性"
                color="#10b981"
              />
            )}
          </>
        );
      }
      case 'kmeans': {
        const r = result as { data: { x1: number; x2: number; cluster: number }[]; centers: { x1: number; x2: number }[]; elbow_data: { k: number[]; inertia: number[] }; inertia: number };
        return (
          <>
            <DecisionBoundaryChart
              data={r.data.map((d) => ({ ...d, label: d.cluster }))}
              showBoundary={false}
              xLabel="特徵 1"
              yLabel="特徵 2"
            />
            {r.elbow_data && (
              <CurveChart
                data={r.elbow_data.k.map((k, i) => ({ step: k, accuracy: r.elbow_data.inertia[i] }))}
                xLabel="K 值"
                yLabel="accuracy"
                lineName="WCSS"
                color="#f59e0b"
              />
            )}
          </>
        );
      }
      case 'pca': {
        const r = result as { pca_data: { x1: number; x2: number }[]; explained_variance: number[]; cumulative_variance: number };
        return <PCAChart pcaData={r.pca_data} explainedVariance={r.explained_variance} cumulativeVariance={r.cumulative_variance} />;
      }
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-72 space-y-4">
        <ParameterPanel
          params={config.paramDefs}
          values={params}
          onChange={handleParamChange}
          onGenerate={generate}
          loading={loading}
        />
        <InfoPanel info={(result?.info as Record<string, string> | null) ?? null} />
      </div>
      <div className="flex-1 space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
            {error}
          </div>
        )}
        {loading ? (
          <div className="glass-card p-12 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-secondary">正在生成資料...</span>
            </div>
          </div>
        ) : (
          renderChart()
        )}
      </div>
    </div>
  );
}
