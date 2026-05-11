import os

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 8
DEFAULT_JWT_SECRET_KEY = "change-me-in-production-with-a-32-char-secret"


def get_jwt_secret_key() -> str:
    return os.getenv("JWT_SECRET_KEY") or os.getenv("SECRET_KEY") or DEFAULT_JWT_SECRET_KEY
