from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification

router = APIRouter()


class RandomForestParams(BaseModel):
    n_estimators: int = 50
    max_depth: int = 3
    n_points: int = 100


@router.post("/generate")
def generate_data(params: RandomForestParams):
    np.random.seed(42)
    X, y = make_classification(
        n_samples=params.n_points, n_features=2, n_redundant=0,
        n_informative=2, n_clusters_per_class=1, flip_y=0.05,
        random_state=42
    )

    model = RandomForestClassifier(
        n_estimators=params.n_estimators,
        max_depth=params.max_depth,
        random_state=42
    )
    model.fit(X, y)

    x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
    y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
    xx, yy = np.meshgrid(np.linspace(x_min, x_max, 50), np.linspace(y_min, y_max, 50))
    Z = model.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)

    feature_importance = model.feature_importances_.tolist()

    return {
        "data": [{"x1": float(x[0]), "x2": float(x[1]), "label": int(yi)} for x, yi in zip(X, y)],
        "decision_boundary": {
            "x1": xx.tolist(),
            "x2": yy.tolist(),
            "z": Z.tolist()
        },
        "accuracy": float(model.score(X, y)),
        "feature_importance": feature_importance,
        "info": {
            "適用情境": "特徵重要性分析、金融風控、生資分析",
            "優點": "抗過擬合、可處理高維資料",
            "缺點": "模型龐大、訓練較慢",
            "數學原理": "Bagging + 隨機特徵選取，多棵決策樹投票：ŷ = (1/B)Σfb(x)"
        }
    }
