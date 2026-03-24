import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { useLCStore } from '@/store/lcStore';
import type { ControleLC } from '@/types/models';
import { isoToBR } from '@/utils/gestaoLcFinal';

export function AprovacaoPage() {
  const navigate = useNavigate();
  const items = useLCStore((s) => s.items);
  const [q, setQ] = useState('');

  const pending = useMemo(
    () => items.filter((x) => x.statusAprovacao === 'aguardando_aprovacao'),
    [items]
  );

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return pending;
    return pending.filter(
      (row) =>
        row.os.toLowerCase().includes(t) ||
        row.cliente.toLowerCase().includes(t) ||
        row.equipamento.toLowerCase().includes(t)
    );
  }, [pending, q]);

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
        <h1 className="text-xl font-bold text-white">Aprovação técnica</h1>
      </div>

      <input
        type="search"
        placeholder="Buscar…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-6 w-full rounded-xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-surface)] px-4 py-3 outline-none"
      />

      {filtered.length === 0 ? (
        <p className="text-slate-500">Nenhuma LC aguardando aprovação.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((item: ControleLC) => (
            <Link
              key={item.id}
              to={`/aprovacao/${item.id}`}
              className="rounded-2xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-elevated)] p-4 transition hover:border-cyan-500/30"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-cyan-300">OS {item.os}</span>
                <StatusBadge status={item.statusAprovacao} />
              </div>
              <p className="mt-2 font-medium text-slate-200">{item.cliente}</p>
              <p className="line-clamp-2 text-sm text-slate-500">{item.equipamento}</p>
              <p className="mt-2 text-xs text-slate-600">Receb. {isoToBR(item.dtRecebimento)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
