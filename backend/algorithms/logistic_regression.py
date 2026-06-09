from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification

router = APIRouter()


class LogisticRegressionParams(BaseModel):
    c: float = 1.0
    n_points: int = 100


@router.post("/generate")
def generate_data(params: LogisticRegressionParams):
    np.random.seed(42)
    X, y = make_classification(
        n_samples=params.n_points, n_features=1, n_redundant=0,
        n_informative=1, n_clusters_per_class=1, flip_y=0.05,
        random_state=42
    )

    model = LogisticRegression(C=params.c)
    model.fit(X, y)

    x_range = np.linspace(X.min() - 0.5, X.max() + 0.5, 200).reshape(-1, 1)
    y_prob = model.predict_proba(x_range)[:, 1]
    y_pred = model.predict(x_range)

    return {
        "data": [{"x": float(x[0]), "y": int(yi)} for x, yi in zip(X, y)],
        "sigmoid": [{"x": float(x[0]), "prob": float(p)} for x, p in zip(x_range, y_prob)],
        "decision_boundary": float(-model.intercept_[0] / model.coef_[0][0]),
        "accuracy": float(model.score(X, y)),
        "info": {
            "適用情境": "垃圾郵件偵測、疾病診斷、信用評分",
            "優點": "輸出機率值、計算效率高",
            "缺點": "決策邊界為線性、容易欠擬合",
            "數學原理": "P(y=1|x) = σ(wᵀx + b)，σ(z)=1/(1+e⁻ᶻ)，最大化對數似然"
        }
    }
