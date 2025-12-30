"""
条款表模型
"""
from sqlalchemy import Column, String, Text, Boolean, Integer
from app.models.base import BaseModel


class FixedTerm(BaseModel):
    """固定条款表"""

    __tablename__ = "fixed_terms"

    title = Column(String(100), nullable=False, comment="标题")
    content = Column(Text, nullable=False, comment="内容")
    sort_order = Column(Integer, default=0, nullable=False, comment="排序序号")

    def __repr__(self):
        return f"<FixedTerm {self.title}>"


class OptionalTerm(BaseModel):
    """非固定条款表"""

    __tablename__ = "optional_terms"

    title = Column(String(100), nullable=False, comment="标题")
    content = Column(Text, nullable=False, comment="内容")
    is_default = Column(Boolean, default=False, nullable=False, comment="是否默认选中")
    sort_order = Column(Integer, default=0, nullable=False, comment="排序序号")

    def __repr__(self):
        return f"<OptionalTerm {self.title}>"
