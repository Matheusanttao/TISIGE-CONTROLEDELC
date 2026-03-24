import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export function ProtectedRoute() {
  const ready = useAuthStore((s) => s.ready);
  const user = useAuthStore((s) => s.user);
  const loc = useLocation();

  if (!ready) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-[var(--color-tisige-bg)]">
        <div className="size-10 animate-spin rounded-full border-2 border-[var(--color-tisige-accent)] border-t-transparent" />
        <p className="text-sm text-[var(--color-tisige-muted)]">Carregando…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }

  return <Outlet />;
}

export function GuestRoute() {
  const ready = useAuthStore((s) => s.ready);
  const user = useAuthStore((s) => s.user);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--color-tisige-bg)]">
        <div className="size-10 animate-spin rounded-full border-2 border-[var(--color-tisige-accent)] border-t-transparent" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
