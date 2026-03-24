import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Bell,
  ClipboardList,
  Factory,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
} from 'lucide-react';
import {
  canAccessPcpFabricacao,
  canApprove,
  canManageUsers,
  canViewGerenciaDashboard,
  resolvePapel,
} from '@/auth/permissions';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import type { PapelUsuario } from '@/types/models';

const PAPEL_LABEL: Record<PapelUsuario, string> = {
  admin: 'Admin',
  desenhista: 'Desenho',
  aprovador: 'Aprovação',
  pcp: 'PCP',
  gerencia: 'Gerência',
  visualizador: 'Leitura',
};

const navCls =
  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white';
const activeCls = 'bg-cyan-500/15 text-cyan-300';

export function AppLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const unread = useNotificationStore((s) => s.items.filter((x) => !x.read).length);
  const papel = resolvePapel(user);

  const showAprovacao = user ? canApprove(user) : false;
  const showPcp = user ? canAccessPcpFabricacao(user) : false;
  const showGerencia = user ? canViewGerenciaDashboard(user) : false;
  const showAdmin = user ? canManageUsers(user) : false;

  return (
    <div className="flex min-h-dvh bg-[var(--color-tisige-bg)]">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--color-tisige-border)] bg-[var(--color-tisige-surface)] md:flex">
        <div className="border-b border-[var(--color-tisige-border)] px-4 py-5">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            TISIGE
          </div>
          <p className="mt-1 truncate text-sm font-semibold text-white">
            {user?.nome ?? '—'}
          </p>
          <p className="truncate text-xs text-slate-500">{user?.email}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
              {PAPEL_LABEL[papel]}
            </span>
            <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
              {user?.tipo === 'A' ? 'Edição' : 'Leitura'}
            </span>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
          <NavLink to="/" end className={({ isActive }) => `${navCls} ${isActive ? activeCls : ''}`}>
            <Home className="size-4 shrink-0" /> Início
          </NavLink>
          <NavLink
            to="/controle-lc"
            className={({ isActive }) => `${navCls} ${isActive ? activeCls : ''}`}
          >
            <ClipboardList className="size-4 shrink-0" /> Controle LC
          </NavLink>
          <NavLink
            to="/gestao-lc-final"
            className={({ isActive }) => `${navCls} ${isActive ? activeCls : ''}`}
          >
            <ClipboardList className="size-4 shrink-0" /> Gestão LC final
          </NavLink>
          <NavLink
            to="/gestao-lc-final-geral"
            className={({ isActive }) => `${navCls} ${isActive ? activeCls : ''}`}
          >
            <LayoutDashboard className="size-4 shrink-0" /> Gestão geral
          </NavLink>
          {showAprovacao ? (
            <NavLink
              to="/aprovacao"
              className={({ isActive }) => `${navCls} ${isActive ? activeCls : ''}`}
            >
              <ShieldCheck className="size-4 shrink-0" /> Aprovação técnica
            </NavLink>
          ) : null}
          {showPcp ? (
            <NavLink
              to="/pcp-fabricacao"
              className={({ isActive }) => `${navCls} ${isActive ? activeCls : ''}`}
            >
              <Factory className="size-4 shrink-0" /> PCP fabricação
            </NavLink>
          ) : null}
          {showGerencia ? (
            <NavLink
              to="/gerencia"
              className={({ isActive }) => `${navCls} ${isActive ? activeCls : ''}`}
            >
              <LayoutDashboard className="size-4 shrink-0" /> Gerência
            </NavLink>
          ) : null}
          {showAdmin ? (
            <NavLink
              to="/admin/usuarios"
              className={({ isActive }) => `${navCls} ${isActive ? activeCls : ''}`}
            >
              <Users className="size-4 shrink-0" /> Usuários
            </NavLink>
          ) : null}
          <NavLink
            to="/notificacoes"
            className={({ isActive }) => `${navCls} ${isActive ? activeCls : ''}`}
          >
            <Bell className="size-4 shrink-0" />
            Notificações
            {unread > 0 ? (
              <span className="ml-auto rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                {unread > 9 ? '9+' : unread}
              </span>
            ) : null}
          </NavLink>
          <NavLink
            to="/perfil"
            className={({ isActive }) => `${navCls} ${isActive ? activeCls : ''}`}
          >
            <Settings className="size-4 shrink-0" /> Conta
          </NavLink>
        </nav>
        <div className="border-t border-[var(--color-tisige-border)] p-3">
          <button
            type="button"
            onClick={() => {
              if (!confirm('Encerrar sessão?')) return;
              void (async () => {
                await logout();
                navigate('/login', { replace: true });
              })();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut className="size-4" /> Sair
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--color-tisige-border)] bg-[var(--color-tisige-surface)]/80 px-4 py-3 backdrop-blur md:hidden">
          <span className="font-bold tracking-widest text-cyan-400">TISIGE</span>
          <div className="flex items-center gap-2">
            <NavLink
              to="/notificacoes"
              className="relative rounded-lg p-2 text-slate-300 hover:bg-white/5"
            >
              <Bell className="size-5" />
              {unread > 0 ? (
                <span className="absolute right-1 top-1 size-2 rounded-full bg-red-500" />
              ) : null}
            </NavLink>
            <NavLink to="/perfil" className="rounded-lg p-2 text-slate-300 hover:bg-white/5">
              <UserCog className="size-5" />
            </NavLink>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
