from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.datasets import make_classification

router = APIRouter()


class GradientBoostingParams(BaseModel):
    learning_rate: float = 0.1
    n_estimators: int = 50
    max_depth: int = 3
    n_points: int = 100


@router.post("/generate")
def generate_data(params: GradientBoostingParams):
    np.random.seed(42)
    X, y = make_classification(
        n_samples=params.n_points, n_features=2, n_redundant=0,
        n_informative=2, n_clusters_per_class=1, flip_y=0.05,
        random_state=42
    )

    model = GradientBoostingClassifier(
        learning_rate=params.learning_rate,
        n_estimators=params.n_estimators,
        max_depth=params.max_depth,
        random_state=42
    )
    model.fit(X, y)

    x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
    y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
    xx, yy = np.meshgrid(np.linspace(x_min, x_max, 50), np.linspace(y_min, y_max, 50))
    Z = model.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)

    # staged predictions for learning curve
    staged_scores = []
    for i, y_pred in enumerate(model.staged_predict(X)):
        if i % max(1, params.n_estimators // 10) == 0:
            staged_scores.append({"step": i + 1, "accuracy": float(np.mean(y_pred == y))})
    staged_scores.append({"step": params.n_estimators, "accuracy": float(model.score(X, y))})

    return {
        "data": [{"x1": float(x[0]), "x2": float(x[1]), "label": int(yi)} for x, yi in zip(X, y)],
        "decision_boundary": {
            "x1": xx.tolist(),
            "x2": yy.tolist(),
            "z": Z.tolist()
        },
        "accuracy": float(model.score(X, y)),
        "learning_curve": staged_scores,
        "feature_importance": model.feature_importances_.tolist(),
        "info": {
            "適用情境": "搜尋排名、競賽建模、廣告點擊預測",
            "優點": "預測精度高、可處理混合資料",
            "缺點": "容易過擬合、超參數眾多",
            "數學原理": "逐步擬合殘差：Fm(x) = Fm₋₁(x) + η·hm(x)，hm = argmin ΣL(yi, Fm₋₁(xi) + h(xi))"
        }
    }
