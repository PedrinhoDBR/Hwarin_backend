import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';

function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

export default PublicRoute;