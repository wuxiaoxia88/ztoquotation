"""
省份和区域表模型
"""
from sqlalchemy import Column, String, Integer
from app.models.base import BaseModel


class Province(BaseModel):
    """省份表"""

    __tablename__ = "provinces"

    name = Column(String(50), unique=True, nullable=False, index=True, comment="省份名称")
    region_id = Column(Integer, nullable=False, comment="区域ID(1-6)")
    region_name = Column(String(20), nullable=False, comment="区域名称")
    sort_order = Column(Integer, default=0, nullable=False, comment="排序序号")

    def __repr__(self):
        return f"<Province {self.name} - {self.region_name}>"
