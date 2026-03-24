import { Navigate, Outlet } from 'react-router-dom';
import { canManageUsers } from '@/auth/permissions';
import { useAuthStore } from '@/store/authStore';

/** Só utilizadores com papel admin podem aceder a /admin/usuarios */
export function AdminRoute() {
  const user = useAuthStore((s) => s.user);
  if (!canManageUsers(user)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
