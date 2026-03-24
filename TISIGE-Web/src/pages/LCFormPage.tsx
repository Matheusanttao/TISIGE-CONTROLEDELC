import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import {
  canCreateLC,
  canEditLCRecord,
  canSubmitForApproval,
  resolvePapel,
} from '@/auth/permissions';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { useLCStore } from '@/store/lcStore';
import { SETORES, type ControleLC } from '@/types/models';

const empty: Omit<ControleLC, 'id'> = {
  arquivo: '',
  os: '',
  cliente: '',
  equipamento: '',
  dtContratual: '',
  dtRecebimento: '',
  dtRetirada: '',
  respRetirada: '',
  setor: 'Teste',
  gaveta: '',
  dataLimiteTestes: '',
  gestaoFinalizado: false,
  statusAprovacao: 'rascunho',
  programadoFabricacao: false,
};

function isIsoDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export function LCFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const mode = path.endsWith('/new')
    ? 'create'
    : path.endsWith('/edit')
      ? 'edit'
      : 'view';

  const user = useAuthStore((s) => s.user);
  const add = useLCStore((s) => s.add);
  const update = useLCStore((s) => s.update);
  const findById = useLCStore((s) => s.findById);
  const fetchById = useLCStore((s) => s.fetchById);
  const submitForApproval = useLCStore((s) => s.submitForApproval);

  const [form, setForm] = useState<Omit<ControleLC, 'id'>>(empty);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const editing = mode === 'edit' && id;
  const viewing = mode === 'view' && id;
  const readOnly = mode === 'view';
  const row = id ? findById(id) : undefined;

  useEffect(() => {
    if (id && (editing || viewing) && !findById(id)) {
      void fetchById(id);
    }
  }, [id, editing, viewing, findById, fetchById]);

  useEffect(() => {
    if ((editing || viewing) && id) {
      const r = findById(id);
      if (r) {
        const { id: _id, ...rest } = r;
        setForm({
          ...empty,
          ...rest,
          dtRetirada: rest.dtRetirada || '',
          dataLimiteTestes: rest.dataLimiteTestes || '',
          gaveta: rest.gaveta || '',
          motivoReprovacao: rest.motivoReprovacao,
        });
      }
    }
  }, [editing, viewing, id, row]);

  useEffect(() => {
    if (mode === 'edit' && row && user) {
      if (!canEditLCRecord(user, row)) {
        navigate(`/lc/${row.id}`, { replace: true });
      }
    }
  }, [mode, row, user, navigate]);

  const set =
    (key: keyof Omit<ControleLC, 'id'>) => (v: string) =>
      setForm((f) => ({ ...f, [key]: v }));

  const hintGaveta = useMemo(() => 'G1: 01–30 · G2: 31–60 · G3: 61+', []);

  const editable =
    !readOnly &&
    (mode === 'create'
      ? canCreateLC(user)
      : row
        ? canEditLCRecord(user, row)
        : false);

  const mergedForFlow: ControleLC | null = row
    ? { ...row, ...form, id: row.id }
    : null;
  const showSubmit =
    !readOnly &&
    mergedForFlow &&
    canSubmitForApproval(user, mergedForFlow) &&
    (mergedForFlow.statusAprovacao === 'rascunho' ||
      mergedForFlow.statusAprovacao === 'reprovado');

  const title =
    mode === 'create' ? 'Nova LC' : readOnly ? 'Detalhes da LC' : 'Editar LC';

  const onSave = async () => {
    if (!form.os.trim() || !form.cliente.trim() || !form.equipamento.trim()) {
      alert('Preencha OS, cliente e equipamento.');
      return;
    }
    if (!isIsoDate(form.dtContratual) || !isIsoDate(form.dtRecebimento)) {
      alert('Datas contratual e recebimento: formato AAAA-MM-DD.');
      return;
    }
    if (form.dtRetirada && !isIsoDate(form.dtRetirada)) {
      alert('Data retirada inválida.');
      return;
    }
    if (form.dataLimiteTestes && !isIsoDate(form.dataLimiteTestes)) {
      alert('Data limite testes inválida.');
      return;
    }

    setSaving(true);
    try {
      if (mode === 'create') {
        const r = await add(form);
        if (!r.ok) {
          alert(r.error ?? 'Erro');
          return;
        }
      } else if (id) {
        const r = await update(id, form);
        if (!r.ok) {
          alert(r.error ?? 'Erro');
          return;
        }
      }
      navigate(-1);
    } finally {
      setSaving(false);
    }
  };

  const onSubmitApproval = () => {
    if (!id || !row) return;
    if (!form.os.trim() || !form.cliente.trim() || !form.equipamento.trim()) {
      alert('Preencha OS, cliente e equipamento antes de enviar.');
      return;
    }
    if (!isIsoDate(form.dtContratual) || !isIsoDate(form.dtRecebimento)) {
      alert('Datas em AAAA-MM-DD.');
      return;
    }
    if (
      !confirm(
        'Os dados serão salvos e a LC ficará na fila do aprovador. Continuar?'
      )
    ) {
      return;
    }
    void (async () => {
      setSubmitting(true);
      try {
        const rUpdate = await update(id, form);
        if (!rUpdate.ok) {
          alert(rUpdate.error ?? 'Erro');
          return;
        }
        const r = await submitForApproval(id);
        if (!r.ok) {
          alert(r.error ?? 'Erro');
          return;
        }
        navigate(-1);
      } finally {
        setSubmitting(false);
      }
    })();
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="size-6" />
        </button>
        <h1 className="text-xl font-bold text-white">{title}</h1>
      </div>

      <div className="mx-auto max-w-2xl space-y-4">
        {row ? (
          <div className="space-y-3 rounded-2xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-elevated)] p-4">
            <StatusBadge status={form.statusAprovacao} />
            {form.statusAprovacao === 'aprovado' && (
              <p className="text-xs text-slate-500">
                {form.aprovadorNome ? `Aprovado por ${form.aprovadorNome}` : 'Aprovado'}{' '}
                {form.aprovadoEm
                  ? `· ${new Date(form.aprovadoEm).toLocaleString('pt-BR')}`
                  : ''}
              </p>
            )}
            {form.statusAprovacao === 'reprovado' && form.motivoReprovacao ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                <p className="text-xs font-bold text-red-300">Motivo da reprovação</p>
                <p className="text-sm text-slate-200">{form.motivoReprovacao}</p>
              </div>
            ) : null}
            {form.statusAprovacao === 'aprovado' && form.programadoFabricacao ? (
              <p className="text-sm font-semibold text-cyan-400">
                Programado para fabricação (PCP)
              </p>
            ) : null}
          </div>
        ) : null}

        <Input label="Arquivo" value={form.arquivo} onChange={(e) => set('arquivo')(e.target.value)} readOnly={!editable} />
        <Input
          label="OS *"
          value={form.os}
          onChange={(e) => set('os')(e.target.value)}
          readOnly={!editable || mode !== 'create'}
        />
        <Input
          label="Cliente *"
          value={form.cliente}
          onChange={(e) => set('cliente')(e.target.value)}
          readOnly={!editable}
        />
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-400">Equipamento *</span>
          <textarea
            value={form.equipamento}
            onChange={(e) => set('equipamento')(e.target.value)}
            readOnly={!editable}
            rows={3}
            className="rounded-xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-surface)] px-4 py-3 text-[var(--color-tisige-text)] outline-none focus:border-cyan-500/50"
          />
        </label>
        <Input
          label="Data contratual * (AAAA-MM-DD)"
          value={form.dtContratual}
          onChange={(e) => set('dtContratual')(e.target.value)}
          readOnly={!editable}
        />
        <Input
          label="Data recebimento * (AAAA-MM-DD)"
          value={form.dtRecebimento}
          onChange={(e) => set('dtRecebimento')(e.target.value)}
          readOnly={!editable}
        />
        <Input
          label="Data retirada (opcional)"
          value={form.dtRetirada || ''}
          onChange={(e) => set('dtRetirada')(e.target.value)}
          readOnly={!editable}
        />
        <Input
          label="Responsável retirada"
          value={form.respRetirada}
          onChange={(e) => set('respRetirada')(e.target.value)}
          readOnly={!editable}
        />
        <Input
          label="Gaveta"
          value={form.gaveta || ''}
          onChange={(e) => set('gaveta')(e.target.value)}
          readOnly={!editable}
        />
        <p className="-mt-2 text-xs text-slate-500">{hintGaveta}</p>

        <p className="text-sm font-medium text-slate-400">Setor</p>
        <div className="flex flex-wrap gap-2">
          {SETORES.map((s) => (
            <button
              key={s}
              type="button"
              disabled={!editable}
              onClick={() => editable && setForm((f) => ({ ...f, setor: s }))}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                form.setor === s
                  ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-200'
                  : 'border-[var(--color-tisige-border)] text-slate-400 hover:bg-white/5'
              } ${!editable ? 'opacity-50' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>

        <Input
          label="Data limite testes finais (AAAA-MM-DD)"
          value={form.dataLimiteTestes || ''}
          onChange={(e) => set('dataLimiteTestes')(e.target.value)}
          readOnly={!editable}
        />

        {readOnly ? (
          <p className="text-xs text-slate-500">
            Perfil: {resolvePapel(user)} · Somente leitura.
          </p>
        ) : null}

        {!readOnly ? (
          <Button type="button" onClick={() => void onSave()} loading={saving}>
            Salvar
          </Button>
        ) : null}
        {showSubmit ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onSubmitApproval}
            loading={submitting}
          >
            <Send className="size-4" /> Enviar para aprovação técnica
          </Button>
        ) : null}
      </div>
    </div>
  );
}
