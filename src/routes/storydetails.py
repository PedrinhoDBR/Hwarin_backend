from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from src.db.database import get_db
from src.models.story import Story, StoryGender, StoryRating, StorySuggestion, StoryInfo
from src.models.user import User
from src.schemas.story import (
    StoryGenderCreate, StoryGenderResponse,
    StoryRatingCreate, StoryRatingResponse,
    StorySuggestionCreate, StorySuggestionResponse,
    StoryInfoCreate, StoryInfoResponse,
)


# ── StoryGender ──────────────────────────────────────────────────────────────

gender_router = APIRouter()


@gender_router.get("/", response_model=List[StoryGenderResponse])
def get_genders(db: Session = Depends(get_db)):
    return db.query(StoryGender).all()


@gender_router.get("/story/{story_id}", response_model=List[StoryGenderResponse])
def get_genders_by_story(story_id: int, db: Session = Depends(get_db)):
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    return db.query(StoryGender).filter(StoryGender.story_id == story_id).all()


@gender_router.post("/", response_model=StoryGenderResponse, status_code=201)
def create_gender(data: StoryGenderCreate, db: Session = Depends(get_db)):
    story = db.query(Story).filter(Story.id == data.story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    entry = StoryGender(**data.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@gender_router.delete("/{gender_id}", status_code=204)
def delete_gender(gender_id: int, db: Session = Depends(get_db)):
    entry = db.query(StoryGender).filter(StoryGender.id == gender_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="StoryGender not found")
    db.delete(entry)
    db.commit()


# ── StoryRating ──────────────────────────────────────────────────────────────

rating_router = APIRouter()


@rating_router.get("/story/{story_id}", response_model=List[StoryRatingResponse])
def get_ratings_by_story(story_id: int, db: Session = Depends(get_db)):
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    return db.query(StoryRating).filter(StoryRating.story_id == story_id).all()


@rating_router.get("/user/{user_id}", response_model=List[StoryRatingResponse])
def get_ratings_by_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return db.query(StoryRating).filter(StoryRating.user_id == user_id).all()


@rating_router.post("/", response_model=StoryRatingResponse, status_code=201)
def create_rating(data: StoryRatingCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    story = db.query(Story).filter(Story.id == data.story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")

    existing = db.query(StoryRating).filter(
        StoryRating.user_id == data.user_id,
        StoryRating.story_id == data.story_id,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Rating already exists for this user/story")

    entry = StoryRating(**data.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@rating_router.patch("/{user_id}/{story_id}", response_model=StoryRatingResponse)
def update_rating(user_id: int, story_id: int, value: int, db: Session = Depends(get_db),
                  description: str = None):
    entry = db.query(StoryRating).filter(
        StoryRating.user_id == user_id,
        StoryRating.story_id == story_id,
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Rating not found")
    entry.value = value
    if description is not None:
        entry.description = description
    db.commit()
    db.refresh(entry)
    return entry


@rating_router.delete("/{user_id}/{story_id}", status_code=204)
def delete_rating(user_id: int, story_id: int, db: Session = Depends(get_db)):
    entry = db.query(StoryRating).filter(
        StoryRating.user_id == user_id,
        StoryRating.story_id == story_id,
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Rating not found")
    db.delete(entry)
    db.commit()


# ── StorySuggestion ──────────────────────────────────────────────────────────

suggestion_router = APIRouter()


@suggestion_router.get("/story/{story_id}", response_model=List[StorySuggestionResponse])
def get_suggestions_by_story(story_id: int, db: Session = Depends(get_db)):
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    return db.query(StorySuggestion).filter(StorySuggestion.story_id == story_id).all()


@suggestion_router.post("/", response_model=StorySuggestionResponse, status_code=201)
def create_suggestion(data: StorySuggestionCreate, db: Session = Depends(get_db)):
    story = db.query(Story).filter(Story.id == data.story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    entry = StorySuggestion(**data.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@suggestion_router.delete("/{suggestion_id}", status_code=204)
def delete_suggestion(suggestion_id: int, db: Session = Depends(get_db)):
    entry = db.query(StorySuggestion).filter(StorySuggestion.id == suggestion_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    db.delete(entry)
    db.commit()


# ── StoryInfo ────────────────────────────────────────────────────────────────

info_router = APIRouter()


@info_router.get("/story/{story_id}", response_model=List[StoryInfoResponse])
def get_infos_by_story(story_id: int, db: Session = Depends(get_db)):
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    return db.query(StoryInfo).filter(StoryInfo.story_id == story_id).all()


@info_router.post("/", response_model=StoryInfoResponse, status_code=201)
def create_info(data: StoryInfoCreate, db: Session = Depends(get_db)):
    story = db.query(Story).filter(Story.id == data.story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    entry = StoryInfo(**data.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@info_router.patch("/{info_id}", response_model=StoryInfoResponse)
def update_info(info_id: int, data: StoryInfoCreate, db: Session = Depends(get_db)):
    entry = db.query(StoryInfo).filter(StoryInfo.id == info_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="StoryInfo not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(entry, field, value)
    db.commit()
    db.refresh(entry)
    return entry


@info_router.delete("/{info_id}", status_code=204)
def delete_info(info_id: int, db: Session = Depends(get_db)):
    entry = db.query(StoryInfo).filter(StoryInfo.id == info_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="StoryInfo not found")
    db.delete(entry)
    db.commit()