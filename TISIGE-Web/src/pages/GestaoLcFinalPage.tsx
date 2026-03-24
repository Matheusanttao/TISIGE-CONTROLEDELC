import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLCStore } from '@/store/lcStore';
import { computeGestaoDates } from '@/utils/gestaoLcFinal';

export function GestaoLcFinalPage() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const osParam = search.get('os') ?? '';
  const findByOs = useLCStore((s) => s.findByOs);

  const [osInput, setOsInput] = useState(osParam);
  const [baseIso, setBaseIso] = useState('');

  const selected = useMemo(() => {
    const t = osInput.trim();
    if (!t) return undefined;
    return findByOs(t);
  }, [osInput, findByOs]);

  useEffect(() => {
    if (selected?.dataLimiteTestes) {
      setBaseIso(selected.dataLimiteTestes);
    } else if (selected?.dtRecebimento) {
      setBaseIso(selected.dtRecebimento);
    } else {
      setBaseIso('');
    }
  }, [selected]);

  const dates = useMemo(() => {
    if (!baseIso || baseIso.length < 10) return null;
    try {
      return computeGestaoDates(baseIso);
    } catch {
      return null;
    }
  }, [baseIso]);

  const onBuscar = () => {
    const t = osInput.trim();
    if (!t) return;
    const row = findByOs(t);
    if (!row) {
      navigate(`/os-inexistente/${encodeURIComponent(t)}`);
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
        <h1 className="text-xl font-bold text-white">Gestão LC final</h1>
      </div>

      <p className="mb-6 text-sm text-slate-400">
        Informe a OS. Os prazos ao PCP (+5 dias) e ao comercial (+15 dias) seguem a lógica do
        legado (GestaoLcFinal.html).
      </p>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input label="Número da OS" value={osInput} onChange={(e) => setOsInput(e.target.value)} />
        </div>
        <Button type="button" onClick={onBuscar}>
          Buscar
        </Button>
      </div>

      {selected ? (
        <div className="rounded-2xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-elevated)] p-6">
          <p className="font-semibold text-cyan-300">OS {selected.os}</p>
          <p className="text-sm text-slate-400">{selected.cliente}</p>
          {dates ? (
            <dl className="mt-4 grid gap-3 sm:grid-cols-3">
              <div>
                <dt className="text-xs text-slate-500">Testes finais</dt>
                <dd className="font-semibold text-white">{dates.limiteTestes}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">LC → PCP</dt>
                <dd className="font-semibold text-white">{dates.limitePcp}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">LC → Comercial</dt>
                <dd className="font-semibold text-white">{dates.limiteComercial}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-4 text-sm text-amber-200/80">
              Defina data limite testes na LC para calcular os prazos.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
