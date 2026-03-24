import type { ControleLC, StatusAprovacao } from '../types/models';
import { supabase } from './supabase';

/** Linha retornada pelo PostgREST (snake_case). */
export type ControleLcRow = {
  id: string;
  arquivo: string | null;
  os: string;
  cliente: string;
  equipamento: string;
  dt_contratual: string;
  dt_recebimento: string;
  dt_retirada: string | null;
  resp_retirada: string | null;
  setor: string;
  gaveta: string | null;
  data_limite_testes: string | null;
  gestao_finalizado: boolean;
  status_aprovacao: StatusAprovacao;
  motivo_reprovacao: string | null;
  aprovado_em: string | null;
  reprovado_em: string | null;
  aprovador_nome: string | null;
  programado_fabricacao: boolean;
};

function isoDateOnly(s: string | null | undefined): string {
  if (!s) return '';
  return s.length >= 10 ? s.slice(0, 10) : s;
}

export function rowToControleLC(row: ControleLcRow): ControleLC {
  return {
    id: row.id,
    arquivo: row.arquivo ?? '',
    os: row.os,
    cliente: row.cliente,
    equipamento: row.equipamento,
    dtContratual: isoDateOnly(row.dt_contratual),
    dtRecebimento: isoDateOnly(row.dt_recebimento),
    dtRetirada: row.dt_retirada ? isoDateOnly(row.dt_retirada) : undefined,
    respRetirada: row.resp_retirada ?? '',
    setor: row.setor,
    gaveta: row.gaveta ?? undefined,
    dataLimiteTestes: row.data_limite_testes
      ? isoDateOnly(row.data_limite_testes)
      : undefined,
    gestaoFinalizado: row.gestao_finalizado,
    statusAprovacao: row.status_aprovacao ?? 'rascunho',
    motivoReprovacao: row.motivo_reprovacao ?? undefined,
    aprovadoEm: row.aprovado_em ?? undefined,
    reprovadoEm: row.reprovado_em ?? undefined,
    aprovadorNome: row.aprovador_nome ?? undefined,
    programadoFabricacao: row.programado_fabricacao ?? false,
  };
}

/** Insert: sem id (gerado no banco). */
export function controleLcToInsert(row: Omit<ControleLC, 'id'>) {
  return {
    arquivo: row.arquivo || null,
    os: row.os.trim(),
    cliente: row.cliente.trim(),
    equipamento: row.equipamento.trim(),
    dt_contratual: row.dtContratual,
    dt_recebimento: row.dtRecebimento,
    dt_retirada: row.dtRetirada?.trim() || null,
    resp_retirada: row.respRetirada ?? '',
    setor: row.setor,
    gaveta: row.gaveta?.trim() || null,
    data_limite_testes: row.dataLimiteTestes?.trim() || null,
    gestao_finalizado: row.gestaoFinalizado ?? false,
    status_aprovacao: row.statusAprovacao,
    motivo_reprovacao: row.motivoReprovacao ?? null,
    aprovado_em: row.aprovadoEm ?? null,
    reprovado_em: row.reprovadoEm ?? null,
    aprovador_nome: row.aprovadorNome ?? null,
    programado_fabricacao: row.programadoFabricacao ?? false,
  };
}

/** Update parcial: só campos definidos. */
export function controleLcToUpdate(
  patch: Partial<ControleLC>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (patch.arquivo !== undefined) out.arquivo = patch.arquivo || null;
  if (patch.os !== undefined) out.os = patch.os.trim();
  if (patch.cliente !== undefined) out.cliente = patch.cliente.trim();
  if (patch.equipamento !== undefined) out.equipamento = patch.equipamento.trim();
  if (patch.dtContratual !== undefined) out.dt_contratual = patch.dtContratual;
  if (patch.dtRecebimento !== undefined) out.dt_recebimento = patch.dtRecebimento;
  if (patch.dtRetirada !== undefined)
    out.dt_retirada = patch.dtRetirada?.trim() || null;
  if (patch.respRetirada !== undefined) out.resp_retirada = patch.respRetirada;
  if (patch.setor !== undefined) out.setor = patch.setor;
  if (patch.gaveta !== undefined) out.gaveta = patch.gaveta?.trim() || null;
  if (patch.dataLimiteTestes !== undefined)
    out.data_limite_testes = patch.dataLimiteTestes?.trim() || null;
  if (patch.gestaoFinalizado !== undefined)
    out.gestao_finalizado = patch.gestaoFinalizado;
  if (patch.statusAprovacao !== undefined)
    out.status_aprovacao = patch.statusAprovacao;
  if (patch.motivoReprovacao !== undefined)
    out.motivo_reprovacao = patch.motivoReprovacao ?? null;
  if (patch.aprovadoEm !== undefined) out.aprovado_em = patch.aprovadoEm ?? null;
  if (patch.reprovadoEm !== undefined) out.reprovado_em = patch.reprovadoEm ?? null;
  if (patch.aprovadorNome !== undefined)
    out.aprovador_nome = patch.aprovadorNome ?? null;
  if (patch.programadoFabricacao !== undefined)
    out.programado_fabricacao = patch.programadoFabricacao;
  return out;
}

const LC_FETCH_TIMEOUT_MS = 60_000;

function createTimeoutAbortSignal(ms: number): AbortSignal {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(ms);
  }
  const c = new AbortController();
  setTimeout(() => c.abort(), ms);
  return c.signal;
}

const LC_TIMEOUT_MSG =
  'Tempo esgotado ao carregar os LCs. Verifique a rede, o .env (URL/chave do Supabase) e tente de novo.';

export async function fetchAllControleLc(): Promise<ControleLC[]> {
  const signal = createTimeoutAbortSignal(LC_FETCH_TIMEOUT_MS);
  try {
    const { data, error } = await supabase
      .from('controle_lc')
      .select('*')
      .order('created_at', { ascending: false })
      .abortSignal(signal);

    if (error) throw new Error(error.message);
    return ((data ?? []) as ControleLcRow[]).map(rowToControleLC);
  } catch (e) {
    const name = e instanceof Error ? e.name : '';
    const msg = e instanceof Error ? e.message : String(e);
    if (
      name === 'AbortError' ||
      /abort|aborted|timeout|The user aborted/i.test(msg)
    ) {
      throw new Error(LC_TIMEOUT_MSG);
    }
    throw e instanceof Error ? e : new Error(msg);
  }
}

export async function fetchControleLcById(id: string): Promise<ControleLC | null> {
  const { data, error } = await supabase
    .from('controle_lc')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return rowToControleLC(data as ControleLcRow);
}
