"""
报价单表模型
"""
from sqlalchemy import Column, String, Text, Date, Integer, Boolean, Enum, JSON, ForeignKey
from sqlalchemy.orm import relationship
import enum
from app.models.base import BaseModel


class QuoteStatus(str, enum.Enum):
    """报价单状态"""
    DRAFT = "DRAFT"  # 草稿
    SENT = "SENT"  # 已发送
    CONFIRMED = "CONFIRMED"  # 已确认
    EXPIRED = "EXPIRED"  # 已过期


class Quote(BaseModel):
    """报价单表"""

    __tablename__ = "quotes"

    quote_number = Column(String(50), unique=True, nullable=False, index=True, comment="报价单编号")

    # 客户信息
    customer_name = Column(String(100), nullable=False, comment="客户公司名称")
    contact_person = Column(String(50), nullable=False, comment="联系人")
    contact_phone = Column(String(20), nullable=False, comment="联系电话")
    customer_address = Column(String(255), nullable=True, comment="客户地址")

    # 报价信息
    daily_volume = Column(String(50), nullable=True, comment="日均发货量")
    weight_range = Column(String(50), nullable=True, comment="重量段")
    product_type = Column(String(50), nullable=True, comment="产品类型")

    # 报价人
    quoter_id = Column(Integer, ForeignKey("quoters.id"), nullable=False, comment="报价人ID")
    quoter = relationship("Quoter", backref="quotes")

    # 日期
    quote_date = Column(Date, nullable=False, comment="报价日期")
    valid_days = Column(Integer, default=30, nullable=False, comment="有效期(天)")
    expire_date = Column(Date, nullable=False, comment="到期日期")

    # 价格数据
    template_type = Column(String(20), nullable=False, comment="价格模板类型")
    price_data = Column(JSON, nullable=False, comment="价格数据(JSONB)")

    # 条款
    fixed_terms = Column(JSON, nullable=True, comment="固定条款")
    optional_terms = Column(JSON, nullable=True, comment="非固定条款")
    custom_terms = Column(JSON, nullable=True, comment="自定义条款")

    # 其他配置
    is_tax_included = Column(Boolean, default=True, nullable=False, comment="是否含税")
    remark = Column(Text, nullable=True, comment="备注")

    # 状态
    status = Column(Enum(QuoteStatus), default=QuoteStatus.DRAFT, nullable=False, comment="状态")

    def __repr__(self):
        return f"<Quote {self.quote_number} - {self.customer_name}>"


class QuoteExport(BaseModel):
    """报价单导出记录表"""

    __tablename__ = "quote_exports"

    quote_id = Column(Integer, ForeignKey("quotes.id"), nullable=False, comment="报价单ID")
    quote = relationship("Quote", backref="exports")

    export_format = Column(String(20), nullable=False, comment="导出格式(pdf/excel/word)")
    file_path = Column(String(255), nullable=False, comment="文件路径")
    file_size = Column(Integer, nullable=True, comment="文件大小(字节)")

    def __repr__(self):
        return f"<QuoteExport {self.export_format} - Quote#{self.quote_id}>"
