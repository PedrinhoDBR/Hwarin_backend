from pydantic import BaseModel, ConfigDict
from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str

    class Config:
        from_attributes = True

class LoginUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: str
    role: str


class LoginResponse(BaseModel):
    message: str
    user: LoginUserResponse
    token: str
    accessToken: str
    token_type: str = "bearer"
    expires_in: int


