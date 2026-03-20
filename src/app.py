import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from src.db.database import Base, engine
import src.models
from src.routes import auth, users, stories
load_dotenv()
ENVIRONMENT = os.getenv("ENVIRONMENT", "PRODUCTION")
origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")


@asynccontextmanager
async def lifespan(app: FastAPI):
    if ENVIRONMENT == "DEVELOPMENT":
        Base.metadata.drop_all(bind=engine)

    Base.metadata.create_all(bind=engine)
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
app.include_router(stories.router, prefix="/api/stories", tags=["stories"])


@app.get("/")
def root():
    return {"message": "API rodando 🚀"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.app:app", host="0.0.0.0", port=3000, reload=True)

