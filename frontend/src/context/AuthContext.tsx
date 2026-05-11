import { createContext, useEffect, useMemo, useState } from 'react';
import type { AuthSession, AuthUser } from '../types/auth';

const AUTH_STORAGE_KEY = 'auth-session';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAuthSession: (session: AuthSession) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function readStoredSession(): AuthSession | null {
  const saved = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved) as AuthSession;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => readStoredSession());
  const [loading, setLoading] = useState(false);

  const user = session?.user ?? null;
  const token = session?.token ?? null;

  useEffect(() => {
    if (!session) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  function setUser(value: React.SetStateAction<AuthUser | null>) {
    setSession((currentSession) => {
      const previousUser = currentSession?.user ?? null;
      const nextUser = typeof value === 'function'
        ? value(previousUser)
        : value;

      if (!nextUser) {
        return null;
      }

      return {
        user: nextUser,
        token: currentSession?.token ?? '',
      };
    });
  }

  function setToken(value: React.SetStateAction<string | null>) {
    setSession((currentSession) => {
      const previousToken = currentSession?.token ?? null;
      const nextToken = typeof value === 'function'
        ? value(previousToken)
        : value;

      if (!nextToken || !currentSession?.user) {
        return null;
      }

      return {
        user: currentSession.user,
        token: nextToken,
      };
    });
  }

  function setAuthSession(nextSession: AuthSession) {
    setSession(nextSession);
  }

  function clearAuth() {
    setSession(null);
  }

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    setUser,
    setToken,
    setLoading,
    setAuthSession,
    clearAuth,
  }), [user, token, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AUTH_STORAGE_KEY, AuthContext };