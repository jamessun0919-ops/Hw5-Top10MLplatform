from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from algorithms import (
    linear_regression, logistic_regression, decision_tree,
    random_forest, svm, knn, kmeans, pca, gradient_boosting, neural_network
)

app = FastAPI(title="TOP10ML Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(linear_regression.router, prefix="/api/linear-regression", tags=["Linear Regression"])
app.include_router(logistic_regression.router, prefix="/api/logistic-regression", tags=["Logistic Regression"])
app.include_router(decision_tree.router, prefix="/api/decision-tree", tags=["Decision Tree"])
app.include_router(random_forest.router, prefix="/api/random-forest", tags=["Random Forest"])
app.include_router(svm.router, prefix="/api/svm", tags=["SVM"])
app.include_router(knn.router, prefix="/api/knn", tags=["K-NN"])
app.include_router(kmeans.router, prefix="/api/kmeans", tags=["K-Means"])
app.include_router(pca.router, prefix="/api/pca", tags=["PCA"])
app.include_router(gradient_boosting.router, prefix="/api/gradient-boosting", tags=["Gradient Boosting"])
app.include_router(neural_network.router, prefix="/api/neural-network", tags=["Neural Network"])


@app.get("/api/algorithms")
def list_algorithms():
    return {
        "algorithms": [
            {"id": "linear-regression", "name": "線性回歸", "category": "監督式學習（回歸）"},
            {"id": "logistic-regression", "name": "邏輯回歸", "category": "監督式學習（分類）"},
            {"id": "decision-tree", "name": "決策樹", "category": "監督式學習（分類/回歸）"},
            {"id": "random-forest", "name": "隨機森林", "category": "監督式學習（分類/回歸）"},
            {"id": "svm", "name": "支援向量機 SVM", "category": "監督式學習（分類）"},
            {"id": "knn", "name": "K-近鄰演算法 K-NN", "category": "監督式學習（分類/回歸）"},
            {"id": "kmeans", "name": "K-平均聚類 K-Means", "category": "非監督式學習（聚類）"},
            {"id": "pca", "name": "主成分分析 PCA", "category": "非監督式學習（降維）"},
            {"id": "gradient-boosting", "name": "梯度提升", "category": "監督式學習（分類/回歸）"},
            {"id": "neural-network", "name": "神經網路", "category": "監督式學習（分類/回歸）"},
        ]
    }
