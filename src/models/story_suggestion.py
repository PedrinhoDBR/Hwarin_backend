from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from src.db.database import Base


class StorySuggestion(Base):
    __tablename__ = "story_suggestion"

    id = Column(Integer, primary_key=True, index=True)
    story_id = Column(Integer, ForeignKey("story.id"), nullable=False)
    about = Column(String, nullable=True)
    suggestion = Column(Text, nullable=True)

    story = relationship("Story", back_populates="suggestions")
