from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import make_classification

router = APIRouter()


class DecisionTreeParams(BaseModel):
    max_depth: int = 3
    min_samples_split: int = 2
    n_points: int = 100


@router.post("/generate")
def generate_data(params: DecisionTreeParams):
    np.random.seed(42)
    X, y = make_classification(
        n_samples=params.n_points, n_features=2, n_redundant=0,
        n_informative=2, n_clusters_per_class=1, flip_y=0.05,
        random_state=42
    )

    model = DecisionTreeClassifier(max_depth=params.max_depth, min_samples_split=params.min_samples_split)
    model.fit(X, y)

    # decision boundary
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
        "tree_depth": int(model.get_depth()),
        "info": {
            "適用情境": "客戶分群、貸款審核、醫療診斷",
            "優點": "不需特徵縮放、可解釋性強",
            "缺點": "容易過擬合、對資料微小變動敏感",
            "數學原理": "以資訊增益 IG = H(S) - Σ(|Sv|/|S|)H(Sv) 或吉尼係數選擇分裂點"
        }
    }
