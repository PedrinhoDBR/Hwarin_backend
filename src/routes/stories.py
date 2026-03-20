from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from src.db.database import get_db
from src.models.story import Story
from src.schemas.story import StoryResponse

router = APIRouter()


@router.get("/", response_model=List[StoryResponse])
def get_stories(db: Session = Depends(get_db)):
    return db.query(Story).all()
