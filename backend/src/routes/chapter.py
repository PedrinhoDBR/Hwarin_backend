from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from models.chapter import Chapter
from schemas.chapter import (ChapterCreate,ChapterResponse,)

router = APIRouter()

@router.post("/",response_model=ChapterResponse,status_code=201,)
def create_chapter(chapter: ChapterCreate,db: Session = Depends(get_db),):
    new_chapter = Chapter(
        title=chapter.title,
        subtitle=chapter.subtitle,
        text=chapter.text,
        chapter_number=chapter.chapter_number,
        status=chapter.status,
        story_id=chapter.story_id,
    )

    db.add(new_chapter)
    db.commit()
    db.refresh(new_chapter)

    return new_chapter

@router.get("/story/{story_id}",response_model=list[ChapterResponse],)
def get_story_chapters(story_id: int,db: Session = Depends(get_db),):
    return (
        db.query(Chapter)
        .filter(Chapter.story_id == story_id)
        .order_by(Chapter.chapter_number)
        .all()
    )

@router.put("/{chapter_id}",response_model=ChapterResponse,)
def update_chapter(chapter_id: int,chapter: ChapterCreate,db: Session = Depends(get_db),):
    existing = (
        db.query(Chapter)
        .filter(Chapter.id == chapter_id)
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Chapter not found",
        )

    existing.title = chapter.title
    existing.subtitle = chapter.subtitle
    existing.text = chapter.text
    existing.chapter_number = chapter.chapter_number
    # existing.status = chapter.status

    db.commit()
    db.refresh(existing)

    return existing

@router.delete("/{chapter_id}")
def delete_chapter(chapter_id: int,db: Session = Depends(get_db),):
    existing = (
        db.query(Chapter)
        .filter(Chapter.id == chapter_id)
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Chapter not found",
        )

    db.delete(existing)
    db.commit()

    return {"message": "Chapter deleted"}
