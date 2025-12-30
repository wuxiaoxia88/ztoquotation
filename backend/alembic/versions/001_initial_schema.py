"""Initial database schema

Revision ID: 001
Revises:
Create Date: 2025-12-30

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 创建用户表
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False, comment='主键ID'),
        sa.Column('username', sa.String(length=50), nullable=False, comment='用户名'),
        sa.Column('hashed_password', sa.String(length=255), nullable=False, comment='密码哈希'),
        sa.Column('email', sa.String(length=100), nullable=True, comment='邮箱'),
        sa.Column('full_name', sa.String(length=50), nullable=True, comment='姓名'),
        sa.Column('role', sa.Enum('ADMIN', 'OPERATOR', name='userrole'), nullable=False, comment='角色'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true', comment='是否激活'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'), comment='创建时间'),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'), comment='更新时间'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'])
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # 创建报价人表
    op.create_table(
        'quoters',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False, comment='主键ID'),
        sa.Column('name', sa.String(length=50), nullable=False, comment='姓名'),
        sa.Column('phone', sa.String(length=20), nullable=False, comment='电话'),
        sa.Column('email', sa.String(length=100), nullable=True, comment='邮箱'),
        sa.Column('position', sa.String(length=50), nullable=True, comment='职位'),
        sa.Column('is_default', sa.Boolean(), nullable=False, server_default='false', comment='是否默认'),
        sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0', comment='排序序号'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'), comment='创建时间'),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'), comment='更新时间'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_quoters_id'), 'quoters', ['id'])

    # 创建省份表
    op.create_table(
        'provinces',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False, comment='主键ID'),
        sa.Column('name', sa.String(length=50), nullable=False, comment='省份名称'),
        sa.Column('region_id', sa.Integer(), nullable=False, comment='区域ID(1-6)'),
        sa.Column('region_name', sa.String(length=20), nullable=False, comment='区域名称'),
        sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0', comment='排序序号'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'), comment='创建时间'),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'), comment='更新时间'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_provinces_id'), 'provinces', ['id'])
    op.create_index(op.f('ix_provinces_name'), 'provinces', ['name'], unique=True)

    # 创建固定条款表
    op.create_table(
        'fixed_terms',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False, comment='主键ID'),
        sa.Column('title', sa.String(length=100), nullable=False, comment='标题'),
        sa.Column('content', sa.Text(), nullable=False, comment='内容'),
        sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0', comment='排序序号'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'), comment='创建时间'),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'), comment='更新时间'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_fixed_terms_id'), 'fixed_terms', ['id'])

    # 创建非固定条款表
    op.create_table(
        'optional_terms',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False, comment='主键ID'),
        sa.Column('title', sa.String(length=100), nullable=False, comment='标题'),
        sa.Column('content', sa.Text(), nullable=False, comment='内容'),
        sa.Column('is_default', sa.Boolean(), nullable=False, server_default='false', comment='是否默认选中'),
        sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0', comment='排序序号'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'), comment='创建时间'),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'), comment='更新时间'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_optional_terms_id'), 'optional_terms', ['id'])

    # 创建价格模板表
    op.create_table(
        'templates',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False, comment='主键ID'),
        sa.Column('name', sa.String(length=100), nullable=False, comment='模板名称'),
        sa.Column('template_type', sa.Enum('TONGPIAO', 'DAKEHU', 'CANGPEI', name='templatetype'), nullable=False, comment='模板类型'),
        sa.Column('description', sa.Text(), nullable=True, comment='描述'),
        sa.Column('template_data', postgresql.JSONB(astext_type=sa.Text()), nullable=False, comment='模板数据(JSONB)'),
        sa.Column('is_default', sa.Boolean(), nullable=False, server_default='false', comment='是否默认'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true', comment='是否激活'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'), comment='创建时间'),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'), comment='更新时间'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_templates_id'), 'templates', ['id'])

    # 创建报价单表
    op.create_table(
        'quotes',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False, comment='主键ID'),
        sa.Column('quote_number', sa.String(length=50), nullable=False, comment='报价单编号'),
        sa.Column('customer_name', sa.String(length=100), nullable=False, comment='客户公司名称'),
        sa.Column('contact_person', sa.String(length=50), nullable=False, comment='联系人'),
        sa.Column('contact_phone', sa.String(length=20), nullable=False, comment='联系电话'),
        sa.Column('customer_address', sa.String(length=255), nullable=True, comment='客户地址'),
        sa.Column('daily_volume', sa.String(length=50), nullable=True, comment='日均发货量'),
        sa.Column('weight_range', sa.String(length=50), nullable=True, comment='重量段'),
        sa.Column('product_type', sa.String(length=50), nullable=True, comment='产品类型'),
        sa.Column('quoter_id', sa.Integer(), nullable=False, comment='报价人ID'),
        sa.Column('quote_date', sa.Date(), nullable=False, comment='报价日期'),
        sa.Column('valid_days', sa.Integer(), nullable=False, server_default='30', comment='有效期(天)'),
        sa.Column('expire_date', sa.Date(), nullable=False, comment='到期日期'),
        sa.Column('template_type', sa.String(length=20), nullable=False, comment='价格模板类型'),
        sa.Column('price_data', postgresql.JSONB(astext_type=sa.Text()), nullable=False, comment='价格数据(JSONB)'),
        sa.Column('fixed_terms', postgresql.JSONB(astext_type=sa.Text()), nullable=True, comment='固定条款'),
        sa.Column('optional_terms', postgresql.JSONB(astext_type=sa.Text()), nullable=True, comment='非固定条款'),
        sa.Column('custom_terms', postgresql.JSONB(astext_type=sa.Text()), nullable=True, comment='自定义条款'),
        sa.Column('is_tax_included', sa.Boolean(), nullable=False, server_default='true', comment='是否含税'),
        sa.Column('remark', sa.Text(), nullable=True, comment='备注'),
        sa.Column('status', sa.Enum('DRAFT', 'SENT', 'CONFIRMED', 'EXPIRED', name='quotestatus'), nullable=False, server_default='DRAFT', comment='状态'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'), comment='创建时间'),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'), comment='更新时间'),
        sa.ForeignKeyConstraint(['quoter_id'], ['quoters.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_quotes_id'), 'quotes', ['id'])
    op.create_index(op.f('ix_quotes_quote_number'), 'quotes', ['quote_number'], unique=True)

    # 创建报价导出记录表
    op.create_table(
        'quote_exports',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False, comment='主键ID'),
        sa.Column('quote_id', sa.Integer(), nullable=False, comment='报价单ID'),
        sa.Column('export_format', sa.String(length=20), nullable=False, comment='导出格式(pdf/excel/word)'),
        sa.Column('file_path', sa.String(length=255), nullable=False, comment='文件路径'),
        sa.Column('file_size', sa.Integer(), nullable=True, comment='文件大小(字节)'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'), comment='创建时间'),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'), comment='更新时间'),
        sa.ForeignKeyConstraint(['quote_id'], ['quotes.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_quote_exports_id'), 'quote_exports', ['id'])


def downgrade() -> None:
    op.drop_table('quote_exports')
    op.drop_table('quotes')
    op.drop_table('templates')
    op.drop_table('optional_terms')
    op.drop_table('fixed_terms')
    op.drop_table('provinces')
    op.drop_table('quoters')
    op.drop_table('users')
