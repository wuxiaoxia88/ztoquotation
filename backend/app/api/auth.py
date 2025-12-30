"""
认证API
登录、获取当前用户、修改密码
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import LoginRequest, Token, UserResponse, UserPasswordUpdate
from app.utils.security import verify_password, create_access_token, decode_access_token, get_password_hash

router = APIRouter(prefix="/api/v1/auth", tags=["认证"])

# OAuth2密码模式
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """获取当前登录用户"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无法验证凭据",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    username: str = payload.get("sub")
    if username is None:
        raise credentials_exception

    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(status_code=400, detail="用户已被禁用")

    return user


async def get_current_active_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """获取当前管理员用户"""
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="权限不足")
    return current_user


@router.post("/login", response_model=Token, summary="用户登录")
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    用户登录,返回JWT令牌

    - **username**: 用户名
    - **password**: 密码
    """
    user = db.query(User).filter(User.username == login_data.username).first()

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(status_code=400, detail="用户已被禁用")

    # 创建访问令牌
    access_token = create_access_token(data={"sub": user.username})

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse, summary="获取当前用户信息")
async def get_me(current_user: User = Depends(get_current_user)):
    """获取当前登录用户的信息"""
    return current_user


@router.put("/password", summary="修改密码")
async def change_password(
    password_data: UserPasswordUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    修改当前用户密码

    - **old_password**: 旧密码
    - **new_password**: 新密码
    """
    # 验证旧密码
    if not verify_password(password_data.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="旧密码错误")

    # 更新密码
    current_user.hashed_password = get_password_hash(password_data.new_password)
    db.commit()

    return {"message": "密码修改成功"}
