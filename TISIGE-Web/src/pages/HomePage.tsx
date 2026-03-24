import { Link } from 'react-router-dom';
import {
  Calendar,
  ClipboardList,
  Factory,
  Grid3X3,
  LayoutDashboard,
  ShieldCheck,
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
import type { PapelUsuario } from '@/types/models';

const PAPEL_LABEL: Record<PapelUsuario, string> = {
  admin: 'Admin',
  desenhista: 'Desenho',
  aprovador: 'Aprovação',
  pcp: 'PCP',
  gerencia: 'Gerência',
  visualizador: 'Leitura',
};

function Card({
  to,
  title,
  subtitle,
  icon: Icon,
  accent = '#22d3ee',
}: {
  to: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accent?: string;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-2xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-elevated)] p-5 transition hover:border-white/15 hover:shadow-lg hover:shadow-black/20"
    >
      <div
        className="mb-3 flex size-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accent}18`, color: accent }}
      >
        <Icon className="size-5" />
      </div>
      <h3 className="font-bold text-white group-hover:text-cyan-100">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-400">{subtitle}</p>
    </Link>
  );
}

export function HomePage() {
  const user = useAuthStore((s) => s.user);
  const papel = resolvePapel(user);
  const showAprovacao = user ? canApprove(user) : false;
  const showPcp = user ? canAccessPcpFabricacao(user) : false;
  const showGerencia = user ? canViewGerenciaDashboard(user) : false;
  const showAdmin = user ? canManageUsers(user) : false;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm text-slate-400">Bem-vindo</p>
          <h1 className="text-3xl font-bold text-white">{user?.nome ?? 'Usuário'}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              {user?.setor ?? '—'}
            </span>
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">
              {PAPEL_LABEL[papel]}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
              {user?.tipo === 'A' ? 'Edição' : 'Somente leitura'}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-[var(--color-tisige-border)] bg-gradient-to-br from-[var(--color-tisige-elevated)] to-slate-900/50 p-6">
        <h2 className="text-lg font-bold text-white">Painel</h2>
        <p className="mt-1 text-sm text-slate-400">
          Fluxo de desenho/LC: cadastro, aprovação técnica, PCP e acompanhamento — alinhado ao
          sistema legado, com Supabase e interface web atual.
        </p>
      </div>

      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
        Módulos
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card
          to="/controle-lc"
          title="Controle de LC"
          subtitle="Lista, cadastro e detalhes (conforme seu perfil)"
          icon={ClipboardList}
        />
        {showAprovacao ? (
          <Card
            to="/aprovacao"
            title="Aprovação técnica"
            subtitle="Fila de LCs aguardando decisão"
            icon={ShieldCheck}
            accent="#fbbf24"
          />
        ) : null}
        {showPcp ? (
          <Card
            to="/pcp-fabricacao"
            title="PCP — Fabricação"
            subtitle="LCs aprovadas e programação"
            icon={Factory}
            accent="#22d3ee"
          />
        ) : null}
        {showGerencia ? (
          <Card
            to="/gerencia"
            title="Painel gerencial"
            subtitle="Visão consolidada do fluxo"
            icon={LayoutDashboard}
            accent="#c084fc"
          />
        ) : null}
        {showAdmin ? (
          <Card
            to="/admin/usuarios"
            title="Usuários (admin)"
            subtitle="Tipo (A/B) e papéis"
            icon={Users}
            accent="#fb7185"
          />
        ) : null}
        <Card
          to="/gestao-lc-final"
          title="Gestão LC final"
          subtitle="Prazos de testes, PCP e comercial por OS"
          icon={Calendar}
          accent="#a78bfa"
        />
        <Card
          to="/gestao-lc-final-geral"
          title="Gestão geral LC final"
          subtitle="Visão consolidada e finalização"
          icon={Grid3X3}
          accent="#34d399"
        />
      </div>
    </div>
  );
}
