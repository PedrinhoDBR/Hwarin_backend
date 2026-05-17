from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from src.db.database import get_db
from src.models.story import UserStory
from src.models.user import User
from src.models.story import Story
from src.schemas.story import UserStoryCreate, UserStoryResponse

router = APIRouter()


@router.get("/", response_model=List[UserStoryResponse])
def get_user_stories(db: Session = Depends(get_db)):
    return db.query(UserStory).all()


@router.get("/user/{user_id}", response_model=List[UserStoryResponse])
def get_stories_by_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return db.query(UserStory).filter(UserStory.user_id == user_id).all()


@router.get("/story/{story_id}", response_model=List[UserStoryResponse])
def get_users_by_story(story_id: int, db: Session = Depends(get_db)):
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    return db.query(UserStory).filter(UserStory.story_id == story_id).all()


@router.post("/", response_model=UserStoryResponse, status_code=201)
def create_user_story(data: UserStoryCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    story = db.query(Story).filter(Story.id == data.story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")

    existing = db.query(UserStory).filter(
        UserStory.user_id == data.user_id,
        UserStory.story_id == data.story_id,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="User already linked to this story")

    entry = UserStory(**data.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{user_story_id}", status_code=204)
def delete_user_story(user_story_id: int, db: Session = Depends(get_db)):
    entry = db.query(UserStory).filter(UserStory.id == user_story_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="UserStory not found")
    db.delete(entry)
    db.commit()