import {
  AUTH_STORAGE_KEY,
} from '../context/AuthContext';

import type {
  LoginResponse,
} from '../types/auth';

import { logout } from './auth';

function extractToken(
  data: Record<string, unknown>
): string | null {
  const candidates = [
    data.token,
    data.accessToken,
    data.jwt,
  ];

  const token = candidates.find(
    (value) =>
      typeof value === 'string' &&
      value.length > 0
  );

  return typeof token ===
    'string'
    ? token
    : null;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(
    "/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error || "Erro no login"
    );
  }

  const token =
    extractToken(data);

  if (!data.user || !token) {
    throw new Error(
      'Login realizado sem token JWT válido.'
    );
  }

  return {
    user: data.user,
    token,
  };
}

export function getStoredToken(): string | null {
  const rawSession =
    localStorage.getItem(
      AUTH_STORAGE_KEY
    );

  if (!rawSession) {
    return null;
  }

  try {
    const session = JSON.parse(
      rawSession
    ) as Partial<LoginResponse>;

    return typeof session.token ===
      'string'
      ? session.token
      : null;
  } catch {
    return null;
  }
}

function isTokenExpired(
  token: string
): boolean {
  try {
    const payload = JSON.parse(
      atob(token.split('.')[1])
    );

    const now =
      Date.now() / 1000;

    return payload.exp < now;
  } catch {
    return true;
  }
}

export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
) {
  const token =
    getStoredToken();

  // sem token
  if (!token) {
    logout();

    throw new Error(
      'Sem sessão'
    );
  }

  // token expirado
  if (isTokenExpired(token)) {
    logout();

    throw new Error(
      'Sessão expirada'
    );
  }

  const headers = new Headers(
    init.headers
  );

  headers.set(
    'Authorization',
    `Bearer ${token}`
  );

  const response = await fetch(
    input,
    {
      ...init,
      headers,
    }
  );

  // backend respondeu 401
  if (response.status === 401) {
    logout();

    throw new Error(
      'Não autorizado'
    );
  }

  return response;
}