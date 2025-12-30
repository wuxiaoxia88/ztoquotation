"""
数据库模型基类
"""
from datetime import datetime
from sqlalchemy import Column, Integer, DateTime
from app.database import Base


class TimestampMixin:
    """时间戳混入类"""

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, comment="创建时间")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False, comment="更新时间")


class BaseModel(Base, TimestampMixin):
    """抽象基类"""

    __abstract__ = True

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, comment="主键ID")
