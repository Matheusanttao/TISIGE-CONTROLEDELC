import type { StatusAprovacao } from '@/types/models';

const LABEL: Record<StatusAprovacao, string> = {
  rascunho: 'Rascunho',
  aguardando_aprovacao: 'Aguardando',
  aprovado: 'Aprovado',
  reprovado: 'Reprovado',
};

const CLS: Record<StatusAprovacao, string> = {
  rascunho: 'bg-slate-600/40 text-slate-200',
  aguardando_aprovacao: 'bg-amber-500/20 text-amber-300',
  aprovado: 'bg-emerald-500/20 text-emerald-300',
  reprovado: 'bg-red-500/20 text-red-300',
};

export function StatusBadge({ status }: { status: StatusAprovacao }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${CLS[status]}`}
    >
      {LABEL[status]}
    </span>
  );
}
