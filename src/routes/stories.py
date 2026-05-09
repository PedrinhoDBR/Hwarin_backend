from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.db.database import get_db
from src.models.story import Story
from src.schemas.story import StoryResponse

router = APIRouter()


@router.get("/", response_model=List[StoryResponse])
def get_stories(db: Session = Depends(get_db)):
    return db.query(Story).all()

@router.get("/{story_id}", response_model=StoryResponse)
def get_story(story_id: int, db: Session = Depends(get_db)):
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    return story
    
@router.post("/", response_model=StoryResponse, status_code=201)
def create_story(story: StoryResponse, db: Session = Depends(get_db)):
    new_story = Story(title=story.title, content=story.content, author_id=story.author_id, language=story.language, status=story.status, cover=story.cover, master_story_id=story.master_story_id, subtitle=story.subtitle)
    db.add(new_story)
    db.commit()
    db.refresh(new_story)
    return new_story


@router.delete("/{story_id}", status_code=204)
def delete_story(story_id: int, db: Session = Depends(get_db)):
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    db.delete(story)
    db.commit()
    return None

@router.put("/{story_id}", response_model=StoryResponse)
def update_story(story_id: int, story: StoryResponse, db: Session = Depends(get_db)):
    existing_story = db.query(Story).filter(Story.id == story_id).first()
    if not existing_story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    existing_story.title = story.title
    existing_story.content = story.content
    existing_story.author_id = story.author_id
    existing_story.language = story.language
    existing_story.status = story.status
    existing_story.cover = story.cover
    existing_story.master_story_id = story.master_story_id
    existing_story.subtitle = story.subtitle
    
    db.commit()
    db.refresh(existing_story)
    return existing_story

# @router.get("/translations/{master_story_id}", response_model=List[StoryResponse])
