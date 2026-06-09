# 今日工作流程記錄

**日期**: 2026-06-09  
**專案**: TOP10ML — 機器學習十大演算法互動學習平台

---

## 目標
以 https://hw-5-liart.vercel.app/ 為參考，建立一個可互動的機器學習演算法學習網頁，使用 **Next.js** 前端 + **FastAPI** 後端架構。

---

## 工作歷程

### 1. 需求分析
- [x] 瀏覽參考網站了解互動模式
- [x] 確認 10 大演算法清單
- [x] 確定每個演算法需包含：適用情境、優缺點、數學原理、資料分布圖、參數調整空間

### 2. 專案初始化
- [x] 建立 `backend/` 目錄與 FastAPI 專案
- [x] 建立 `frontend/` 目錄（使用 `create-next-app`，含 TypeScript + Tailwind CSS）
- [x] 安裝依賴：`recharts`（圖表）、`axios`（HTTP 請求）

### 3. 後端開發 (FastAPI)
- [x] 建立 `main.py` 主入口，設定 CORS 中間件
- [x] 建立演算法模組（`algorithms/` 套件）
- [x] 實作 10 個演算法 API 端點，每個包含：
  - 接收參數（Pydantic model）
  - 生成合成資料（scikit-learn）
  - 執行模型訓練
  - 回傳圖表資料 + 評估指標 + 演算法資訊

| 演算法 | API 路徑 | 可調參數 |
|--------|----------|----------|
| 線性回歸 | `/api/linear-regression/generate` | slope, intercept, noise, n_points |
| 邏輯回歸 | `/api/logistic-regression/generate` | C, n_points |
| 決策樹 | `/api/decision-tree/generate` | max_depth, min_samples_split, n_points |
| 隨機森林 | `/api/random-forest/generate` | n_estimators, max_depth, n_points |
| SVM | `/api/svm/generate` | C, kernel, n_points |
| K-NN | `/api/knn/generate` | k, n_points |
| K-Means | `/api/kmeans/generate` | k, n_points, cluster_std |
| PCA | `/api/pca/generate` | n_components, n_points, n_features_original |
| 梯度提升 | `/api/gradient-boosting/generate` | learning_rate, n_estimators, max_depth, n_points |
| 神經網路 | `/api/neural-network/generate` | hidden_layers, hidden_neurons, learning_rate_init, max_iter, n_points |

### 4. 前端開發 (Next.js)
- [x] 設定全域 CSS 科技風格主題（霓虹、玻璃效果、網格背景）
- [x] 建立 `lib/api.ts` — API 客戶端封裝
- [x] 建立 `lib/algorithmConfigs.ts` — 10 種演算法的參數定義與 API 對應
- [x] 建立 UI 元件：
  - `ParameterPanel.tsx` — 參數調整面板
  - `InfoPanel.tsx` — 演算法資訊卡片
  - `RegressionChart.tsx` — 線性回歸散佈圖 + 回歸線
  - `LogisticChart.tsx` — Sigmoid 曲線 + 二元分類點
  - `DecisionBoundaryChart.tsx` — 2D 決策邊界熱力圖
  - `CurveChart.tsx` — 學習曲線 / 損失曲線
  - `PCAChart.tsx` — PCA 投影散佈圖 + 變異量長條圖
  - `BarChartComponent.tsx` — 通用長條圖
- [x] 建立 `AlgorithmPage.tsx` — 演算法頁面容器（整合圖表 + 參數 + 資訊）
- [x] 建立主頁面 `page.tsx` — 分頁導航 + 內容區

### 5. 型別檢查與除錯
- [x] 修復 `InfoPanel`、`CurveChart`、`PCAChart` 型別錯誤
- [x] 修復 `DecisionBoundaryChart` shape prop 型別問題
- [x] 修復 API 回傳型別推論問題
- [x] **最終建置成功**（TypeScript 編譯通過、靜態頁面生成完成）

### 6. 整合測試
- [x] 啟動 FastAPI 後端（`uvicorn main:app --port 8000`）
- [x] 啟動 Next.js 前端（`npm run dev` → `localhost:3000`）
- [x] 驗證 API 端點正常回傳資料
- [x] 驗證前端頁面正常渲染（Status 200）

### 7. 專案文件與資訊圖
- [x] 建立 `workflow.md` 工作流程記錄
- [x] 建立 `infographic.svg` 專案資訊圖（架構、演算法卡片、技術棧、功能）
- [x] 建立 `README.md`（含資訊圖嵌入、Live Demo 連結、完整專案說明）
- [x] 初始化 Git 並推送至 `github.com/jamessun0919-ops/Hw5-Top10MLplatform`

### 8. 部署設定（進行中）
- [x] 建立 `vercel.json` — Vercel 前端部署設定
- [x] 建立 `render.yaml` — Render Blueprint 後端部署設定（後因未付費改用手動）
- [x] 更新 `frontend/src/lib/api.ts` — 使用 `NEXT_PUBLIC_API_URL` 環境變數動態切換 API 位址
- [x] 前端成功部署至 Vercel：`https://hw5-top10-m-lplatform.vercel.app`
- [ ] 後端部署至 Render（Web Service 手動建立中）
  - Build Command: `pip install -r requirements.txt`
  - Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
  - 問題：Render 免費方案不支援 Blueprint，需手動建立
  - 狀態：**待 Render 建立 Web Service 完成**

---

## 最終執行狀態

| 服務 | 技術 | 網址 | 狀態 |
|------|------|------|------|
| 後端 API（本地） | FastAPI + scikit-learn | `http://localhost:8000` | ✅ 正常 |
| 前端（本地） | Next.js 16 + Recharts + Tailwind CSS | `http://localhost:3000` | ✅ 正常 |
| 前端（生產） | Vercel | `https://hw5-top10-m-lplatform.vercel.app` | ✅ 已部署 |
| 後端 API（生產） | Render | `https://top10ml-backend.onrender.com` | ❌ 待手動建立 |

---

## 待辦 / 未來改善
- [ ] **Render 手動建立 Web Service**（Build: `pip install -r requirements.txt`, Start: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`）
- [ ] Render 部署完成後，到 Vercel 設定 `NEXT_PUBLIC_API_URL` 環境變數
- [ ] 重新部署 Vercel 前端，驗證資料可正常顯示
- [ ] 更新 README 中 Live Demo 按鈕連結為最終 Vercel 網址
- [ ] 補上單元測試
- [ ] 加入更多互動效果（動畫過渡）
- [ ] 響應式行動版優化
- [ ] Docker 容器化部署
