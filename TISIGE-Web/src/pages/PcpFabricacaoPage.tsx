import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { canAccessPcpFabricacao } from '@/auth/permissions';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuthStore } from '@/store/authStore';
import { useLCStore } from '@/store/lcStore';
import type { ControleLC } from '@/types/models';
import { isoToBR } from '@/utils/gestaoLcFinal';

export function PcpFabricacaoPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const items = useLCStore((s) => s.items);
  const setProgramado = useLCStore((s) => s.setProgramadoFabricacao);
  const pcpOk = canAccessPcpFabricacao(user);
  const [q, setQ] = useState('');

  const approved = useMemo(
    () => items.filter((x) => x.statusAprovacao === 'aprovado'),
    [items]
  );

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return approved;
    return approved.filter(
      (row) =>
        row.os.toLowerCase().includes(t) ||
        row.cliente.toLowerCase().includes(t) ||
        row.equipamento.toLowerCase().includes(t)
    );
  }, [approved, q]);

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
        <h1 className="text-xl font-bold text-white">PCP — Fabricação</h1>
      </div>

      <input
        type="search"
        placeholder="Buscar…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-6 w-full rounded-xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-surface)] px-4 py-3 outline-none"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((item: ControleLC) => (
          <div
            key={item.id}
            className="rounded-2xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-elevated)] p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-cyan-300">OS {item.os}</span>
              <StatusBadge status={item.statusAprovacao} />
            </div>
            <p className="mt-2 text-slate-200">{item.cliente}</p>
            <p className="text-sm text-slate-500">{item.equipamento}</p>
            <p className="mt-2 text-xs text-slate-600">Receb. {isoToBR(item.dtRecebimento)}</p>
            <label className="mt-4 flex items-center justify-between gap-2 text-sm text-slate-300">
              Programado para fabricação
              <input
                type="checkbox"
                checked={!!item.programadoFabricacao}
                disabled={!pcpOk}
                onChange={async (e) => {
                  try {
                    await setProgramado(item.id, e.target.checked);
                  } catch (err) {
                    alert(err instanceof Error ? err.message : 'Erro');
                  }
                }}
                className="size-4 accent-cyan-500"
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
