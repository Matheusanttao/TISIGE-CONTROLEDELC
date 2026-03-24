import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLCStore } from '@/store/lcStore';
import { computeGestaoDates } from '@/utils/gestaoLcFinal';

export function GestaoLcFinalGeralPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const items = useLCStore((s) => s.items);
  const toggle = useLCStore((s) => s.toggleGestaoFinal);
  const canToggle = user?.tipo === 'A';

  const rows = useMemo(() => {
    return items.map((row) => {
      const base = row.dataLimiteTestes || row.dtRecebimento;
      let d: ReturnType<typeof computeGestaoDates> | null = null;
      try {
        if (base && base.length >= 10) d = computeGestaoDates(base);
      } catch {
        d = null;
      }
      return { row, d };
    });
  }, [items]);

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
        <h1 className="text-xl font-bold text-white">Gestão geral LC final</h1>
      </div>

      <p className="mb-6 text-sm text-slate-400">
        Prazos e status de finalização por OS
        {!canToggle ? ' · apenas tipo A altera o switch.' : ''}
      </p>

      <div className="space-y-4">
        {rows.map(({ row, d }) => (
          <div
            key={row.id}
            className="rounded-2xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-elevated)] p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-bold text-cyan-300">OS {row.os}</span>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                Finalizado
                <input
                  type="checkbox"
                  checked={!!row.gestaoFinalizado}
                  disabled={!canToggle}
                  onChange={async (e) => {
                    try {
                      await toggle(row.id, e.target.checked);
                    } catch (err) {
                      alert(err instanceof Error ? err.message : 'Erro');
                    }
                  }}
                  className="size-4 accent-cyan-500"
                />
              </label>
            </div>
            {d ? (
              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-slate-500">Testes finais</dt>
                  <dd>{d.limiteTestes}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">LC → PCP</dt>
                  <dd>{d.limitePcp}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">LC → Comercial</dt>
                  <dd>{d.limiteComercial}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-3 text-sm text-slate-500">Defina data limite testes na LC.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
