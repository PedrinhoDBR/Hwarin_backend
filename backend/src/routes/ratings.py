from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload

from src.db.database import get_db
from src.models.story_rating import StoryRating
from src.models.user import User
from src.utils.user import get_current_user

router = APIRouter()


class RatingPayload(BaseModel):
    story_id: int
    value: int
    description: str | None = None


def _serialize_rating(rating: StoryRating):
    username = rating.user.username if rating.user else "Anonimo"

    return {
        "id": f"{rating.story_id}-{rating.user_id}",
        "story_id": rating.story_id,
        "user_id": rating.user_id,
        "value": rating.value,
        "description": rating.description,
        "content": rating.description,
        "author_name": username,
        "author_avatar": rating.user.avatar_url if rating.user else None,
    }


@router.get("")
def get_story_ratings(
    story_id: int,
    db: Session = Depends(get_db),
):
    ratings = (
        db.query(StoryRating)
        .options(joinedload(StoryRating.user))
        .filter(StoryRating.story_id == story_id)
        .all()
    )

    return [_serialize_rating(rating) for rating in ratings]


@router.get("/comments")
def get_story_comments(
    story_id: int,
    db: Session = Depends(get_db),
):
    comments = (
        db.query(StoryRating)
        .options(joinedload(StoryRating.user))
        .filter(
            StoryRating.story_id == story_id,
            StoryRating.description.isnot(None),
            StoryRating.description != "",
        )
        .all()
    )

    return [_serialize_rating(comment) for comment in comments]


@router.post("")
def create_or_update_rating(
    payload: RatingPayload | None = Body(default=None),
    story_id_query: int | None = Query(default=None, alias="story_id"),
    value_query: int | None = Query(default=None, alias="value"),
    description_query: str | None = Query(default=None, alias="description"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    story_id = payload.story_id if payload else story_id_query
    value = payload.value if payload else value_query
    description = payload.description if payload else description_query

    if story_id is None or value is None:
        raise HTTPException(
            status_code=400,
            detail="Informe a historia e a nota",
        )

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
    db.refresh(rating)

    return _serialize_rating(rating)


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
            detail="Avaliacao nao encontrada",
        )

    db.delete(rating)
    db.commit()

    return {
        "message": "Avaliacao removida",
    }
