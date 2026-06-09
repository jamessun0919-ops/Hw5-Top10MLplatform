from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import make_classification

router = APIRouter()


class NeuralNetworkParams(BaseModel):
    hidden_layers: int = 2
    hidden_neurons: int = 10
    learning_rate_init: float = 0.001
    max_iter: int = 200
    n_points: int = 100


@router.post("/generate")
def generate_data(params: NeuralNetworkParams):
    np.random.seed(42)
    X, y = make_classification(
        n_samples=params.n_points, n_features=2, n_redundant=0,
        n_informative=2, n_clusters_per_class=1, flip_y=0.05,
        random_state=42
    )

    hidden_layers = tuple([params.hidden_neurons] * params.hidden_layers)

    model = MLPClassifier(
        hidden_layer_sizes=hidden_layers,
        learning_rate_init=params.learning_rate_init,
        max_iter=params.max_iter,
        random_state=42,
        early_stopping=False
    )
    model.fit(X, y)

    x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
    y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
    xx, yy = np.meshgrid(np.linspace(x_min, x_max, 50), np.linspace(y_min, y_max, 50))
    Z = model.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)

    # loss curve
    loss_curve = [{"step": i + 1, "loss": float(l)} for i, l in enumerate(model.loss_curve_)]

    return {
        "data": [{"x1": float(x[0]), "x2": float(x[1]), "label": int(yi)} for x, yi in zip(X, y)],
        "decision_boundary": {
            "x1": xx.tolist(),
            "x2": yy.tolist(),
            "z": Z.tolist()
        },
        "accuracy": float(model.score(X, y)),
        "loss_curve": loss_curve,
        "n_iter": int(model.n_iter_),
        "info": {
            "適用情境": "影像辨識、NLP、語音辨識、遊戲AI",
            "優點": "可建模極複雜非線性關係、端到端學習",
            "缺點": "需大量資料與計算資源、可解釋性差",
            "數學原理": "多層感知機：a⁽ˡ⁺¹⁾ = σ(W⁽ˡ⁾a⁽ˡ⁾ + b⁽ˡ⁾)，反向傳播計算梯度 ∂L/∂W⁽ˡ⁾ = δ⁽ˡ⁺¹⁾(a⁽ˡ⁾)ᵀ，梯度下降更新權重"
        }
    }
