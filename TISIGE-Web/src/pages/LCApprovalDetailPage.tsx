import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { canApprove } from '@/auth/permissions';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useLCStore } from '@/store/lcStore';
import { isoToBR } from '@/utils/gestaoLcFinal';

export function LCApprovalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const findById = useLCStore((s) => s.findById);
  const approve = useLCStore((s) => s.approve);
  const reject = useLCStore((s) => s.reject);

  const row = id ? findById(id) : undefined;
  const [motivo, setMotivo] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!row) {
    return (
      <div>
        <p className="text-slate-400">LC não encontrada.</p>
        <Button type="button" variant="ghost" className="mt-4" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </div>
    );
  }

  const allowDecision =
    row.statusAprovacao === 'aguardando_aprovacao' && canApprove(user);

  const onApprove = async () => {
    if (!id) return;
    setBusy(true);
    try {
      const r = await approve(id, user?.nome ?? 'Aprovador');
      if (!r.ok) {
        alert(r.error ?? 'Erro');
        return;
      }
      navigate('/aprovacao');
    } finally {
      setBusy(false);
    }
  };

  const onRejectSubmit = async () => {
    if (!id) return;
    setBusy(true);
    try {
      const r = await reject(id, motivo);
      if (!r.ok) {
        alert(r.error ?? 'Erro');
        return;
      }
      setShowReject(false);
      navigate('/aprovacao');
    } finally {
      setBusy(false);
    }
  };

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
        <h1 className="text-xl font-bold text-white">OS {row.os}</h1>
      </div>

      <div className="mx-auto max-w-lg space-y-4">
        <StatusBadge status={row.statusAprovacao} />
        <Field k="Arquivo" v={row.arquivo || '—'} />
        <Field k="Cliente" v={row.cliente} />
        <Field k="Equipamento" v={row.equipamento} />
        <Field k="Contrato" v={isoToBR(row.dtContratual)} />
        <Field k="Recebimento" v={isoToBR(row.dtRecebimento)} />
        <Field k="Setor" v={row.setor} />
        <Field k="Gaveta" v={row.gaveta || '—'} />

        {allowDecision ? (
          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <Button type="button" onClick={() => void onApprove()} loading={busy}>
              Aprovar
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => setShowReject(true)}
              disabled={busy}
            >
              Reprovar
            </Button>
          </div>
        ) : null}

        {showReject ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
            <label className="block text-sm text-slate-400">Motivo da reprovação</label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-lg border border-[var(--color-tisige-border)] bg-[var(--color-tisige-surface)] p-3 text-sm text-white"
            />
            <div className="mt-3 flex gap-2">
              <Button type="button" variant="danger" loading={busy} onClick={() => void onRejectSubmit()}>
                Confirmar reprovação
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowReject(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-elevated)] px-4 py-3 sm:flex-row sm:justify-between">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{k}</span>
      <span className="text-slate-100">{v}</span>
    </div>
  );
}
