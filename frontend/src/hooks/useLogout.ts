import { useAuth } from './UseAuth';

export function useLogout() {
  const { clearAuth } = useAuth();

  function logout() {
    clearAuth();
  }

  return logout;
}