import { create } from 'zustand';
import type { ControleLC, StatusAprovacao } from '@/types/models';
import {
  controleLcToInsert,
  controleLcToUpdate,
  fetchAllControleLc,
  fetchControleLcById,
  rowToControleLC,
  type ControleLcRow,
} from '@/lib/controleLc';
import { supabase } from '@/lib/supabase';
import { useNotificationStore } from '@/store/notificationStore';

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeLc(row: ControleLC): ControleLC {
  return {
    ...row,
    statusAprovacao: row.statusAprovacao ?? 'rascunho',
    programadoFabricacao: row.programadoFabricacao ?? false,
    gestaoFinalizado: row.gestaoFinalizado ?? false,
  };
}

interface LCState {
  items: ControleLC[];
  loading: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  fetchById: (id: string) => Promise<ControleLC | null>;
  add: (row: Omit<ControleLC, 'id'>) => Promise<{ ok: boolean; error?: string }>;
  update: (id: string, row: Partial<ControleLC>) => Promise<{ ok: boolean; error?: string }>;
  remove: (id: string) => Promise<void>;
  findByOs: (os: string) => ControleLC | undefined;
  findById: (id: string) => ControleLC | undefined;
  toggleGestaoFinal: (id: string, value: boolean) => Promise<void>;
  submitForApproval: (id: string) => Promise<{ ok: boolean; error?: string }>;
  approve: (id: string, aprovadorNome: string) => Promise<{ ok: boolean; error?: string }>;
  reject: (id: string, motivo: string) => Promise<{ ok: boolean; error?: string }>;
  setProgramadoFabricacao: (id: string, value: boolean) => Promise<void>;
  clear: () => void;
}

export const useLCStore = create<LCState>()((set, get) => ({
  items: [],
  loading: false,
  error: null,

  clear: () => set({ items: [], error: null }),

  hydrate: async () => {
    set({ loading: true, error: null });
    try {
      const list = await fetchAllControleLc();
      set({ items: list.map(normalizeLc), loading: false });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      set({ error: msg, loading: false });
    }
  },

  fetchById: async (id: string) => {
    try {
      const row = await fetchControleLcById(id);
      if (!row) return null;
      const n = normalizeLc(row);
      set((s) => ({
        items: s.items.some((x) => x.id === id)
          ? s.items.map((x) => (x.id === id ? n : x))
          : [...s.items, n],
      }));
      return n;
    } catch {
      return null;
    }
  },

  add: async (row) => {
    const exists = get().items.some((x) => x.os === row.os.trim());
    if (exists) return { ok: false, error: 'Já existe uma LC com esta OS.' };
    const payload = controleLcToInsert({
      ...row,
      statusAprovacao: row.statusAprovacao ?? 'rascunho',
      programadoFabricacao: row.programadoFabricacao ?? false,
    });
    const { data, error } = await supabase
      .from('controle_lc')
      .insert(payload)
      .select('*')
      .single();
    if (error) {
      if (error.code === '23505') {
        return { ok: false, error: 'Já existe uma LC com esta OS.' };
      }
      return { ok: false, error: error.message };
    }
    const added = rowToControleLC(data as ControleLcRow);
    set((s) => ({ items: [normalizeLc(added), ...s.items] }));
    return { ok: true };
  },

  update: async (id, row) => {
    const target = get().items.find((x) => x.id === id);
    if (!target) return { ok: false, error: 'Registro não encontrado.' };
    if (row.os !== undefined && row.os !== target.os) {
      const taken = get().items.some((x) => x.os === row.os && x.id !== id);
      if (taken) return { ok: false, error: 'Já existe uma LC com esta OS.' };
    }
    const patch = controleLcToUpdate(row);
    if (Object.keys(patch).length === 0) return { ok: true };
    const { data, error } = await supabase
      .from('controle_lc')
      .update(patch)
      .eq('id', id)
      .select('*')
      .single();
    if (error) {
      if (error.code === '23505') {
        return { ok: false, error: 'Já existe uma LC com esta OS.' };
      }
      return { ok: false, error: error.message };
    }
    const updated = rowToControleLC(data as ControleLcRow);
    set((s) => ({
      items: s.items.map((x) => (x.id === id ? normalizeLc(updated) : x)),
    }));
    return { ok: true };
  },

  remove: async (id) => {
    const { error } = await supabase.from('controle_lc').delete().eq('id', id);
    if (error) throw new Error(error.message);
    set((s) => ({ items: s.items.filter((x) => x.id !== id) }));
  },

  findByOs: (os) => get().items.find((x) => x.os === os.trim()),
  findById: (id) => get().items.find((x) => x.id === id),

  toggleGestaoFinal: async (id, value) => {
    const { error } = await supabase
      .from('controle_lc')
      .update({ gestao_finalizado: value })
      .eq('id', id);
    if (error) throw new Error(error.message);
    set((s) => ({
      items: s.items.map((x) =>
        x.id === id ? { ...x, gestaoFinalizado: value } : x
      ),
    }));
  },

  submitForApproval: async (id) => {
    const target = get().items.find((x) => x.id === id);
    if (!target) return { ok: false, error: 'Registro não encontrado.' };
    const next: StatusAprovacao[] = ['rascunho', 'reprovado'];
    if (!next.includes(target.statusAprovacao)) {
      return {
        ok: false,
        error: 'Só é possível enviar LC em rascunho ou reprovada.',
      };
    }
    const { data, error } = await supabase
      .from('controle_lc')
      .update({
        status_aprovacao: 'aguardando_aprovacao',
        motivo_reprovacao: null,
        reprovado_em: null,
      })
      .eq('id', id)
      .select('*')
      .single();
    if (error) return { ok: false, error: error.message };
    const updated = rowToControleLC(data as ControleLcRow);
    set((s) => ({
      items: s.items.map((x) => (x.id === id ? normalizeLc(updated) : x)),
    }));
    return { ok: true };
  },

  approve: async (id, aprovadorNome) => {
    const target = get().items.find((x) => x.id === id);
    if (!target) return { ok: false, error: 'Registro não encontrado.' };
    if (target.statusAprovacao !== 'aguardando_aprovacao') {
      return { ok: false, error: 'Esta LC não está aguardando aprovação.' };
    }
    const { data, error } = await supabase
      .from('controle_lc')
      .update({
        status_aprovacao: 'aprovado',
        aprovado_em: nowIso(),
        aprovador_nome: aprovadorNome,
        motivo_reprovacao: null,
        reprovado_em: null,
      })
      .eq('id', id)
      .select('*')
      .single();
    if (error) return { ok: false, error: error.message };
    const updated = rowToControleLC(data as ControleLcRow);
    set((s) => ({
      items: s.items.map((x) => (x.id === id ? normalizeLc(updated) : x)),
    }));
    return { ok: true };
  },

  reject: async (id, motivo) => {
    const target = get().items.find((x) => x.id === id);
    if (!target) return { ok: false, error: 'Registro não encontrado.' };
    if (target.statusAprovacao !== 'aguardando_aprovacao') {
      return { ok: false, error: 'Esta LC não está aguardando aprovação.' };
    }
    const trimmed = motivo.trim();
    if (!trimmed) {
      return { ok: false, error: 'Informe o motivo da reprovação.' };
    }
    const { data, error } = await supabase
      .from('controle_lc')
      .update({
        status_aprovacao: 'reprovado',
        motivo_reprovacao: trimmed,
        reprovado_em: nowIso(),
        aprovador_nome: null,
        aprovado_em: null,
      })
      .eq('id', id)
      .select('*')
      .single();
    if (error) return { ok: false, error: error.message };
    const updated = rowToControleLC(data as ControleLcRow);
    set((s) => ({
      items: s.items.map((x) => (x.id === id ? normalizeLc(updated) : x)),
    }));
    useNotificationStore.getState().add({
      title: 'LC reprovada',
      body: `OS ${target.os} foi reprovada. ${trimmed.slice(0, 160)}${
        trimmed.length > 160 ? '…' : ''
      }`,
      lcId: id,
    });
    return { ok: true };
  },

  setProgramadoFabricacao: async (id, value) => {
    const target = get().items.find((x) => x.id === id);
    if (!target || target.statusAprovacao !== 'aprovado') return;
    const { data, error } = await supabase
      .from('controle_lc')
      .update({ programado_fabricacao: value })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    const updated = rowToControleLC(data as ControleLcRow);
    set((s) => ({
      items: s.items.map((x) => (x.id === id ? normalizeLc(updated) : x)),
    }));
  },
}));
