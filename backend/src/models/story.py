from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base


class Story(Base):
    __tablename__ = "story"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=True)
    subtitle = Column(String, nullable=True)
    synopsis = Column(Text, nullable=True)
    status = Column(String, nullable=True)
    master_story_id = Column(Integer, ForeignKey("story.id"), nullable=True)
    language = Column(String, nullable=True)
    cover = Column(String, nullable=True)

    master_story = relationship(
        "Story",
        back_populates="translations",
        remote_side=[id],
    )
    translations = relationship("Story", back_populates="master_story")

    user_stories = relationship("UserStory", back_populates="story")
    filters = relationship("StoryFilter", back_populates="story")
    ratings = relationship("StoryRating", back_populates="story")
    infos = relationship("StoryInfos", back_populates="story")
    suggestions = relationship("StorySuggestion", back_populates="story")

    chapters = relationship("Chapter",back_populates="story",cascade="all, delete-orphan",order_by="Chapter.chapter_number",)
