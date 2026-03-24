import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { resolvePapel } from '@/auth/permissions';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import type { PapelUsuario } from '@/types/models';

const PAPEL_LABEL: Record<PapelUsuario, string> = {
  admin: 'Administrador (gestão de usuários)',
  desenhista: 'Desenho (cadastro / correções)',
  aprovador: 'Aprovação técnica',
  pcp: 'PCP — fabricação',
  gerencia: 'Gerência',
  visualizador: 'Somente leitura',
};

export function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const papel = resolvePapel(user);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5"
        >
          <ArrowLeft className="size-6" />
        </button>
        <h1 className="text-xl font-bold text-white">Perfil</h1>
      </div>

      <div className="mx-auto max-w-lg rounded-2xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-elevated)] p-6">
        <div className="mb-6 flex justify-center">
          <div className="flex size-20 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 text-3xl text-cyan-400">
            {(user?.nome ?? '?').slice(0, 1).toUpperCase()}
          </div>
        </div>
        <h2 className="text-center text-lg font-bold text-white">{user?.nome}</h2>
        <p className="text-center text-sm text-slate-500">@{user?.username}</p>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
            <dt className="text-slate-500">E-mail</dt>
            <dd className="text-right text-slate-200">{user?.email}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
            <dt className="text-slate-500">Setor</dt>
            <dd className="text-right text-slate-200">{user?.setor}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
            <dt className="text-slate-500">Permissão</dt>
            <dd className="text-right text-slate-200">
              {user?.tipo === 'A' ? 'Edição' : 'Somente leitura'}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Perfil no fluxo</dt>
            <dd className="max-w-[60%] text-right text-slate-200">{PAPEL_LABEL[papel]}</dd>
          </div>
        </dl>

        <p className="mt-6 text-xs leading-relaxed text-slate-500">
          Papéis e tipo são definidos pelo administrador no Supabase / módulo Usuários.
        </p>

        <Button
          type="button"
          variant="danger"
          className="mt-6 w-full"
          onClick={() => {
            if (!confirm('Encerrar sessão?')) return;
            void (async () => {
              await logout();
              navigate('/login', { replace: true });
            })();
          }}
        >
          Encerrar sessão
        </Button>
      </div>
    </div>
  );
}
