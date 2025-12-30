"""
价格模板相关的数据验证模式
"""
from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime
from app.models.template import TemplateType


class TemplateBase(BaseModel):
    """模板基础模式"""
    name: str = Field(..., min_length=2, max_length=100, description="模板名称")
    template_type: TemplateType = Field(..., description="模板类型")
    description: Optional[str] = Field(None, description="描述")


class TemplateCreate(TemplateBase):
    """创建模板"""
    template_data: dict = Field(..., description="模板数据(JSONB)")
    is_default: bool = Field(False, description="是否默认")
    is_active: bool = Field(True, description="是否激活")


class TemplateUpdate(BaseModel):
    """更新模板"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = None
    template_data: Optional[dict] = None
    is_default: Optional[bool] = None
    is_active: Optional[bool] = None


class TemplateResponse(TemplateBase):
    """模板响应"""
    id: int
    template_data: dict
    is_default: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
