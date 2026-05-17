from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.database import Base
from src.utils.crypt_password import verify_password


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    following = relationship(
        "UserFollow",
        foreign_keys="UserFollow.user_id",
        back_populates="user",
    )
    followers = relationship(
        "UserFollow",
        foreign_keys="UserFollow.following_user_id",
        back_populates="following_user",
    )
    user_stories = relationship("UserStory", back_populates="user")
    ratings = relationship("StoryRating", back_populates="user")

    def validate_password(self, password: str) -> bool:
        return verify_password(password, self.password_hash)
