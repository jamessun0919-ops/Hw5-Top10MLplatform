from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
from sklearn.svm import SVC
from sklearn.datasets import make_classification

router = APIRouter()


class SVMParams(BaseModel):
    c: float = 1.0
    kernel: str = "rbf"
    gamma: str = "scale"
    n_points: int = 100


@router.post("/generate")
def generate_data(params: SVMParams):
    np.random.seed(42)
    X, y = make_classification(
        n_samples=params.n_points, n_features=2, n_redundant=0,
        n_informative=2, n_clusters_per_class=1, flip_y=0.05,
        random_state=42
    )

    model = SVC(C=params.c, kernel=params.kernel, gamma=params.gamma, probability=True, random_state=42)
    model.fit(X, y)

    x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
    y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
    xx, yy = np.meshgrid(np.linspace(x_min, x_max, 50), np.linspace(y_min, y_max, 50))
    Z = model.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)

    support_vectors = [{"x1": float(sv[0]), "x2": float(sv[1])} for sv in model.support_vectors_]

    return {
        "data": [{"x1": float(x[0]), "x2": float(x[1]), "label": int(yi)} for x, yi in zip(X, y)],
        "decision_boundary": {
            "x1": xx.tolist(),
            "x2": yy.tolist(),
            "z": Z.tolist()
        },
        "support_vectors": support_vectors,
        "n_support_vectors": len(support_vectors),
        "accuracy": float(model.score(X, y)),
        "info": {
            "適用情境": "文本分類、人臉辨識、生物資訊",
            "優點": "有效處理高維空間、記憶體效率高",
            "缺點": "大規模資料訓練慢、對核函數選擇敏感",
            "數學原理": "最大化邊界：min ½||w||²，限制 yi(wᵀxi+b) ≥ 1，使用核函數 K(xi,xj)"
        }
    }
