import { AUTH_STORAGE_KEY } from '../context/AuthContext';

export function logout() {
  localStorage.removeItem(
    AUTH_STORAGE_KEY
  );
}