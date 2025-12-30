#!/usr/bin/env python3
"""
初始化数据脚本
导入省份、区域、固定条款、非固定条款等基础数据
"""
import sys
from pathlib import Path

# 添加项目路径
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal
from app.models import Province, FixedTerm, OptionalTerm, User, Quoter
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def init_provinces(db):
    """初始化省份和区域数据"""
    provinces_data = [
        # 1区
        ("江苏", 1, "1区"),
        ("浙江", 1, "1区"),
        ("安徽", 1, "1区"),
        ("上海", 1, "1区"),
        # 2区
        ("北京", 2, "2区"),
        ("天津", 2, "2区"),
        ("河北", 2, "2区"),
        ("山东", 2, "2区"),
        ("河南", 2, "2区"),
        # 3区
        ("湖南", 3, "3区"),
        ("湖北", 3, "3区"),
        ("江西", 3, "3区"),
        ("广东", 3, "3区"),
        ("福建", 3, "3区"),
        ("广西", 3, "3区"),
        ("海南", 3, "3区"),
        # 4区
        ("四川", 4, "4区"),
        ("重庆", 4, "4区"),
        ("云南", 4, "4区"),
        ("贵州", 4, "4区"),
        ("陕西", 4, "4区"),
        ("山西", 4, "4区"),
        ("甘肃", 4, "4区"),
        ("宁夏", 4, "4区"),
        # 5区
        ("辽宁", 5, "5区"),
        ("吉林", 5, "5区"),
        ("黑龙江", 5, "5区"),
        ("内蒙古", 5, "5区"),
        # 6区
        ("新疆", 6, "6区"),
        ("西藏", 6, "6区"),
        ("青海", 6, "6区"),
        ("香港", 6, "6区"),
        ("澳门", 6, "6区"),
        ("台湾", 6, "6区"),
    ]

    count = 0
    for idx, (name, region_id, region_name) in enumerate(provinces_data, 1):
        existing = db.query(Province).filter(Province.name == name).first()
        if not existing:
            province = Province(
                name=name,
                region_id=region_id,
                region_name=region_name,
                sort_order=idx
            )
            db.add(province)
            count += 1

    db.commit()
    print(f"✅ 省份数据初始化完成: {count}条新增, {len(provinces_data) - count}条已存在")


def init_fixed_terms(db):
    """初始化固定条款"""
    fixed_terms_data = [
        ("到付方式", "目的地付款,收货方付款后提货,货款及运费由收货方承担。"),
        ("回单要求", "收货方签收后,原始运单返回寄件方存档。"),
        ("包装要求", "寄件方需按照快递包装规范进行包装,易碎品需做好防护标识。"),
        ("保价说明", "未保价货物按快递行业标准赔付,建议贵重物品选择保价服务。"),
    ]

    count = 0
    for idx, (title, content) in enumerate(fixed_terms_data, 1):
        existing = db.query(FixedTerm).filter(FixedTerm.title == title).first()
        if not existing:
            term = FixedTerm(
                title=title,
                content=content,
                sort_order=idx
            )
            db.add(term)
            count += 1

    db.commit()
    print(f"✅ 固定条款初始化完成: {count}条新增, {len(fixed_terms_data) - count}条已存在")


def init_optional_terms(db):
    """初始化非固定条款"""
    optional_terms_data = [
        ("超重加收", "单票重量超过100KG,每KG加收0.5元", True),
        ("偏远附加费", "偏远地区加收每票10元附加费", False),
        ("上楼费用", "如需送货上楼,按楼层收取上楼费", False),
        ("夜间配送", "18:00-22:00配送加收5元/票", False),
        ("节假日配送", "节假日配送加收10元/票", False),
        ("签回单服务", "需签回单加收2元/票", True),
        ("代收货款", "代收货款服务费按货款金额1%收取,最低5元", False),
    ]

    count = 0
    for idx, (title, content, is_default) in enumerate(optional_terms_data, 1):
        existing = db.query(OptionalTerm).filter(OptionalTerm.title == title).first()
        if not existing:
            term = OptionalTerm(
                title=title,
                content=content,
                is_default=is_default,
                sort_order=idx
            )
            db.add(term)
            count += 1

    db.commit()
    print(f"✅ 非固定条款初始化完成: {count}条新增, {len(optional_terms_data) - count}条已存在")


def init_admin_user(db):
    """初始化管理员账号"""
    existing = db.query(User).filter(User.username == "admin").first()
    if not existing:
        admin = User(
            username="admin",
            hashed_password=pwd_context.hash("admin123"),
            email="admin@ztoquote.com",
            full_name="系统管理员",
            role="ADMIN",
            is_active=True
        )
        db.add(admin)
        db.commit()
        print("✅ 管理员账号创建成功 (username: admin, password: admin123)")
    else:
        print("✅ 管理员账号已存在")


def init_default_quoter(db):
    """初始化默认报价人"""
    existing = db.query(Quoter).filter(Quoter.name == "范云飞").first()
    if not existing:
        quoter = Quoter(
            name="范云飞",
            phone="13800138000",
            email="fanyunfei@ztoquote.com",
            position="业务经理",
            is_default=True,
            sort_order=1
        )
        db.add(quoter)
        db.commit()
        print("✅ 默认报价人创建成功 (范云飞)")
    else:
        print("✅ 默认报价人已存在")


def main():
    """主函数"""
    print("=" * 60)
    print("开始初始化数据...")
    print("=" * 60)
    print()

    db = SessionLocal()

    try:
        init_provinces(db)
        init_fixed_terms(db)
        init_optional_terms(db)
        init_admin_user(db)
        init_default_quoter(db)

        print()
        print("=" * 60)
        print("🎉 数据初始化全部完成!")
        print("=" * 60)
        print()
        print("初始化数据汇总:")
        print(f"  - 省份数据: {db.query(Province).count()}条")
        print(f"  - 固定条款: {db.query(FixedTerm).count()}条")
        print(f"  - 非固定条款: {db.query(OptionalTerm).count()}条")
        print(f"  - 系统用户: {db.query(User).count()}个")
        print(f"  - 报价人: {db.query(Quoter).count()}个")
        print()
        print("默认登录信息:")
        print("  用户名: admin")
        print("  密码: admin123")
        print()

    except Exception as e:
        print(f"❌ 数据初始化失败: {e}")
        db.rollback()
        return False
    finally:
        db.close()

    return True


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
