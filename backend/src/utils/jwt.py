import os
from datetime import datetime, timedelta, timezone
from utils.security import get_jwt_secret_key, JWT_ALGORITHM,ACCESS_TOKEN_EXPIRE_HOURS
import jwt

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