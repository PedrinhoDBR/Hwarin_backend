export interface AuthUser {
  id: number;
  username: string;
  name?: string;
  email: string;
  role?: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

export type LoginResponse = AuthSession;
