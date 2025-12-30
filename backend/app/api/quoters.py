"""
报价人管理API
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.quoter import Quoter
from app.models.user import User
from app.schemas.quoter import QuoterCreate, QuoterUpdate, QuoterResponse
from app.api.auth import get_current_user

router = APIRouter(prefix="/api/v1/quoters", tags=["报价人管理"])


@router.get("", response_model=List[QuoterResponse])
def list_quoters(
    skip: int = Query(0, ge=0, description="跳过的记录数"),
    limit: int = Query(100, ge=1, le=100, description="返回的记录数"),
    name: Optional[str] = Query(None, description="姓名搜索"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取报价人列表"""
    query = db.query(Quoter)

    # 应用筛选条件
    if name:
        query = query.filter(Quoter.name.ilike(f"%{name}%"))

    # 按sort_order和创建时间排序
    query = query.order_by(Quoter.sort_order, Quoter.created_at)

    # 分页
    quoters = query.offset(skip).limit(limit).all()
    return quoters


@router.post("", response_model=QuoterResponse, status_code=status.HTTP_201_CREATED)
def create_quoter(
    quoter_in: QuoterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """创建报价人"""
    # 如果设置为默认，先取消其他报价人的默认状态
    if quoter_in.is_default:
        db.query(Quoter).update({"is_default": False})

    # 创建报价人
    quoter = Quoter(
        name=quoter_in.name,
        phone=quoter_in.phone,
        email=quoter_in.email,
        position=quoter_in.position,
        sort_order=quoter_in.sort_order,
        is_default=quoter_in.is_default
    )

    db.add(quoter)
    db.commit()
    db.refresh(quoter)
    return quoter


@router.get("/{quoter_id}", response_model=QuoterResponse)
def get_quoter(
    quoter_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取报价人详情"""
    quoter = db.query(Quoter).filter(Quoter.id == quoter_id).first()
    if not quoter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="报价人不存在"
        )
    return quoter


@router.put("/{quoter_id}", response_model=QuoterResponse)
def update_quoter(
    quoter_id: int,
    quoter_in: QuoterUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """更新报价人"""
    quoter = db.query(Quoter).filter(Quoter.id == quoter_id).first()
    if not quoter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="报价人不存在"
        )

    # 如果设置为默认，先取消其他报价人的默认状态
    if quoter_in.is_default and quoter_in.is_default != quoter.is_default:
        db.query(Quoter).filter(Quoter.id != quoter_id).update({"is_default": False})

    # 更新字段
    update_data = quoter_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(quoter, field, value)

    db.commit()
    db.refresh(quoter)
    return quoter


@router.put("/{quoter_id}/default", response_model=QuoterResponse)
def set_default_quoter(
    quoter_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """设置默认报价人"""
    quoter = db.query(Quoter).filter(Quoter.id == quoter_id).first()
    if not quoter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="报价人不存在"
        )

    # 取消所有报价人的默认状态
    db.query(Quoter).update({"is_default": False})

    # 设置当前报价人为默认
    quoter.is_default = True

    db.commit()
    db.refresh(quoter)
    return quoter


@router.delete("/{quoter_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quoter(
    quoter_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """删除报价人"""
    quoter = db.query(Quoter).filter(Quoter.id == quoter_id).first()
    if not quoter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="报价人不存在"
        )

    # 如果是默认报价人，不允许删除
    if quoter.is_default:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="不能删除默认报价人，请先设置其他报价人为默认"
        )

    db.delete(quoter)
    db.commit()
    return None
