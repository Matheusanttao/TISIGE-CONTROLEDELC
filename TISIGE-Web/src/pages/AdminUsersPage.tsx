import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import {
  fetchAllProfiles,
  updateProfileByAdmin,
  type ProfileListItem,
} from '@/lib/adminUsers';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { hydrateAuthUser } from '@/store/authStore';
import type { PapelUsuario, UserRole } from '@/types/models';

const PAPEIS: PapelUsuario[] = [
  'admin',
  'desenhista',
  'aprovador',
  'pcp',
  'gerencia',
  'visualizador',
];

const PAPEL_LABEL: Record<PapelUsuario, string> = {
  admin: 'Admin',
  desenhista: 'Desenho',
  aprovador: 'Aprovação',
  pcp: 'PCP',
  gerencia: 'Gerência',
  visualizador: 'Leitura',
};

export function AdminUsersPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ProfileListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [edit, setEdit] = useState<ProfileListItem | null>(null);
  const [tipo, setTipo] = useState<UserRole>('B');
  const [papel, setPapel] = useState<PapelUsuario>('desenhista');
  const [setor, setSetor] = useState('');
  const [nome, setNome] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const list = await fetchAllProfiles();
      setRows(list);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openEdit = (row: ProfileListItem) => {
    setEdit(row);
    setTipo(row.tipo);
    setPapel((row.papel as PapelUsuario) || 'desenhista');
    setSetor(row.setor ?? '');
    setNome(row.full_name ?? '');
  };

  const onSave = async () => {
    if (!edit) return;
    setSaving(true);
    try {
      await updateProfileByAdmin(edit.id, {
        tipo,
        papel,
        setor,
        full_name: nome,
      });
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user && edit.id === session.user.id) {
        await hydrateAuthUser(session);
      }
      setEdit(null);
      await load();
      alert('Perfil atualizado.');
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5"
          >
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="text-xl font-bold text-white">Usuários</h1>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg p-2 text-cyan-400 hover:bg-white/5"
        >
          <RefreshCw className="size-5" />
        </button>
      </div>

      <p className="mb-6 text-sm text-slate-400">
        Defina papéis no fluxo. Tipo A edita LCs; tipo B é leitura.
      </p>

      {err ? <p className="mb-4 text-sm text-red-400">{err}</p> : null}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="size-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openEdit(item)}
              className="w-full rounded-2xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-elevated)] p-4 text-left transition hover:border-cyan-500/30"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-white">
                  {item.full_name || item.email || '—'}
                </span>
                <span className="rounded bg-cyan-500/15 px-2 py-0.5 text-xs font-bold text-cyan-300">
                  {item.tipo}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{item.email}</p>
              <p className="mt-2 text-xs text-slate-600">
                Papel: {PAPEL_LABEL[(item.papel as PapelUsuario) || 'visualizador']} · Setor:{' '}
                {item.setor || '—'}
              </p>
            </button>
          ))}
        </div>
      )}

      {edit ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-elevated)] p-6">
            <h2 className="text-lg font-bold text-white">Editar perfil</h2>
            <p className="text-sm text-slate-500">{edit.email}</p>

            <div className="mt-4 space-y-4">
              <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
              <Input label="Setor" value={setor} onChange={(e) => setSetor(e.target.value)} />
              <p className="text-xs font-semibold text-slate-500">Tipo</p>
              <div className="flex gap-2">
                {(['A', 'B'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTipo(t)}
                    className={`rounded-lg border px-4 py-2 text-sm ${
                      tipo === t
                        ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-200'
                        : 'border-[var(--color-tisige-border)] text-slate-400'
                    }`}
                  >
                    {t === 'A' ? 'A — edição' : 'B — leitura'}
                  </button>
                ))}
              </div>
              <p className="text-xs font-semibold text-slate-500">Papel no fluxo</p>
              <div className="flex flex-wrap gap-2">
                {PAPEIS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPapel(p)}
                    className={`rounded-lg border px-3 py-1.5 text-xs ${
                      papel === p
                        ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-200'
                        : 'border-[var(--color-tisige-border)] text-slate-400'
                    }`}
                  >
                    {PAPEL_LABEL[p]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button type="button" variant="ghost" className="flex-1" onClick={() => setEdit(null)}>
                Cancelar
              </Button>
              <Button type="button" className="flex-1" loading={saving} onClick={() => void onSave()}>
                Salvar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
