from pydantic import BaseModel, ConfigDict
from typing import Optional

class ChapterCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    text: str
    chapter_number: Optional[int] = None
    status: Optional[str] = "draft"
    story_id: Optional[int] = None

class ChapterResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    subtitle: Optional[str] = None
    text: str
    chapter_number: Optional[int] = None
    status: Optional[str] = None
    story_id: Optional[int] = None
