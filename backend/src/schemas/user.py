from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: Optional[str] = "user"


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: str
    role: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime


class UserPublicResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    role: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None


class UserProfileUpdate(BaseModel):
    username: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
