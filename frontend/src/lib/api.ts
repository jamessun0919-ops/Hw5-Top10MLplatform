const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, '');
const API_BASE = configuredApiUrl
  ? `${configuredApiUrl.replace(/\/api$/, '')}/api`
  : process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/api'
    : null;

async function request<T>(endpoint: string, init?: RequestInit): Promise<T> {
  if (!API_BASE) {
    throw new Error('尚未設定 NEXT_PUBLIC_API_URL，請在 Vercel 填入 Render 後端網址後重新部署。');
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...init,
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      throw new Error(`API request failed (${res.status})`);
    }

    return res.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new Error('後端回應逾時，請稍後重試或確認 Render 服務是否已啟動。');
    }
    throw error;
  }
}

async function post(endpoint: string, params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return request(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
}

async function get<T = Record<string, unknown>>(endpoint: string): Promise<T> {
  return request<T>(endpoint);
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
