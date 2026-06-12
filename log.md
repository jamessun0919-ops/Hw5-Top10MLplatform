# TOP10ML 部署工作流程紀錄

**紀錄日期：** 2026-06-12  
**GitHub：** https://github.com/jamessun0919-ops/Hw5-Top10MLplatform  
**Live Demo：** https://hw5-top10-m-lplatform-k2pz.vercel.app/

## 1. 問題描述

Vercel 上的互動頁面無法產生機器學習資料，畫面持續顯示讀取狀態。調查後確認前端無法正確連線至 Render FastAPI 後端，且缺少逾時與可理解的錯誤提示。

## 2. 架構

| 項目 | 平台 | 技術 |
|---|---|---|
| 前端 | Vercel | Next.js、TypeScript |
| 後端 | Render Web Service | FastAPI、Uvicorn、scikit-learn |
| 原始碼 | GitHub | `jamessun0919-ops/Hw5-Top10MLplatform` |

前端透過 `NEXT_PUBLIC_API_URL` 取得 Render 網址，並呼叫 `${NEXT_PUBLIC_API_URL}/api/...`。

## 3. 前端 API 修正

### 原始問題

- Production 未設定 `NEXT_PUBLIC_API_URL` 時會退回 `http://localhost:8000/api`。
- 部署後的 `localhost` 並不是 Render 後端。
- 請求沒有逾時機制，因此介面可能長時間停留在讀取狀態。
- 使用者填入帶有 `/api` 或結尾 `/` 的網址時，可能產生錯誤路徑。

### 修正內容

Commit：`0b5590e fix: handle unavailable backend API`

- Production 缺少 `NEXT_PUBLIC_API_URL` 時顯示明確設定錯誤。
- API 請求加入 15 秒逾時。
- Render 回應逾時時顯示可理解的錯誤訊息。
- 自動移除 Render URL 結尾的 `/` 或 `/api`，避免重複路徑。
- README 補充環境變數格式。

Vercel 環境變數格式：

```text
NEXT_PUBLIC_API_URL=https://你的-render-服務名稱.onrender.com
```

網址結尾不要加入 `/api` 或 `/api/algorithms`。修改環境變數後必須重新部署 Vercel。

## 4. Render 手動部署

因帳號方案無法使用 Blueprint，改由 Render Dashboard 手動建立 Web Service。

### Render 設定

```text
Repository: jamessun0919-ops/Hw5-Top10MLplatform
Branch: master
Root Directory: 留空
Runtime: Python
Build Command: python -m pip install --upgrade pip setuptools wheel && python -m pip install -r requirements.txt
Start Command: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
Health Check Path: /api/algorithms
```

## 5. Render 第一次建置失敗

錯誤摘要：

```text
metadata-generation-failed
This error originates from a subprocess
```

### 根因

專案沒有固定 Render 的 Python 版本。Render 的預設 Python 與鎖定的 `numpy==1.26.2`、`scikit-learn==1.3.2` 可能不相容，導致 pip 嘗試產生套件 metadata 時失敗。

### 修正

Commit：`f3c0222 fix: pin Render Python runtime`

- 新增根目錄 `.python-version`。
- 固定 Python 為 `3.11.9`。
- 建置前更新 `pip`、`setuptools` 與 `wheel`。
- 同步更新 `render.yaml` 與 README。

```text
3.11.9
```

修正後使用 Render 的 **Clear build cache & deploy** 重新建置。

## 6. Render 第二次啟動失敗

錯誤摘要：

```text
Exited with status 1 while running your code
```

### 根因

Render 使用以下命令載入套件模組：

```text
uvicorn backend.main:app
```

但 `backend/main.py` 原本使用頂層匯入：

```python
from algorithms import ...
```

由專案根目錄啟動時，Python 無法找到頂層 `algorithms`，造成模組載入失敗。

### 修正

Commit：`f3849b5 fix: use package-relative backend imports`

將匯入改為：

```python
from .algorithms import ...
```

本機使用相同模組路徑驗證：

```text
from backend.main import app
```

FastAPI 應用程式可成功載入，且 `/api/algorithms` 路由存在。此次修正後 Render 部署完成。

## 7. Vercel 部署

### 專案設定

```text
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Install Command: npm install
```

### 環境變數

```text
NEXT_PUBLIC_API_URL=https://你的-render-服務名稱.onrender.com
```

設定完成後重新部署 Vercel。Render 免費服務休眠後，第一次 API 請求可能需要較長時間；可先開啟以下網址喚醒服務：

```text
https://你的-render-服務名稱.onrender.com/api/algorithms
```

正常時應回傳演算法 JSON。

## 8. Live Demo 更新

Commit：`c563c7a docs: update Live Demo URL`

README 的 Live Demo 已更新為：

https://hw5-top10-m-lplatform-k2pz.vercel.app/

## 9. 最終狀態

| 檢查項目 | 狀態 |
|---|---|
| GitHub 最新程式碼 | 完成 |
| Render Python 版本固定 | 完成 |
| Render 套件安裝 | 完成 |
| FastAPI 模組載入 | 完成 |
| Render 後端部署 | 完成 |
| Vercel 環境變數設定 | 完成 |
| Vercel 前端部署 | 完成 |
| README Live Demo 更新 | 完成 |

## 10. 相關 Commit

| Commit | 說明 |
|---|---|
| `0b5590e` | 改善前端 API URL、逾時與錯誤處理 |
| `f3c0222` | 固定 Render Python 3.11.9 並更新建置命令 |
| `f3849b5` | 修正 FastAPI package-relative imports |
| `c563c7a` | 更新 README Live Demo URL |

## 11. 後續維護

- 修改 Render 網址後，同步更新 Vercel 的 `NEXT_PUBLIC_API_URL` 並重新部署。
- Render 部署失敗時，先確認失敗發生於 Build 或 Start 階段。
- Build 階段檢查 Python 版本、requirements 與 pip 完整錯誤訊息。
- Start 階段檢查 Uvicorn 命令、Python import 路徑及 `$PORT`。
- 前端顯示逾時時，先直接測試 Render 的 `/api/algorithms`。
- 免費 Render 服務可能休眠，冷啟動期間第一次請求可能超過前端逾時時間。
