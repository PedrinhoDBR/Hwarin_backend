import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv

load_dotenv()

DB_NAME = os.getenv("DB_NAME", "database.sqlite")
ENVIRONMENT = os.getenv("ENVIRONMENT", "PRODUCTION")

engine = create_engine(
    f"sqlite:///{DB_NAME}",
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
