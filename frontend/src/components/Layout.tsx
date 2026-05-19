import {
  BookOpen,
  Home,
  LogOut,
  PenSquare,
  Search,
  Settings,
} from 'lucide-react';
import {
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useEffect } from 'react';

import { alpha, createAppTheme } from '../theme';
import { authFetch } from '../services/api';
import { useAuth } from '../hooks/UseAuth';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Buscar', path: '/search' },
  { icon: BookOpen, label: 'Biblioteca', path: '/library' },
  { icon: PenSquare, label: 'Minhas historias', path: '/stories' },
];

export default function Layout() {
  const theme = createAppTheme('dark');
  const { brand } = theme;

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { clearAuth, user } = useAuth();

  const username =
    user?.username ?? user?.name ?? 'Usuario';
  const userInitial =
    username.charAt(0).toUpperCase();

  useEffect(() => {
    async function validateSession() {
      try {
        const response = await authFetch(
          '/api/auth/me'
        );

        if (response.status === 401) {
          clearAuth();
          navigate('/login', {
            replace: true,
          });
        }
      } catch {
        clearAuth();

        navigate('/login', {
          replace: true,
        });
      }
    }

    validateSession();
  }, [clearAuth, navigate]);

  function handleLogout() {
    clearAuth();
    navigate('/login', {
      replace: true,
    });
  }

  return (
    <div className="flex max-h-screen min-h-screen overflow-hidden">
      <nav className="z-10 flex w-16 shrink-0 flex-col items-center gap-1 border-r border-white/10 bg-black/35 py-6 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => navigate('/user')}
          title={username}
          className="mb-2 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white transition-transform hover:scale-105"
          style={{
            background: brand.accentGradient,
            boxShadow: `0 0 12px ${alpha(
              brand.sparkle,
              0.6
            )}`,
            fontWeight: theme.typography.h5Weight,
          }}
        >
          {userInitial}
        </button>

        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.path ||
            (item.path !== '/' &&
              pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              type="button"
              title={item.label}
              onClick={() =>
                navigate(item.path)
              }
              className="flex h-11 w-11 items-center justify-center transition-all duration-200"
              style={{
                color: active
                  ? brand.sparkle
                  : alpha(
                      brand.fontColor,
                      0.45
                    ),

                borderRadius: `${theme.radius}px`,

                background: active
                  ? alpha(
                      brand.sparkle,
                      0.12
                    )
                  : 'transparent',

                border: active
                  ? `1px solid ${alpha(
                      brand.sparkle,
                      0.3
                    )}`
                  : '1px solid transparent',
              }}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}

        <div className="flex-1" />

        <button
          type="button"
          title="Configuracoes"
          onClick={() =>
            navigate('/config')
          }
          className="flex h-11 w-11 items-center justify-center"
          style={{
            color: alpha(
              brand.fontColor,
              0.4
            ),
            borderRadius: `${theme.radius}px`,
          }}
        >
          <Settings className="h-5 w-5" />
        </button>

        <button
          type="button"
          title="Sair"
          onClick={handleLogout}
          className="flex h-11 w-11 items-center justify-center"
          style={{
            color: alpha(
              brand.fontColor,
              0.4
            ),
            borderRadius: `${theme.radius}px`,
          }}
        >
          <LogOut className="h-5 w-5" />
        </button>
      </nav>

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
