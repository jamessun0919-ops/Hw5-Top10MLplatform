import { api } from './api';

export interface AlgorithmConfig {
  id: string;
  name: string;
  category: string;
  defaultParams: Record<string, unknown>;
  paramDefs: {
    key: string;
    label: string;
    type: 'number' | 'select' | 'range';
    min?: number;
    max?: number;
    step?: number;
    options?: { value: string | number; label: string }[];
    default: number | string;
  }[];
  fetchData: (params: Record<string, unknown>) => Promise<Record<string, unknown>>;
}

export const algorithmConfigs: AlgorithmConfig[] = [
  {
    id: 'linear-regression',
    name: '線性回歸',
    category: '監督式學習（回歸）',
    defaultParams: { slope: 2, intercept: 3, noise: 1, n_points: 50 },
    paramDefs: [
      { key: 'slope', label: '斜率', type: 'range', min: -5, max: 5, step: 0.1, default: 2 },
      { key: 'intercept', label: '截距', type: 'range', min: -10, max: 10, step: 0.5, default: 3 },
      { key: 'noise', label: '雜訊', type: 'range', min: 0, max: 5, step: 0.1, default: 1 },
      { key: 'n_points', label: '資料筆數', type: 'range', min: 10, max: 200, step: 10, default: 50 },
    ],
    fetchData: (p) => api.linearRegression(p as { slope: number; intercept: number; noise: number; n_points: number }),
  },
  {
    id: 'logistic-regression',
    name: '邏輯回歸',
    category: '監督式學習（分類）',
    defaultParams: { c: 1, n_points: 100 },
    paramDefs: [
      { key: 'c', label: '正則化強度 C', type: 'range', min: 0.01, max: 10, step: 0.1, default: 1 },
      { key: 'n_points', label: '資料筆數', type: 'range', min: 20, max: 200, step: 10, default: 100 },
    ],
    fetchData: (p) => api.logisticRegression(p as { c: number; n_points: number }),
  },
  {
    id: 'decision-tree',
    name: '決策樹',
    category: '監督式學習（分類/回歸）',
    defaultParams: { max_depth: 3, min_samples_split: 2, n_points: 100 },
    paramDefs: [
      { key: 'max_depth', label: '最大深度', type: 'range', min: 1, max: 10, step: 1, default: 3 },
      { key: 'min_samples_split', label: '最小分裂樣本', type: 'range', min: 2, max: 20, step: 1, default: 2 },
      { key: 'n_points', label: '資料筆數', type: 'range', min: 20, max: 200, step: 10, default: 100 },
    ],
    fetchData: (p) => api.decisionTree(p as { max_depth: number; min_samples_split: number; n_points: number }),
  },
  {
    id: 'random-forest',
    name: '隨機森林',
    category: '監督式學習（分類/回歸）',
    defaultParams: { n_estimators: 50, max_depth: 3, n_points: 100 },
    paramDefs: [
      { key: 'n_estimators', label: '樹的數量', type: 'range', min: 10, max: 200, step: 10, default: 50 },
      { key: 'max_depth', label: '最大深度', type: 'range', min: 1, max: 10, step: 1, default: 3 },
      { key: 'n_points', label: '資料筆數', type: 'range', min: 20, max: 200, step: 10, default: 100 },
    ],
    fetchData: (p) => api.randomForest(p as { n_estimators: number; max_depth: number; n_points: number }),
  },
  {
    id: 'svm',
    name: '支援向量機 SVM',
    category: '監督式學習（分類）',
    defaultParams: { c: 1, kernel: 'rbf', gamma: 'scale', n_points: 100 },
    paramDefs: [
      { key: 'c', label: '正則化 C', type: 'range', min: 0.1, max: 10, step: 0.1, default: 1 },
      {
        key: 'kernel', label: '核函數', type: 'select',
        options: [
          { value: 'linear', label: '線性 (Linear)' },
          { value: 'rbf', label: 'RBF' },
          { value: 'poly', label: '多項式 (Poly)' },
        ],
        default: 'rbf',
      },
      { key: 'n_points', label: '資料筆數', type: 'range', min: 20, max: 200, step: 10, default: 100 },
    ],
    fetchData: (p) => api.svm(p as { c: number; kernel: string; gamma: string; n_points: number }),
  },
  {
    id: 'knn',
    name: 'K-近鄰演算法',
    category: '監督式學習（分類/回歸）',
    defaultParams: { k: 5, n_points: 100 },
    paramDefs: [
      { key: 'k', label: 'K 值', type: 'range', min: 1, max: 30, step: 1, default: 5 },
      { key: 'n_points', label: '資料筆數', type: 'range', min: 20, max: 200, step: 10, default: 100 },
    ],
    fetchData: (p) => api.knn(p as { k: number; n_points: number }),
  },
  {
    id: 'kmeans',
    name: 'K-平均聚類',
    category: '非監督式學習（聚類）',
    defaultParams: { k: 3, n_points: 200, cluster_std: 1.5 },
    paramDefs: [
      { key: 'k', label: '群數 K', type: 'range', min: 2, max: 8, step: 1, default: 3 },
      { key: 'n_points', label: '資料筆數', type: 'range', min: 50, max: 500, step: 50, default: 200 },
      { key: 'cluster_std', label: '群體標準差', type: 'range', min: 0.5, max: 4, step: 0.1, default: 1.5 },
    ],
    fetchData: (p) => api.kmeans(p as { k: number; n_points: number; cluster_std: number }),
  },
  {
    id: 'pca',
    name: '主成分分析 PCA',
    category: '非監督式學習（降維）',
    defaultParams: { n_components: 2, n_points: 100, n_features_original: 5 },
    paramDefs: [
      { key: 'n_components', label: '主成分數量', type: 'range', min: 2, max: 5, step: 1, default: 2 },
      { key: 'n_points', label: '資料筆數', type: 'range', min: 30, max: 300, step: 10, default: 100 },
      { key: 'n_features_original', label: '原始特徵數', type: 'range', min: 3, max: 10, step: 1, default: 5 },
    ],
    fetchData: (p) => api.pca(p as { n_components: number; n_points: number; n_features_original: number }),
  },
  {
    id: 'gradient-boosting',
    name: '梯度提升',
    category: '監督式學習（分類/回歸）',
    defaultParams: { learning_rate: 0.1, n_estimators: 50, max_depth: 3, n_points: 100 },
    paramDefs: [
      { key: 'learning_rate', label: '學習率', type: 'range', min: 0.01, max: 1, step: 0.01, default: 0.1 },
      { key: 'n_estimators', label: '估計器數量', type: 'range', min: 10, max: 200, step: 10, default: 50 },
      { key: 'max_depth', label: '最大深度', type: 'range', min: 1, max: 8, step: 1, default: 3 },
      { key: 'n_points', label: '資料筆數', type: 'range', min: 20, max: 200, step: 10, default: 100 },
    ],
    fetchData: (p) => api.gradientBoosting(p as { learning_rate: number; n_estimators: number; max_depth: number; n_points: number }),
  },
  {
    id: 'neural-network',
    name: '神經網路',
    category: '監督式學習（分類/回歸）',
    defaultParams: { hidden_layers: 2, hidden_neurons: 10, learning_rate_init: 0.001, max_iter: 200, n_points: 100 },
    paramDefs: [
      { key: 'hidden_layers', label: '隱藏層數', type: 'range', min: 1, max: 5, step: 1, default: 2 },
      { key: 'hidden_neurons', label: '每層神經元', type: 'range', min: 4, max: 50, step: 2, default: 10 },
      { key: 'learning_rate_init', label: '初始學習率', type: 'number', min: 0.0001, max: 0.1, step: 0.0001, default: 0.001 },
      { key: 'max_iter', label: '最大迭代', type: 'range', min: 50, max: 500, step: 50, default: 200 },
      { key: 'n_points', label: '資料筆數', type: 'range', min: 20, max: 200, step: 10, default: 100 },
    ],
    fetchData: (p) => api.neuralNetwork(p as { hidden_layers: number; hidden_neurons: number; learning_rate_init: number; max_iter: number; n_points: number }),
  },
];
