from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.datasets import make_classification

router = APIRouter()


class KNNParams(BaseModel):
    k: int = 5
    n_points: int = 100


@router.post("/generate")
def generate_data(params: KNNParams):
    np.random.seed(42)
    X, y = make_classification(
        n_samples=params.n_points, n_features=2, n_redundant=0,
        n_informative=2, n_clusters_per_class=1, flip_y=0.05,
        random_state=42
    )

    model = KNeighborsClassifier(n_neighbors=params.k)
    model.fit(X, y)

    x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
    y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
    xx, yy = np.meshgrid(np.linspace(x_min, x_max, 50), np.linspace(y_min, y_max, 50))
    Z = model.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)

    return {
        "data": [{"x1": float(x[0]), "x2": float(x[1]), "label": int(yi)} for x, yi in zip(X, y)],
        "decision_boundary": {
            "x1": xx.tolist(),
            "x2": yy.tolist(),
            "z": Z.tolist()
        },
        "accuracy": float(model.score(X, y)),
        "info": {
            "適用情境": "推薦系統、手寫辨識、異常檢測",
            "優點": "實作簡單、無需訓練",
            "缺點": "預測速度慢、受維度詛咒影響",
            "數學原理": "歐氏距離 d(x,p)=√Σ(xi-pi)²，多數投票：ŷ = argmax ΣI(yi=c)"
        }
    }
