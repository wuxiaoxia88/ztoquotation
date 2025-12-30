"""
价格模板表模型
"""
from sqlalchemy import Column, String, Text, Boolean, Enum, JSON
import enum
from app.models.base import BaseModel


class TemplateType(str, enum.Enum):
    """模板类型"""
    TONGPIAO = "tongpiao"  # 通票
    DAKEHU = "dakehu"  # 大客户
    CANGPEI = "cangpei"  # 仓配


class Template(BaseModel):
    """价格模板表"""

    __tablename__ = "templates"

    name = Column(String(100), nullable=False, comment="模板名称")
    template_type = Column(Enum(TemplateType), nullable=False, comment="模板类型")
    description = Column(Text, nullable=True, comment="描述")
    template_data = Column(JSON, nullable=False, comment="模板数据(JSONB)")
    is_default = Column(Boolean, default=False, nullable=False, comment="是否默认")
    is_active = Column(Boolean, default=True, nullable=False, comment="是否激活")

    def __repr__(self):
        return f"<Template {self.name} ({self.template_type})>"
