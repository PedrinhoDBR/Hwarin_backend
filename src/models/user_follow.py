from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.database import Base


class UserFollow(Base):
    __tablename__ = "user_follow"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    following_user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    followed_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", foreign_keys=[user_id], back_populates="following")
    following_user = relationship(
        "User", foreign_keys=[following_user_id], back_populates="followers"
    )
