from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional
from models.user_story import UserStory
from db.database import get_db
from models.story import Story
from schemas.story import StoryResponse,StoryCreate
from utils.user import get_current_user
from models.user import User

router = APIRouter()



@router.get("/", response_model=List[StoryResponse])
def get_stories(db: Session = Depends(get_db)):
    return db.query(Story).all()

@router.get("/me",response_model=List[StoryResponse])
def get_my_stories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    print('tentando pegar histórias do usuário:', current_user.username)
    stories = (
        db.query(Story)
        .join(UserStory)
        .filter(UserStory.user_id == current_user.id)
        .all()
    )

    return stories

@router.get("/{story_id}", response_model=StoryResponse)
def get_story(story_id: int, db: Session = Depends(get_db)):
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    return story
    

@router.post(
    "",
    response_model=StoryResponse,
    status_code=201
)
def create_story(
    story: StoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    print(f"Usuário autenticado: {current_user.username}")  
    new_story = Story(
        title=story.title,
        subtitle=story.subtitle,
        synopsis=story.synopsis,
        language=story.language,
        status=story.status,
        cover=story.cover,
        master_story_id=story.master_story_id,
    )

    db.add(new_story)

    db.flush()

    user_story = UserStory(
        user_id=current_user.id,
        story_id=new_story.id,
        role="autor",
    )

    db.add(user_story)

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
def update_story(
    story_id: int,
    story: StoryCreate,
    db: Session = Depends(get_db)
):
    existing_story = (
        db.query(Story)
        .filter(Story.id == story_id)
        .first()
    )

    if not existing_story:
        raise HTTPException(
            status_code=404,
            detail="Story not found"
        )

    existing_story.title = story.title
    existing_story.subtitle = story.subtitle
    existing_story.synopsis = story.synopsis
    existing_story.language = story.language
    existing_story.status = story.status
    existing_story.cover = story.cover
    existing_story.master_story_id = story.master_story_id

    db.commit()
    db.refresh(existing_story)

    return existing_story

# @router.get("/translations/{master_story_id}", response_model=List[StoryResponse])
