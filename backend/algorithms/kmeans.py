from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs

router = APIRouter()


class KMeansParams(BaseModel):
    k: int = 3
    n_points: int = 200
    cluster_std: float = 1.5


@router.post("/generate")
def generate_data(params: KMeansParams):
    np.random.seed(42)
    X, y_true = make_blobs(
        n_samples=params.n_points,
        centers=params.k,
        n_features=2,
        cluster_std=params.cluster_std,
        random_state=42
    )

    model = KMeans(n_clusters=params.k, random_state=42, n_init=10)
    labels = model.fit_predict(X)
    centers = model.cluster_centers_

    # compute distances for elbow
    inertias = []
    k_range = list(range(1, min(11, params.n_points)))
    for k in k_range:
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        km.fit(X)
        inertias.append(float(km.inertia_))

    return {
        "data": [{"x1": float(x[0]), "x2": float(x[1]), "cluster": int(l)} for x, l in zip(X, labels)],
        "centers": [{"x1": float(c[0]), "x2": float(c[1])} for c in centers],
        "inertia": float(model.inertia_),
        "elbow_data": {"k": k_range, "inertia": inertias},
        "info": {
            "適用情境": "客戶分群、影像壓縮、異常檢測",
            "優點": "演算法簡單、收斂快速",
            "缺點": "需預設K值、對初始中心敏感",
            "數學原理": "最小化簇內誤差平方和：min ΣΣ||x - μi||²，迭代更新質心"
        }
    }
