"""
报价人表模型
"""
from sqlalchemy import Column, String, Boolean, Integer
from app.models.base import BaseModel


class Quoter(BaseModel):
    """报价人表"""

    __tablename__ = "quoters"

    name = Column(String(50), nullable=False, comment="姓名")
    phone = Column(String(20), nullable=False, comment="电话")
    email = Column(String(100), nullable=True, comment="邮箱")
    position = Column(String(50), nullable=True, comment="职位")
    is_default = Column(Boolean, default=False, nullable=False, comment="是否默认")
    sort_order = Column(Integer, default=0, nullable=False, comment="排序序号")

    def __repr__(self):
        return f"<Quoter {self.name}>"
