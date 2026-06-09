from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np

router = APIRouter()


class LinearRegressionParams(BaseModel):
    slope: float = 2.0
    intercept: float = 3.0
    noise: float = 1.0
    n_points: int = 50


@router.post("/generate")
def generate_data(params: LinearRegressionParams):
    np.random.seed(42)
    x = np.linspace(0, 10, params.n_points)
    y = params.slope * x + params.intercept + np.random.normal(0, params.noise, params.n_points)

    # compute regression line
    coeffs = np.polyfit(x, y, 1)
    fitted = np.polyval(coeffs, x)

    return {
        "data": [{"x": float(xi), "y": float(yi)} for xi, yi in zip(x, y)],
        "regression_line": [{"x": float(xi), "y": float(fi)} for xi, fi in zip(x, fitted)],
        "equation": f"y = {coeffs[0]:.2f}x + {coeffs[1]:.2f}",
        "r_squared": float(np.corrcoef(x, y)[0, 1] ** 2),
        "info": {
            "適用情境": "房價預測、銷售預測、趨勢分析",
            "優點": "簡單快速、可解釋性高",
            "缺點": "只能處理線性關係、對異常值敏感",
            "數學原理": "y = wx + b，最小化 MSE：min Σ(yi - ŷi)² / n"
        }
    }
