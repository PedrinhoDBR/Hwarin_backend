from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session
from typing import List, Optional
from src.models.user_story import UserStory
from src.db.database import get_db
from src.models.story import Story
from src.models.story_filter import StoryFilter
from src.schemas.story import StoryResponse,StoryCreate
from src.utils.user import get_current_user
from src.models.user import User

router = APIRouter()

GENRE_FILTER_TYPES = ("genre", "genres", "genero", "generos", "gênero", "gêneros")
TAG_FILTER_TYPES = ("tag", "tags")


def _clean_values(values: List[str]) -> List[str]:
    cleaned = []
    seen = set()

    for value in values or []:
        normalized = value.strip()
        key = normalized.casefold()

        if normalized and key not in seen:
            cleaned.append(normalized)
            seen.add(key)

    return cleaned


def _sync_story_filters(story: Story, genres: List[str], tags: List[str]) -> None:
    story.filters = [
        story_filter
        for story_filter in story.filters
        if story_filter.type not in GENRE_FILTER_TYPES + TAG_FILTER_TYPES
    ]

    story.filters.extend(
        StoryFilter(type="genre", description=genre)
        for genre in _clean_values(genres)
    )

    story.filters.extend(
        StoryFilter(type="tag", description=tag)
        for tag in _clean_values(tags)
    )


def _filter_match(filter_types: tuple[str, ...], value: str):
    return Story.filters.any(
        and_(
            StoryFilter.type.in_(filter_types),
            StoryFilter.description.ilike(f"%{value.strip()}%"),
        )
    )



@router.get("", response_model=List[StoryResponse])
@router.get("/", response_model=List[StoryResponse])
def get_stories(
    q: Optional[str] = Query(default=None),
    status: Optional[str] = Query(default=None),
    language: Optional[str] = Query(default=None),
    genre: Optional[str] = Query(default=None),
    tag: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
    stories_query = db.query(Story)

    if q and q.strip():
        search = f"%{q.strip()}%"
        stories_query = stories_query.filter(
            or_(
                Story.title.ilike(search),
                Story.subtitle.ilike(search),
                Story.synopsis.ilike(search),
                Story.language.ilike(search),
                Story.status.ilike(search),
                Story.filters.any(StoryFilter.description.ilike(search)),
            )
        )

    if status and status.strip():
        stories_query = stories_query.filter(Story.status == status.strip())

    if language and language.strip():
        stories_query = stories_query.filter(Story.language == language.strip())

    if genre and genre.strip():
        stories_query = stories_query.filter(_filter_match(GENRE_FILTER_TYPES, genre))

    if tag and tag.strip():
        stories_query = stories_query.filter(_filter_match(TAG_FILTER_TYPES, tag))

    return stories_query.all()

@router.get("/me",response_model=List[StoryResponse])
def get_my_stories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
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
    _sync_story_filters(new_story, story.genres, story.tags)

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
    _sync_story_filters(existing_story, story.genres, story.tags)

    db.commit()
    db.refresh(existing_story)

    return existing_story

# @router.get("/translations/{master_story_id}", response_model=List[StoryResponse])
