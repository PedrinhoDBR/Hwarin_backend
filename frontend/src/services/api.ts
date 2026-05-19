import {
  AUTH_STORAGE_KEY,
} from '../context/AuthContext';

import type {
  LoginResponse,
} from '../types/auth';

import { logout } from './auth';

const API_URL =
  import.meta.env.VITE_API_URL ?? '';

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

async function readJsonResponse(
  response: Response
): Promise<Record<string, unknown>> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function getErrorMessage(
  data: Record<string, unknown>,
  fallback: string
): string {
  if (typeof data.detail === 'string') {
    return data.detail;
  }

  if (typeof data.error === 'string') {
    return data.error;
  }

  if (typeof data.message === 'string') {
    return data.message;
  }

  return fallback;
}

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

  return typeof token === 'string'
    ? token
    : null;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(
    `${API_URL}/api/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await readJsonResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(data, 'Erro no login')
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

export async function registerUser(
  payload: RegisterPayload
) {
  const response = await fetch(
    `${API_URL}/api/users/`,
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify({
        ...payload,
        role: 'user',
      }),
    }
  );

  const data =
    await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        'Erro ao criar cadastro'
      )
    );
  }

  return data;
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

  if (!token) {
    logout();

    throw new Error(
      'Sem sessão'
    );
  }

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

  const url =
    typeof input === 'string'
      ? `${API_URL}${input}`
      : input;

  const response = await fetch(
    url,
    {
      ...init,
      headers,
    }
  );

  if (response.status === 401) {
    logout();

    throw new Error(
      'Não autorizado'
    );
  }

  return response;
}
