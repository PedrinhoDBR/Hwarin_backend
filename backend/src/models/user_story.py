from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from src.db.database import Base


class UserStory(Base):
    __tablename__ = "user_story"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    story_id = Column(Integer, ForeignKey("story.id"), nullable=False)
    role = Column(String, nullable=False)  # autor, editor, leitor, tradutor...

    user = relationship("User", back_populates="user_stories")
    story = relationship("Story", back_populates="user_stories")
