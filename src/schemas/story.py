from pydantic import BaseModel, ConfigDict
from typing import Optional


class StoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: Optional[str] = None
    subtitle: Optional[str] = None
    text: Optional[str] = None
    status: Optional[str] = None
    master_story_id: Optional[int] = None
    language: Optional[str] = None
    cover: Optional[str] = None
