from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
from sklearn.decomposition import PCA
from sklearn.datasets import make_blobs

router = APIRouter()


class PCAParams(BaseModel):
    n_components: int = 2
    n_points: int = 100
    n_features_original: int = 5


@router.post("/generate")
def generate_data(params: PCAParams):
    np.random.seed(42)
    X, _ = make_blobs(
        n_samples=params.n_points,
        n_features=params.n_features_original,
        centers=3,
        random_state=42
    )

    model = PCA(n_components=min(params.n_components, params.n_features_original))
    X_pca = model.fit_transform(X)

    return {
        "original_data": [{"x" + str(i): float(v) for i, v in enumerate(row)} for row in X],
        "pca_data": [{"x1": float(row[0]), "x2": float(row[1]) if row.shape[0] > 1 else 0} for row in X_pca],
        "explained_variance": [float(v) for v in model.explained_variance_ratio_],
        "cumulative_variance": float(np.cumsum(model.explained_variance_ratio_)[-1]),
        "components": model.components_.tolist(),
        "info": {
            "適用情境": "資料視覺化、雜訊濾除、加速訓練",
            "優點": "去除冗餘特徵、減少計算成本",
            "缺點": "主成分難以解釋、僅處理線性關係",
            "數學原理": "共變異數矩陣 Σ = (1/n)XᵀX 進行特徵分解 Σv = λv，選取前k個最大特徵值對應的特徵向量"
        }
    }
