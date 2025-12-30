"""
用户相关的数据验证模式
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.models.user import UserRole


class UserBase(BaseModel):
    """用户基础模式"""
    username: str = Field(..., min_length=3, max_length=50, description="用户名")
    email: Optional[EmailStr] = Field(None, description="邮箱")
    full_name: Optional[str] = Field(None, max_length=50, description="姓名")
    role: UserRole = Field(UserRole.OPERATOR, description="角色")


class UserCreate(UserBase):
    """创建用户"""
    password: str = Field(..., min_length=6, max_length=50, description="密码")
    is_active: bool = Field(True, description="是否激活")


class UserUpdate(BaseModel):
    """更新用户"""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None


class UserPasswordUpdate(BaseModel):
    """修改密码"""
    old_password: str = Field(..., description="旧密码")
    new_password: str = Field(..., min_length=6, max_length=50, description="新密码")


class UserResponse(UserBase):
    """用户响应"""
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    """Token响应"""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Token数据"""
    username: Optional[str] = None


class LoginRequest(BaseModel):
    """登录请求"""
    username: str = Field(..., description="用户名")
    password: str = Field(..., description="密码")
