"""
报价单相关的数据验证模式
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
from app.models.quote import QuoteStatus


class QuoteBase(BaseModel):
    """报价单基础模式"""
    customer_name: str = Field(..., min_length=2, max_length=100, description="客户公司名称")
    contact_person: str = Field(..., min_length=2, max_length=50, description="联系人姓名")
    contact_phone: str = Field(..., min_length=11, max_length=20, description="联系人电话")
    customer_address: Optional[str] = Field(None, max_length=255, description="客户地址")
    daily_volume: Optional[str] = Field(None, max_length=50, description="日均发货量")
    weight_range: Optional[str] = Field(None, max_length=50, description="主要重量段")
    product_type: Optional[str] = Field(None, max_length=50, description="产品类型")


class QuoteCreate(QuoteBase):
    """创建报价单"""
    quoter_id: int = Field(..., description="报价人ID")
    quote_date: date = Field(..., description="报价日期")
    valid_days: int = Field(30, ge=1, le=365, description="有效天数")
    is_tax_included: bool = Field(True, description="是否含税")

    # 价格数据（从模板复制并可能修改）
    template_type: str = Field(..., description="模板类型: TONGPIAO/DAKEHU/CANGPEI")
    price_data: dict = Field(..., description="价格数据(JSONB)")

    # 条款数据
    fixed_terms: Optional[List[dict]] = Field(None, description="固定条款")
    optional_terms: Optional[List[dict]] = Field(None, description="选中的非固定条款")
    custom_terms: Optional[List[str]] = Field(None, description="自定义条款")

    # 备注
    remark: Optional[str] = Field(None, description="备注")


class QuoteUpdate(BaseModel):
    """更新报价单"""
    customer_name: Optional[str] = Field(None, min_length=2, max_length=100)
    contact_person: Optional[str] = Field(None, min_length=2, max_length=50)
    contact_phone: Optional[str] = Field(None, min_length=11, max_length=20)
    customer_address: Optional[str] = Field(None, max_length=255)
    daily_volume: Optional[str] = Field(None, max_length=50)
    weight_range: Optional[str] = Field(None, max_length=50)
    product_type: Optional[str] = Field(None, max_length=50)

    quoter_id: Optional[int] = None
    quote_date: Optional[date] = None
    valid_days: Optional[int] = Field(None, ge=1, le=365)
    is_tax_included: Optional[bool] = None

    template_type: Optional[str] = None
    price_data: Optional[dict] = None
    fixed_terms: Optional[List[dict]] = None
    optional_terms: Optional[List[dict]] = None
    custom_terms: Optional[List[str]] = None

    remark: Optional[str] = None


class QuoteStatusUpdate(BaseModel):
    """更新报价单状态"""
    status: QuoteStatus = Field(..., description="新状态")


class QuoteResponse(QuoteBase):
    """报价单响应"""
    id: int
    quote_number: str
    quoter_id: int
    quote_date: date
    expire_date: date
    valid_days: int
    is_tax_included: bool
    status: QuoteStatus

    template_type: str
    price_data: dict
    fixed_terms: Optional[List[dict]]
    optional_terms: Optional[List[dict]]
    custom_terms: Optional[List[str]]

    remark: Optional[str]

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class QuoteListItem(BaseModel):
    """报价单列表项（简化版）"""
    id: int
    quote_number: str
    customer_name: str
    contact_person: str
    contact_phone: str
    quote_date: date
    expire_date: date
    status: QuoteStatus
    created_at: datetime

    class Config:
        from_attributes = True


class NextQuoteNumber(BaseModel):
    """下一个报价单编号"""
    quote_number: str
    quote_date: date
