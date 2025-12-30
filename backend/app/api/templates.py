"""
价格模板管理API
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.template import Template, TemplateType
from app.models.user import User
from app.schemas.template import TemplateCreate, TemplateUpdate, TemplateResponse
from app.api.auth import get_current_user

router = APIRouter(prefix="/api/v1/templates", tags=["模板管理"])


@router.get("", response_model=List[TemplateResponse])
def list_templates(
    skip: int = Query(0, ge=0, description="跳过的记录数"),
    limit: int = Query(100, ge=1, le=100, description="返回的记录数"),
    template_type: Optional[TemplateType] = Query(None, description="模板类型筛选"),
    is_active: Optional[bool] = Query(True, description="是否激活"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取模板列表"""
    query = db.query(Template)

    # 应用筛选条件
    if template_type:
        query = query.filter(Template.template_type == template_type)
    if is_active is not None:
        query = query.filter(Template.is_active == is_active)

    # 按创建时间倒序
    query = query.order_by(Template.created_at.desc())

    # 分页
    templates = query.offset(skip).limit(limit).all()
    return templates


@router.post("", response_model=TemplateResponse, status_code=status.HTTP_201_CREATED)
def create_template(
    template_in: TemplateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """创建模板"""
    # 如果设置为默认，先取消同类型其他模板的默认状态
    if template_in.is_default:
        db.query(Template).filter(
            Template.template_type == template_in.template_type
        ).update({"is_default": False})

    # 创建模板
    template = Template(
        name=template_in.name,
        template_type=template_in.template_type,
        description=template_in.description,
        template_data=template_in.template_data,
        is_default=template_in.is_default,
        is_active=template_in.is_active
    )

    db.add(template)
    db.commit()
    db.refresh(template)
    return template


@router.get("/{template_id}", response_model=TemplateResponse)
def get_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取模板详情"""
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="模板不存在"
        )
    return template


@router.put("/{template_id}", response_model=TemplateResponse)
def update_template(
    template_id: int,
    template_in: TemplateUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """更新模板"""
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="模板不存在"
        )

    # 如果设置为默认，先取消同类型其他模板的默认状态
    if template_in.is_default and template_in.is_default != template.is_default:
        db.query(Template).filter(
            Template.template_type == template.template_type,
            Template.id != template_id
        ).update({"is_default": False})

    # 更新字段
    update_data = template_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(template, field, value)

    db.commit()
    db.refresh(template)
    return template


@router.put("/{template_id}/default", response_model=TemplateResponse)
def set_default_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """设置默认模板"""
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="模板不存在"
        )

    # 取消同类型所有模板的默认状态
    db.query(Template).filter(
        Template.template_type == template.template_type
    ).update({"is_default": False})

    # 设置当前模板为默认
    template.is_default = True

    db.commit()
    db.refresh(template)
    return template


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """删除模板（逻辑删除，设置is_active=False）"""
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="模板不存在"
        )

    # 如果是默认模板，不允许删除
    if template.is_default:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="不能删除默认模板，请先设置其他模板为默认"
        )

    # 逻辑删除
    template.is_active = False

    db.commit()
    return None
