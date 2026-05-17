import os
import sys
from routes import ratings
from routes import chapter
from routes import story
from routes import auth
from routes import users
from routes import follows
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from db.database import Base, engine
from db.database import SessionLocal
from models.user import User
import models
from utils.crypt_password import hash_password
import uvicorn

load_dotenv()
ENVIRONMENT = os.getenv("ENVIRONMENT", "PRODUCTION")
origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

# temporario
ADMIN_USERNAME = "admin"
ADMIN_EMAIL = "admin@gmail.com"
ADMIN_PASSWORD = "admin123"
ADMIN_ROLE = "admin"


def ensure_admin_user() -> None:
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == ADMIN_EMAIL).first()
        if admin_user:
            return

        db.add(
            User(
                username=ADMIN_USERNAME,
                email=ADMIN_EMAIL,
                password_hash=hash_password(ADMIN_PASSWORD),
                role=ADMIN_ROLE,
            )
        )
        db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    if ENVIRONMENT == "DEVELOPMENT":
        Base.metadata.drop_all(bind=engine)

    Base.metadata.create_all(bind=engine)
    ensure_admin_user()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(story.router, prefix="/api/stories", tags=["stories"])
app.include_router(chapter.router, prefix="/api/chapters", tags=["chapters"])
app.include_router(follows.router,prefix="/api/follows",tags=["Follows"])
app.include_router(ratings.router,prefix="/api/ratings",tags=["Ratings"])

@app.get("/")
def root():
    return {"message": "API rodando 🚀"}


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=3000, reload=True)

