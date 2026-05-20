from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.db.database import get_db
from src.models.user import User
from src.models.user_follow import UserFollow
from src.schemas.user import (
    UserCreate,
    UserProfileUpdate,
    UserPublicResponse,
    UserResponse,
)
from src.utils.crypt_password import hash_password
from src.utils.user import get_current_user

router = APIRouter()


@router.get("/", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@router.get("/following", response_model=List[UserPublicResponse])
def get_followed_authors(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(User)
        .join(UserFollow, UserFollow.following_user_id == User.id)
        .filter(UserFollow.user_id == current_user.id)
        .order_by(User.username)
        .all()
    )


@router.put("/me", response_model=UserResponse)
def update_me(
    data: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if data.username is not None and data.username.strip():
        current_user.username = data.username.strip()

    if data.avatar_url is not None:
        current_user.avatar_url = data.avatar_url.strip() or None

    if data.bio is not None:
        current_user.bio = data.bio.strip() or None

    db.commit()
    db.refresh(current_user)

    return current_user


@router.get("/{user_id}/follow-status")
def get_follow_status(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    followers_count = (
        db.query(UserFollow)
        .filter(UserFollow.following_user_id == user_id)
        .count()
    )
    is_following = (
        db.query(UserFollow)
        .filter(
            UserFollow.user_id == current_user.id,
            UserFollow.following_user_id == user_id,
        )
        .first()
        is not None
    )

    return {
        "is_following": is_following,
        "followers_count": followers_count,
    }


@router.post("/{user_id}/follow", status_code=201)
def follow_author(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot follow yourself")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    existing = (
        db.query(UserFollow)
        .filter(
            UserFollow.user_id == current_user.id,
            UserFollow.following_user_id == user_id,
        )
        .first()
    )

    if existing:
        return {"message": "Author already followed"}

    db.add(UserFollow(user_id=current_user.id, following_user_id=user_id))
    db.commit()

    return {"message": "Author followed"}


@router.delete("/{user_id}/follow")
def unfollow_author(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    follow = (
        db.query(UserFollow)
        .filter(
            UserFollow.user_id == current_user.id,
            UserFollow.following_user_id == user_id,
        )
        .first()
    )

    if not follow:
        raise HTTPException(status_code=404, detail="Follow not found")

    db.delete(follow)
    db.commit()

    return {"message": "Author unfollowed"}


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=UserResponse, status_code=201)
def create_user(data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already in use")

    user = User(
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password),
        role=data.role or "user",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
