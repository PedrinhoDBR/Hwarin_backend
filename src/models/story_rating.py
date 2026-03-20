from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from src.db.database import Base


class StoryRating(Base):
    __tablename__ = "story_rating"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    story_id = Column(Integer, ForeignKey("story.id"), primary_key=True)
    value = Column(Integer, nullable=False)
    description = Column(String, nullable=True)

    user = relationship("User", back_populates="ratings")
    story = relationship("Story", back_populates="ratings")
