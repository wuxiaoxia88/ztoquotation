"""
用户表模型
"""
from sqlalchemy import Column, String, Boolean, Enum
import enum
from app.models.base import BaseModel


class UserRole(str, enum.Enum):
    """用户角色"""
    ADMIN = "ADMIN"  # 管理员
    OPERATOR = "OPERATOR"  # 操作员


class User(BaseModel):
    """用户表"""

    __tablename__ = "users"

    username = Column(String(50), unique=True, nullable=False, index=True, comment="用户名")
    hashed_password = Column(String(255), nullable=False, comment="密码哈希")
    email = Column(String(100), unique=True, nullable=True, comment="邮箱")
    full_name = Column(String(50), nullable=True, comment="姓名")
    role = Column(Enum(UserRole), default=UserRole.OPERATOR, nullable=False, comment="角色")
    is_active = Column(Boolean, default=True, nullable=False, comment="是否激活")

    def __repr__(self):
        return f"<User {self.username}>"
