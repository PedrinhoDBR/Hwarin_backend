from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.db.database import get_db
from src.models.user import User
from src.schemas.auth import LoginRequest, LoginResponse
from src.utils.jwt import create_access_token

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not user.validate_password(data.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token, expires_in = create_access_token(
        user_id=user.id,
        email=user.email,
        role=user.role,
    )

    return LoginResponse(
        message="Login successful",
        user=user,
        token=access_token,
        accessToken=access_token,
        expires_in=expires_in,
    )
