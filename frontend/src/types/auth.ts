export interface AuthUser {
  id: number;
  username: string;
  name?: string;
  email: string;
  role?: string;
  avatar_url?: string | null;
  bio?: string | null;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

export type LoginResponse = AuthSession;
