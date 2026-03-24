import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { canCreateLC, canEditLCRecord } from '@/auth/permissions';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useLCStore } from '@/store/lcStore';
import type { ControleLC } from '@/types/models';
import { isoToBR } from '@/utils/gestaoLcFinal';

export function ControleLCPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const items = useLCStore((s) => s.items);
  const loading = useLCStore((s) => s.loading);
  const error = useLCStore((s) => s.error);
  const hydrate = useLCStore((s) => s.hydrate);
  const remove = useLCStore((s) => s.remove);
  const [q, setQ] = useState('');

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter(
      (row) =>
        row.os.toLowerCase().includes(t) ||
        row.cliente.toLowerCase().includes(t) ||
        row.equipamento.toLowerCase().includes(t)
    );
  }, [items, q]);

  const fabOk = canCreateLC(user);

  const onDelete = async (row: ControleLC) => {
    if (!confirm(`Excluir OS ${row.os}?`)) return;
    try {
      await remove(row.id);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erro ao excluir.');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white">Controle de LC</h1>
        {fabOk ? (
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => navigate('/lc/new')}
          >
            <Plus className="size-4" /> Nova LC
          </Button>
        ) : null}
      </div>

      <input
        type="search"
        placeholder="Buscar por OS, cliente ou equipamento…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-6 w-full rounded-xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-surface)] px-4 py-3 text-[var(--color-tisige-text)] outline-none focus:border-cyan-500/50"
      />

      {error ? (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          <p>{error}</p>
          <Button
            type="button"
            variant="ghost"
            className="mt-3"
            onClick={() => void hydrate()}
          >
            Tentar novamente
          </Button>
        </div>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="size-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        </div>
      ) : error ? null : filtered.length === 0 ? (
        <p className="text-center text-slate-500">Nenhum registro encontrado.</p>
      ) : (
        <div className="grid gap-3">
          {filtered.map((item) => {
            const canEdit = canEditLCRecord(user, item);
            return (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-elevated)] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <Link to={`/lc/${item.id}`} className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-cyan-300">OS {item.os}</span>
                    <StatusBadge status={item.statusAprovacao} />
                  </div>
                  <p className="mt-1 truncate text-slate-200">{item.cliente}</p>
                  <p className="truncate text-sm text-slate-500">{item.equipamento}</p>
                  <p className="mt-1 text-xs text-slate-600">Receb. {isoToBR(item.dtRecebimento)}</p>
                </Link>
                <div className="flex shrink-0 gap-2">
                  {canEdit ? (
                    <Link to={`/lc/${item.id}/edit`}>
                      <Button type="button" variant="ghost" className="!min-h-10 text-sm">
                        Editar
                      </Button>
                    </Link>
                  ) : (
                    <Link to={`/lc/${item.id}`}>
                      <Button type="button" variant="ghost" className="!min-h-10 text-sm">
                        Ver
                      </Button>
                    </Link>
                  )}
                  {canEdit ? (
                    <Button
                      type="button"
                      variant="danger"
                      className="!min-h-10 text-sm"
                      onClick={() => void onDelete(item)}
                    >
                      Excluir
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
