from sqlalchemy import Column, Integer, String
from db.database import Base


class Music(Base):
    __tablename__ = "music"

    id = Column(Integer, primary_key=True, index=True)
    link = Column(String, nullable=False)
