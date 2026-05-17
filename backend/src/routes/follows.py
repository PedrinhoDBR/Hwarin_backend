from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.db.database import get_db

from src.models.user_story import UserStory
from src.models.user import User

from src.utils.user import get_current_user

router = APIRouter()

@router.get("")
def get_story_follows(
    story_id: int,
    db: Session = Depends(get_db),
):
    follows = (
        db.query(UserStory)
        .filter(
            UserStory.story_id == story_id,
            UserStory.role == "follow"
        )
        .all()
    )

    return follows


@router.post("")
def follow_story(
    story_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = (
        db.query(UserStory)
        .filter(
            UserStory.story_id == story_id,
            UserStory.user_id == current_user.id,
            UserStory.role == "follow",
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Você já segue essa história",
        )

    follow = UserStory(
        user_id=current_user.id,
        story_id=story_id,
        role="follow",
    )

    db.add(follow)

    db.commit()

    return {
        "message": "História seguida",
    }


@router.delete("/{story_id}")
def unfollow_story(
    story_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    follow = (
        db.query(UserStory)
        .filter(
            UserStory.story_id == story_id,
            UserStory.user_id == current_user.id,
            UserStory.role == "follow",
        )
        .first()
    )

    if not follow:
        raise HTTPException(
            status_code=404,
            detail="Follow não encontrado",
        )

    db.delete(follow)

    db.commit()

    return {
        "message": "História removida dos follows",
    }