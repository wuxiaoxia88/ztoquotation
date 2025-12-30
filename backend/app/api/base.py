"""
基础数据API（省份、条款等）
"""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.province import Province
from app.models.term import FixedTerm, OptionalTerm
from app.models.user import User
from app.api.auth import get_current_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/api/v1", tags=["基础数据"])


# Schemas
class ProvinceResponse(BaseModel):
    """省份响应"""
    id: int
    name: str
    region_id: int
    region_name: str
    sort_order: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class FixedTermResponse(BaseModel):
    """固定条款响应"""
    id: int
    title: str
    content: str
    sort_order: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class OptionalTermResponse(BaseModel):
    """非固定条款响应"""
    id: int
    title: str
    content: str
    is_default: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# 省份相关API
@router.get("/provinces", response_model=List[ProvinceResponse])
def list_provinces(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取省份列表"""
    provinces = db.query(Province).order_by(Province.region_id, Province.sort_order).all()
    return provinces


@router.get("/regions", response_model=dict)
def list_regions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取区域列表（包含省份）"""
    provinces = db.query(Province).order_by(Province.region_id, Province.sort_order).all()

    # 按区域分组
    regions = {}
    for province in provinces:
        region_key = f"region_{province.region_id}"
        if region_key not in regions:
            regions[region_key] = {
                "region_id": province.region_id,
                "region_name": province.region_name,
                "provinces": []
            }
        regions[region_key]["provinces"].append({
            "id": province.id,
            "name": province.name,
            "sort_order": province.sort_order
        })

    # 转换为列表
    return {"regions": list(regions.values())}


# 固定条款API
@router.get("/terms/fixed", response_model=List[FixedTermResponse])
def list_fixed_terms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取固定条款列表"""
    terms = db.query(FixedTerm).order_by(FixedTerm.sort_order).all()
    return terms


# 非固定条款API
@router.get("/terms/optional", response_model=List[OptionalTermResponse])
def list_optional_terms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取非固定条款列表"""
    terms = db.query(OptionalTerm).order_by(OptionalTerm.sort_order).all()
    return terms
