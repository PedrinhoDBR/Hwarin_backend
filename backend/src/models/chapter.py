from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from db.database import Base


class Chapter(Base):
    __tablename__ = "chapter"

    id = Column(Integer, primary_key=True, index=True)

    story_id = Column(
        Integer,
        ForeignKey("story.id", ondelete="CASCADE"),
        nullable=False,
    )

    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=True)
    text = Column(Text, nullable=False)
    chapter_number = Column(Integer, nullable=False)

    status = Column(
        String,
        nullable=False,
        default="draft",
    )

    story = relationship(
        "Story",
        back_populates="chapters",
    )