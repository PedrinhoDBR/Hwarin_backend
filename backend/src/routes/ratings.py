from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.db.database import get_db

from src.models.story_rating import StoryRating
from src.models.user import User

from src.utils.user import get_current_user

router = APIRouter()

@router.get("")
def get_story_ratings(
    story_id: int,
    db: Session = Depends(get_db),
):
    ratings = (
        db.query(StoryRating)
        .filter(StoryRating.story_id == story_id)
        .all()
    )

    return ratings


@router.get("/comments")
def get_story_comments(
    story_id: int,
    db: Session = Depends(get_db),
):
    comments = (
        db.query(StoryRating)
        .filter(
            StoryRating.story_id == story_id,
            StoryRating.description.isnot(None),
            StoryRating.description != "",
        )
        .all()
    )

    return comments

@router.post("")
def create_or_update_rating(
    story_id: int,
    value: int,
    description: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if value < 1 or value > 5:
        raise HTTPException(
            status_code=400,
            detail="A nota deve ser entre 1 e 5",
        )

    rating = (
        db.query(StoryRating)
        .filter(
            StoryRating.story_id == story_id,
            StoryRating.user_id == current_user.id,
        )
        .first()
    )

    if rating:
        rating.value = value
        rating.description = description
    else:
        rating = StoryRating(
            user_id=current_user.id,
            story_id=story_id,
            value=value,
            description=description,
        )

        db.add(rating)

    db.commit()

    return {
        "message": "Avaliação salva",
    }

@router.delete("/{story_id}")
def delete_rating(
    story_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rating = (
        db.query(StoryRating)
        .filter(
            StoryRating.story_id == story_id,
            StoryRating.user_id == current_user.id,
        )
        .first()
    )

    if not rating:
        raise HTTPException(
            status_code=404,
            detail="Avaliação não encontrada",
        )

    db.delete(rating)

    db.commit()

    return {
        "message": "Avaliação removida",
    }