from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from src.db.database import Base


class StoryFilter(Base):
    __tablename__ = "story_filter"

    id = Column(Integer, primary_key=True, index=True)
    story_id = Column(Integer, ForeignKey("story.id"), nullable=False)
    type = Column(String, nullable=False)  # personagens, generos, tags
    description = Column(String, nullable=True)

    story = relationship("Story", back_populates="filters")
