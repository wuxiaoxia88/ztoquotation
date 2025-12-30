"""
报价单管理API
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract, Integer
from datetime import date, timedelta
from app.database import get_db
from app.models.quote import Quote, QuoteStatus
from app.models.template import Template
from app.models.quoter import Quoter
from app.models.user import User
from app.schemas.quote import (
    QuoteCreate, QuoteUpdate, QuoteResponse, QuoteListItem,
    QuoteStatusUpdate, NextQuoteNumber
)
from app.api.auth import get_current_user

router = APIRouter(prefix="/api/v1/quotes", tags=["报价单管理"])


def generate_quote_number(db: Session, quote_date: date) -> str:
    """
    生成报价单编号
    格式: ZTO-JCYB-{YYYYMMDD}-{序号}
    """
    date_str = quote_date.strftime("%Y%m%d")

    # 查询当天已有的最大序号
    # 从quote_number字段提取序号部分（最后两位）
    # PostgreSQL substring是1-based，ZTO-JCYB-20251230-01中01在第19-20位
    max_seq = db.query(
        func.max(
            func.cast(
                func.substring(Quote.quote_number, 19, 2),
                Integer
            )
        )
    ).filter(
        Quote.quote_number.like(f"ZTO-JCYB-{date_str}-%")
    ).scalar() or 0

    seq = max_seq + 1
    return f"ZTO-JCYB-{date_str}-{seq:02d}"


@router.get("/number/next", response_model=NextQuoteNumber)
def get_next_quote_number(
    quote_date: Optional[date] = Query(None, description="报价日期，默认今天"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取下一个报价单编号"""
    if not quote_date:
        quote_date = date.today()

    quote_number = generate_quote_number(db, quote_date)
    return {
        "quote_number": quote_number,
        "quote_date": quote_date
    }


@router.get("", response_model=List[QuoteListItem])
def list_quotes(
    skip: int = Query(0, ge=0, description="跳过的记录数"),
    limit: int = Query(100, ge=1, le=100, description="返回的记录数"),
    customer_name: Optional[str] = Query(None, description="客户名称搜索"),
    contact_phone: Optional[str] = Query(None, description="联系电话搜索"),
    status: Optional[QuoteStatus] = Query(None, description="状态筛选"),
    start_date: Optional[date] = Query(None, description="开始日期"),
    end_date: Optional[date] = Query(None, description="结束日期"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取报价单列表"""
    query = db.query(Quote)

    # 应用筛选条件
    if customer_name:
        query = query.filter(Quote.customer_name.ilike(f"%{customer_name}%"))
    if contact_phone:
        query = query.filter(Quote.contact_phone.ilike(f"%{contact_phone}%"))
    if status:
        query = query.filter(Quote.status == status)
    if start_date:
        query = query.filter(Quote.quote_date >= start_date)
    if end_date:
        query = query.filter(Quote.quote_date <= end_date)

    # 按创建时间倒序
    query = query.order_by(Quote.created_at.desc())

    # 分页
    quotes = query.offset(skip).limit(limit).all()
    return quotes


@router.post("", response_model=QuoteResponse, status_code=status.HTTP_201_CREATED)
def create_quote(
    quote_in: QuoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """创建报价单"""
    # 验证报价人存在
    quoter = db.query(Quoter).filter(Quoter.id == quote_in.quoter_id).first()
    if not quoter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="报价人不存在"
        )

    # 生成报价单编号
    quote_number = generate_quote_number(db, quote_in.quote_date)

    # 计算有效期
    expire_date = quote_in.quote_date + timedelta(days=quote_in.valid_days)

    # 创建报价单
    quote = Quote(
        quote_number=quote_number,
        customer_name=quote_in.customer_name,
        contact_person=quote_in.contact_person,
        contact_phone=quote_in.contact_phone,
        customer_address=quote_in.customer_address,
        daily_volume=quote_in.daily_volume,
        weight_range=quote_in.weight_range,
        product_type=quote_in.product_type,
        quoter_id=quote_in.quoter_id,
        quote_date=quote_in.quote_date,
        expire_date=expire_date,
        valid_days=quote_in.valid_days,
        is_tax_included=quote_in.is_tax_included,
        template_type=quote_in.template_type,
        price_data=quote_in.price_data,
        fixed_terms=quote_in.fixed_terms,
        optional_terms=quote_in.optional_terms,
        custom_terms=quote_in.custom_terms,
        remark=quote_in.remark,
        status=QuoteStatus.DRAFT
    )

    db.add(quote)
    db.commit()
    db.refresh(quote)
    return quote


@router.get("/{quote_id}", response_model=QuoteResponse)
def get_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取报价单详情"""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="报价单不存在"
        )
    return quote


@router.put("/{quote_id}", response_model=QuoteResponse)
def update_quote(
    quote_id: int,
    quote_in: QuoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """更新报价单"""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="报价单不存在"
        )

    # 验证报价人存在（如果要更新报价人）
    if quote_in.quoter_id:
        quoter = db.query(Quoter).filter(Quoter.id == quote_in.quoter_id).first()
        if not quoter:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="报价人不存在"
            )

    # 更新字段
    update_data = quote_in.model_dump(exclude_unset=True)

    # 如果修改了报价日期或有效天数，重新计算有效期
    if "quote_date" in update_data or "valid_days" in update_data:
        new_quote_date = update_data.get("quote_date", quote.quote_date)
        new_valid_days = update_data.get("valid_days", quote.valid_days)
        quote.expire_date = new_quote_date + timedelta(days=new_valid_days)

    for field, value in update_data.items():
        setattr(quote, field, value)

    db.commit()
    db.refresh(quote)
    return quote


@router.put("/{quote_id}/status", response_model=QuoteResponse)
def update_quote_status(
    quote_id: int,
    status_in: QuoteStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """更新报价单状态"""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="报价单不存在"
        )

    quote.status = status_in.status
    db.commit()
    db.refresh(quote)
    return quote


@router.post("/{quote_id}/copy", response_model=QuoteResponse, status_code=status.HTTP_201_CREATED)
def copy_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """复制报价单"""
    # 查找原报价单
    original_quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not original_quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="报价单不存在"
        )

    # 使用今天的日期生成新编号
    today = date.today()
    new_quote_number = generate_quote_number(db, today)

    # 创建新报价单（复制所有数据）
    new_quote = Quote(
        quote_number=new_quote_number,
        customer_name=original_quote.customer_name,
        contact_person=original_quote.contact_person,
        contact_phone=original_quote.contact_phone,
        customer_address=original_quote.customer_address,
        daily_volume=original_quote.daily_volume,
        weight_range=original_quote.weight_range,
        product_type=original_quote.product_type,
        quoter_id=original_quote.quoter_id,
        quote_date=today,
        expire_date=today + timedelta(days=original_quote.valid_days),
        valid_days=original_quote.valid_days,
        is_tax_included=original_quote.is_tax_included,
        template_type=original_quote.template_type,
        price_data=original_quote.price_data,
        fixed_terms=original_quote.fixed_terms,
        optional_terms=original_quote.optional_terms,
        custom_terms=original_quote.custom_terms,
        remark=original_quote.remark,
        status=QuoteStatus.DRAFT
    )

    db.add(new_quote)
    db.commit()
    db.refresh(new_quote)
    return new_quote


@router.delete("/{quote_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """删除报价单（物理删除）"""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="报价单不存在"
        )

    db.delete(quote)
    db.commit()
    return None
