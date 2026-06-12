# 🧠 TOP10ML — 機器學習十大演算法互動學習平台

<a href="https://hw5-top10-m-lplatform.vercel.app" target="_blank">![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-00f0ff?style=for-the-badge&logo=vercel&logoColor=white)</a>
<a href="https://github.com/jamessun0919-ops/Hw5-Top10MLplatform" target="_blank">![GitHub](https://img.shields.io/badge/GitHub-Repo-7c3aed?style=for-the-badge&logo=github&logoColor=white)</a>

---

## 📊 專案資訊圖

![TOP10ML Infographic](infographic.svg)

---

## 🎯 專案簡介

建立一個可互動的機器學習演算法學習網頁，採用 **Next.js 前端** + **FastAPI 後端** 架構。

涵蓋 **10 大機器學習演算法**，每個演算法獨立分頁，包含：

- ✅ 適用情境分析
- ✅ 優點與缺點說明
- ✅ 數學原理推導
- ✅ 互動式資料分布圖表
- ✅ 可調整參數的控制面板

---

## 🏗️ 系統架構

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Port 3000)                     │
│  Next.js 16 · React · TypeScript · Tailwind CSS · Recharts │
└──────────────────┬──────────────────────────────────────────┘
                   │  HTTP REST API
┌──────────────────▼──────────────────────────────────────────┐
│                     Backend (Port 8000)                     │
│          FastAPI · Python · scikit-learn · NumPy            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌐 部署

### Vercel（前端）

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jamessun0919-ops/Hw5-Top10MLplatform)

| 設定 | 值 |
|------|-----|
| **Root Directory** | （在 Vercel Dashboard 設定為 `frontend`） |
| **Framework** | Next.js |
| **Environment Variable** | `NEXT_PUBLIC_API_URL` → 你的 Render 後端網址（如 `https://top10ml-backend.onrender.com`，結尾不要加 `/api`） |

> `vercel.json` 已預設於專案根目錄，Vercel 會自動辨識。

### Render（後端）

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/jamessun0919-ops/Hw5-Top10MLplatform)

| 設定 | 值 |
|------|-----|
| **Runtime** | Python 3.11 |
| **Build Command** | `pip install -r backend/requirements.txt` |
| **Start Command** | `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Health Check** | `/api/algorithms` |

> `render.yaml` 與 `backend/Procfile` 已預設於專案中。

---

## 🚀 快速開始

### 後端

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 前端

```bash
cd frontend
npm install
npm run dev
```

開啟瀏覽器訪問 **http://localhost:3000**

---

## 🧩 十大演算法一覽

| # | 演算法 | 分類 | API 端點 | 可調參數 |
|---|--------|------|----------|----------|
| 1 | **線性回歸** | 監督式學習（回歸） | `/api/linear-regression/generate` | slope, intercept, noise |
| 2 | **邏輯回歸** | 監督式學習（分類） | `/api/logistic-regression/generate` | C (正則化強度) |
| 3 | **決策樹** | 監督式學習（分類/回歸） | `/api/decision-tree/generate` | max_depth, min_samples_split |
| 4 | **隨機森林** | 監督式學習（分類/回歸） | `/api/random-forest/generate` | n_estimators, max_depth |
| 5 | **支援向量機 SVM** | 監督式學習（分類） | `/api/svm/generate` | C, kernel (linear/rbf/poly) |
| 6 | **K-近鄰演算法** | 監督式學習（分類/回歸） | `/api/knn/generate` | K 值 |
| 7 | **K-平均聚類** | 非監督式學習（聚類） | `/api/kmeans/generate` | K, cluster_std |
| 8 | **主成分分析 PCA** | 非監督式學習（降維） | `/api/pca/generate` | n_components |
| 9 | **梯度提升** | 監督式學習（分類/回歸） | `/api/gradient-boosting/generate` | learning_rate, n_estimators |
| 10 | **神經網路** | 監督式學習（分類/回歸） | `/api/neural-network/generate` | hidden_layers, learning_rate |

---

## 🛠️ 技術棧

| 類別 | 技術 |
|------|------|
| **前端框架** | Next.js 16 + React 19 |
| **語言** | TypeScript |
| **樣式** | Tailwind CSS |
| **圖表** | Recharts |
| **後端框架** | FastAPI |
| **後端語言** | Python 3 |
| **機器學習** | scikit-learn, NumPy |
| **資料驗證** | Pydantic |

---

## 🎨 設計特色

- **科技風格 UI**：深色主題搭配霓虹漸層（Cyan ↔ Purple）
- **玻璃卡片效果**：毛玻璃背景搭配微光邊框
- **網格背景**：增添科技感與層次
- **動態圖表**：使用 Recharts 呈現決策邊界、Sigmoid 曲線、PCA 投影等
- **即時互動**：修改參數後立即重新生成圖表

---

## 📁 專案結構

```
TOP10ML/
├── backend/
│   ├── main.py                       # FastAPI 主入口
│   ├── requirements.txt
│   └── algorithms/                   # 演算法模組
│       ├── linear_regression.py
│       ├── logistic_regression.py
│       ├── decision_tree.py
│       ├── random_forest.py
│       ├── svm.py
│       ├── knn.py
│       ├── kmeans.py
│       ├── pca.py
│       ├── gradient_boosting.py
│       └── neural_network.py
├── frontend/
│   └── src/
│       ├── app/                      # Next.js App Router
│       │   ├── page.tsx              # 主頁面（分頁導航）
│       │   ├── layout.tsx
│       │   └── globals.css           # 科技風格主題
│       ├── components/               # UI 元件
│       │   ├── AlgorithmPage.tsx      # 演算法頁面容器
│       │   ├── ParameterPanel.tsx     # 參數控制面板
│       │   ├── InfoPanel.tsx          # 演算法資訊卡片
│       │   ├── RegressionChart.tsx    # 回歸散佈圖
│       │   ├── LogisticChart.tsx      # Sigmoid 曲線
│       │   ├── DecisionBoundaryChart.tsx # 決策邊界圖
│       │   ├── CurveChart.tsx         # 學習/損失曲線
│       │   ├── PCAChart.tsx           # PCA 投影圖
│       │   └── BarChartComponent.tsx  # 長條圖
│       └── lib/
│           ├── api.ts                 # API 客戶端
│           └── algorithmConfigs.ts    # 演算法設定
├── infographic.svg                    # 專案資訊圖
└── workflow.md                        # 工作流程記錄
```

---

## 📄 授權

MIT License © 2026
