const API_BASE = 'http://localhost:8000/api';

async function post(endpoint: string, params: Record<string, unknown>): Promise<Record<string, unknown>> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`API error: ${res.statusText}`);
  return res.json();
}

async function get<T = Record<string, unknown>>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) throw new Error(`API error: ${res.statusText}`);
  return res.json();
}

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: string;
}

export interface AlgorithmList {
  algorithms: AlgorithmMeta[];
}

export const api = {
  listAlgorithms: () => get<AlgorithmList>('/algorithms'),
  linearRegression: (p: { slope: number; intercept: number; noise: number; n_points: number }) =>
    post('/linear-regression/generate', p),
  logisticRegression: (p: { c: number; n_points: number }) =>
    post('/logistic-regression/generate', p),
  decisionTree: (p: { max_depth: number; min_samples_split: number; n_points: number }) =>
    post('/decision-tree/generate', p),
  randomForest: (p: { n_estimators: number; max_depth: number; n_points: number }) =>
    post('/random-forest/generate', p),
  svm: (p: { c: number; kernel: string; gamma: string; n_points: number }) =>
    post('/svm/generate', p),
  knn: (p: { k: number; n_points: number }) =>
    post('/knn/generate', p),
  kmeans: (p: { k: number; n_points: number; cluster_std: number }) =>
    post('/kmeans/generate', p),
  pca: (p: { n_components: number; n_points: number; n_features_original: number }) =>
    post('/pca/generate', p),
  gradientBoosting: (p: { learning_rate: number; n_estimators: number; max_depth: number; n_points: number }) =>
    post('/gradient-boosting/generate', p),
  neuralNetwork: (p: { hidden_layers: number; hidden_neurons: number; learning_rate_init: number; max_iter: number; n_points: number }) =>
    post('/neural-network/generate', p),
};
