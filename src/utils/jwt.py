import os
from datetime import datetime, timedelta, timezone

import jwt

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 8
DEFAULT_JWT_SECRET_KEY = "change-me-in-production-with-a-32-char-secret"


def get_jwt_secret_key() -> str:
    return os.getenv("JWT_SECRET_KEY") or os.getenv("SECRET_KEY") or DEFAULT_JWT_SECRET_KEY


def create_access_token(user_id: int, email: str, role: str) -> tuple[str, int]:
    expires_in = ACCESS_TOKEN_EXPIRE_HOURS * 60 * 60
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=expires_in)
    payload = {
        "sub": str(user_id),
        "email": email,
        "role": role,
        "exp": expires_at,
    }
    token = jwt.encode(payload, get_jwt_secret_key(), algorithm=JWT_ALGORITHM)
    return token, expires_in