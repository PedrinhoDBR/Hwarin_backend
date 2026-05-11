import {
  BookOpen,
  Download,
  Home,
  PenSquare,
  Search,
  Settings,
  User,
} from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';
import { alpha, createAppTheme } from '../theme';
import { privateRoutes } from '../routes/privateRoutes';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: User, label: 'Perfil', path: '/user' },
  { icon: Search, label: 'Buscar', path: '/search' },
  { icon: BookOpen, label: 'Biblioteca', path: '/library' },
  { icon: PenSquare, label: 'História', path: '/stories' },
  { icon: Download, label: 'Downloads', path: '/downloads' },
];

export default function Layout() {
  const theme = createAppTheme('dark');
  const { brand } = theme;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pageTitle = privateRoutes.find((route) => route.path === pathname)?.title ?? 'História';

  return (
    <div className="flex max-h-screen min-h-screen overflow-hidden">
      <nav className="z-10 flex w-16 shrink-0 flex-col items-center gap-1 border-r border-white/10 bg-black/35 py-6 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => navigate('/user')}
          className="mb-2 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white transition-transform hover:scale-105"
          style={{
            background: brand.accentGradient,
            boxShadow: `0 0 12px ${alpha(brand.sparkle, 0.6)}`,
            fontWeight: theme.typography.h5Weight,
          }}
        >
          U
        </button>

        {NAV_ITEMS.map((item) => {
          const active = pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              type="button"
              title={item.label}
              onClick={() => navigate(item.path)}
              className="flex h-11 w-11 items-center justify-center transition-all duration-200"
              style={{
                color: active ? brand.sparkle : alpha(brand.fontColor, 0.45),
                borderRadius: `${theme.radius}px`,
                background: active ? alpha(brand.sparkle, 0.12) : 'transparent',
                border: active
                  ? `1px solid ${alpha(brand.sparkle, 0.3)}`
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
          title="Configurações"
          onClick={() => navigate('/config')}
          className="flex h-11 w-11 items-center justify-center"
          style={{
            color: alpha(brand.fontColor, 0.4),
            borderRadius: `${theme.radius}px`,
          }}
        >
          <Settings className="h-5 w-5" />
        </button>
      </nav>

      <main className="flex flex-1 flex-col overflow-hidden">
        <PageHeader title={pageTitle} />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}