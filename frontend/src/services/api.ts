import { AUTH_STORAGE_KEY } from '../context/AuthContext';
import type { LoginResponse } from '../types/auth';

function extractToken(data: Record<string, unknown>): string | null {
  const candidates = [data.token, data.accessToken, data.jwt];
  const token = candidates.find((value) => typeof value === 'string' && value.length > 0);
  return typeof token === 'string' ? token : null;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Erro no login");
  }

  const token = extractToken(data);
  if (!data.user || !token) {
    throw new Error('Login realizado sem token JWT valido.');
  }

  return {
    user: data.user,
    token,
  };
}

export function getStoredToken(): string | null {
  const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    const session = JSON.parse(rawSession) as Partial<LoginResponse>;
    return typeof session.token === 'string' ? session.token : null;
  } catch {
    return null;
  }
}

export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = getStoredToken();
  const headers = new Headers(init.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(input, {
    ...init,
    headers,
  });
}