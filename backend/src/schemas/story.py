from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional

from src.schemas.user import UserPublicResponse


class StoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: Optional[str] = None
    subtitle: Optional[str] = None
    synopsis: Optional[str] = None
    status: Optional[str] = None
    master_story_id: Optional[int] = None
    language: Optional[str] = None
    cover: Optional[str] = None
    genres: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    author: Optional[UserPublicResponse] = None

class StoryCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    synopsis: Optional[str] = None
    status: Optional[str] = None
    master_story_id: Optional[int] = None
    language: Optional[str] = None
    cover: Optional[str] = None
    genres: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
