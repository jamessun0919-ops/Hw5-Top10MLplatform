from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression, Lasso, Ridge
from sklearn.ensemble import RandomForestRegressor, ExtraTreesRegressor, GradientBoostingRegressor
from sklearn.feature_selection import f_regression, mutual_info_regression, RFE
from sklearn.datasets import fetch_california_housing
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error
import os

router = APIRouter()


class MultipleLinearRegressionParams(BaseModel):
    dataset: str = "startups"
    n_points: int = 100
    noise: float = 1.0
    n_features: int = 10
    n_informative: int = 4


@router.post("/generate")
def generate_data(params: MultipleLinearRegressionParams):
    # Load dataset
    if params.dataset == "simulation":
        np.random.seed(42)
        X_data = np.random.uniform(-3, 3, size=(params.n_points, params.n_features))
        true_w = np.zeros(params.n_features)
        for i in range(min(params.n_informative, params.n_features)):
            true_w[i] = (2.0 + 1.5 * i) * (-1 if i % 2 == 1 else 1)
        true_intercept = 1.5
        y = np.dot(X_data, true_w) + true_intercept + np.random.normal(0, params.noise, params.n_points)
        
        feature_names = [f"X{i+1}" for i in range(params.n_features)]
        df = pd.DataFrame(X_data, columns=feature_names)
        df["y"] = y
    elif params.dataset == "startups":
        startups_path = r"C:\Users\User\Desktop\HW6 Kaggle  50startup CRISP_DM\50_Startups.csv"
        if os.path.exists(startups_path):
            df_raw = pd.read_csv(startups_path)
        else:
            df_raw = pd.DataFrame({
                "R&D Spend": np.random.uniform(10000, 160000, 50),
                "Administration": np.random.uniform(10000, 180000, 50),
                "Marketing Spend": np.random.uniform(10000, 450000, 50),
                "Profit": np.random.uniform(30000, 190000, 50)
            })
        df = pd.DataFrame({
            "RDSpend": df_raw["R&D Spend"] / 1000,
            "Admin": df_raw["Administration"] / 1000,
            "Marketing": df_raw["Marketing Spend"] / 1000,
            "y": df_raw["Profit"] / 1000
        })
        feature_names = ["RDSpend", "Admin", "Marketing"]
    elif params.dataset == "boston":
        boston_url = "https://raw.githubusercontent.com/selva86/datasets/master/BostonHousing.csv"
        try:
            df_raw = pd.read_csv(boston_url)
        except Exception:
            df_raw = pd.DataFrame({
                "crim": np.random.uniform(0, 10, 100),
                "zn": np.random.uniform(0, 100, 100),
                "indus": np.random.uniform(0, 30, 100),
                "chas": np.random.choice([0, 1], 100),
                "nox": np.random.uniform(0.3, 0.9, 100),
                "rm": np.random.uniform(4, 9, 100),
                "age": np.random.uniform(0, 100, 100),
                "dis": np.random.uniform(1, 12, 100),
                "rad": np.random.randint(1, 25, 100),
                "tax": np.random.uniform(180, 700, 100),
                "ptratio": np.random.uniform(12, 22, 100),
                "b": np.random.uniform(300, 400, 100),
                "lstat": np.random.uniform(1, 38, 100),
                "medv": np.random.uniform(5, 50, 100)
            })
        df = df_raw.rename(columns={"medv": "y"})
        feature_names = [col for col in df.columns if col != "y"]
    elif params.dataset == "california":
        try:
            cal = fetch_california_housing(as_frame=True)
            df_raw = cal.frame
        except Exception:
            df_raw = pd.DataFrame({
                "MedInc": np.random.uniform(1, 15, 100),
                "HouseAge": np.random.uniform(1, 52, 100),
                "AveRooms": np.random.uniform(3, 8, 100),
                "AveBedrms": np.random.uniform(1, 4, 100),
                "Population": np.random.uniform(100, 5000, 100),
                "AveOccup": np.random.uniform(1, 6, 100),
                "Latitude": np.random.uniform(32, 42, 100),
                "Longitude": np.random.uniform(-124, -114, 100),
                "MedHouseVal": np.random.uniform(0.5, 5.0, 100)
            })
        df = df_raw.rename(columns={"MedHouseVal": "y"})
        df = df[df["AveRooms"] < 15]  # Clean extreme values
        df["y"] = df["y"] * 10
        feature_names = [col for col in df.columns if col != "y"]

    # Process
    X = df[feature_names].dropna()
    y = df.loc[X.index, "y"]
    
    # Standardize
    scaler = StandardScaler()
    X_scaled = pd.DataFrame(scaler.fit_transform(X), columns=X.columns)
    
    # Rank features using the 10 algorithms
    N_feat = len(feature_names)
    ranks = {}
    
    # 1. Pearson
    ranks['pearson'] = X_scaled.corrwith(y).abs().fillna(0).sort_values(ascending=False).index.tolist()
    
    # 2. F-Regression
    try:
        f_vals, _ = f_regression(X_scaled, y)
        ranks['f_regression'] = pd.Series(f_vals, index=X_scaled.columns).fillna(0).sort_values(ascending=False).index.tolist()
    except Exception:
        ranks['f_regression'] = ranks['pearson']
        
    # 3. Mutual Info
    try:
        mi_vals = mutual_info_regression(X_scaled, y, random_state=42)
        ranks['mutual_info'] = pd.Series(mi_vals, index=X_scaled.columns).fillna(0).sort_values(ascending=False).index.tolist()
    except Exception:
        ranks['mutual_info'] = ranks['pearson']
        
    # 4. RFE
    try:
        rfe = RFE(estimator=LinearRegression(), n_features_to_select=1)
        rfe.fit(X_scaled, y)
        ranks['rfe'] = pd.Series(rfe.ranking_, index=X_scaled.columns).sort_values().index.tolist()
    except Exception:
        ranks['rfe'] = ranks['pearson']
        
    # 5. Lasso
    try:
        lasso = Lasso(alpha=0.05, max_iter=2000)
        lasso.fit(X_scaled, y)
        ranks['lasso'] = pd.Series(np.abs(lasso.coef_), index=X_scaled.columns).fillna(0).sort_values(ascending=False).index.tolist()
    except Exception:
        ranks['lasso'] = ranks['pearson']
        
    # 6. Ridge
    try:
        ridge = Ridge(alpha=1.0)
        ridge.fit(X_scaled, y)
        ranks['ridge'] = pd.Series(np.abs(ridge.coef_), index=X_scaled.columns).fillna(0).sort_values(ascending=False).index.tolist()
    except Exception:
        ranks['ridge'] = ranks['pearson']
        
    # 7. RF
    try:
        rf = RandomForestRegressor(n_estimators=20, random_state=42)
        rf.fit(X_scaled, y)
        ranks['random_forest'] = pd.Series(rf.feature_importances_, index=X_scaled.columns).fillna(0).sort_values(ascending=False).index.tolist()
    except Exception:
        ranks['random_forest'] = ranks['pearson']
        
    # 8. Extra Trees
    try:
        et = ExtraTreesRegressor(n_estimators=20, random_state=42)
        et.fit(X_scaled, y)
        ranks['extra_trees'] = pd.Series(et.feature_importances_, index=X_scaled.columns).fillna(0).sort_values(ascending=False).index.tolist()
    except Exception:
        ranks['extra_trees'] = ranks['pearson']
        
    # 9. GB
    try:
        gb = GradientBoostingRegressor(n_estimators=20, random_state=42)
        gb.fit(X_scaled, y)
        ranks['gradient_boosting'] = pd.Series(gb.feature_importances_, index=X_scaled.columns).fillna(0).sort_values(ascending=False).index.tolist()
    except Exception:
        ranks['gradient_boosting'] = ranks['pearson']
        
    # 10. SFS
    try:
        sfs_ordered = []
        remaining = list(X_scaled.columns)
        current = []
        for _ in range(N_feat):
            best_f = None
            best_score = -np.inf
            for f in remaining:
                candidate = current + [f]
                model = LinearRegression()
                model.fit(X_scaled[candidate], y)
                score = model.score(X_scaled[candidate], y)
                if score > best_score:
                    best_score = score
                    best_f = f
            if best_f is not None:
                sfs_ordered.append(best_f)
                current.append(best_f)
                remaining.remove(best_f)
        ranks['sfs'] = sfs_ordered
    except Exception:
        ranks['sfs'] = ranks['pearson']
        
    # Compute curves for each algorithm
    curves_data = []
    algorithms = ['pearson', 'f_regression', 'mutual_info', 'rfe', 'lasso', 'ridge', 'random_forest', 'extra_trees', 'gradient_boosting', 'sfs']
    
    for k in range(1, N_feat + 1):
        point = {"k": k}
        for alg in algorithms:
            selected = ranks[alg][:k]
            model = LinearRegression()
            model.fit(X_scaled[selected], y)
            preds = model.predict(X_scaled[selected])
            r2 = float(model.score(X_scaled[selected], y))
            mse = float(mean_squared_error(y, preds))
            point[f"{alg}_r2"] = r2
            point[f"{alg}_mse"] = mse
        curves_data.append(point)
        
    return {
        "curves": curves_data,
        "n_features": N_feat,
        "feature_names": feature_names,
        "info": {
            "適用情境": "高維度數據預測、關鍵因子特徵篩選、模型降維與解釋性優化",
            "優點": "多演算法同時對比、自動繪製特徵數與模型效能曲線、輔助快速決策特徵組合",
            "缺點": "各篩選器原理不同，結果可能互有出入；特徵過多時計算時間會隨之增加",
            "數學原理": "R-squared = 1 - (SS_res / SS_tot)；MSE = Σ(yi - ŷi)² / n。隨著特徵數增加，擬合度增加但須防範過擬合"
        }
    }
