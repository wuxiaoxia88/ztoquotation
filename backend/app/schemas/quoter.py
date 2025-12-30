"""
报价人相关的数据验证模式
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class QuoterBase(BaseModel):
    """报价人基础模式"""
    name: str = Field(..., min_length=2, max_length=50, description="姓名")
    phone: str = Field(..., min_length=11, max_length=20, description="电话")
    email: Optional[EmailStr] = Field(None, description="邮箱")
    position: Optional[str] = Field(None, max_length=50, description="职位")
    sort_order: int = Field(0, ge=0, description="排序序号")


class QuoterCreate(QuoterBase):
    """创建报价人"""
    is_default: bool = Field(False, description="是否默认")


class QuoterUpdate(BaseModel):
    """更新报价人"""
    name: Optional[str] = Field(None, min_length=2, max_length=50)
    phone: Optional[str] = Field(None, min_length=11, max_length=20)
    email: Optional[EmailStr] = None
    position: Optional[str] = Field(None, max_length=50)
    sort_order: Optional[int] = Field(None, ge=0)
    is_default: Optional[bool] = None


class QuoterResponse(QuoterBase):
    """报价人响应"""
    id: int
    is_default: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
