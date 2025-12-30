"""
数据库模型
"""
from app.models.base import BaseModel
from app.models.user import User, UserRole
from app.models.quoter import Quoter
from app.models.province import Province
from app.models.term import FixedTerm, OptionalTerm
from app.models.template import Template, TemplateType
from app.models.quote import Quote, QuoteExport, QuoteStatus

__all__ = [
    "BaseModel",
    "User",
    "UserRole",
    "Quoter",
    "Province",
    "FixedTerm",
    "OptionalTerm",
    "Template",
    "TemplateType",
    "Quote",
    "QuoteExport",
    "QuoteStatus",
]
