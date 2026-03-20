from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from src.db.database import Base


class StoryInfos(Base):
    __tablename__ = "story_infos"

    id = Column(Integer, primary_key=True, index=True)
    story_id = Column(Integer, ForeignKey("story.id"), nullable=False)
    about = Column(String, nullable=True)
    description = Column(String, nullable=True)

    story = relationship("Story", back_populates="infos")
