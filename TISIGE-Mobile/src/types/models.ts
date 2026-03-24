/**
 * Modelos de domínio alinhados ao sistema legado PHP (ControleLC / users)
 * e ao fluxo de aprovação (desenho técnico / LC).
 */

/** A = acesso completo | B = somente visualização (espelha `tipo` no MySQL). */
export type UserRole = 'A' | 'B';

/** Papel no fluxo Engenharia → Aprovação → PCP → Gerência. */
export type PapelUsuario =
  | 'admin'
  | 'desenhista'
  | 'aprovador'
  | 'pcp'
  | 'gerencia'
  | 'visualizador';

export interface User {
  username: string;
  nome: string;
  email: string;
  setor: string;
  tipo: UserRole;
  /** Quando ausente (sessões antigas), use `resolvePapel` em `auth/permissions`. */
  papel?: PapelUsuario;
}

/** Estado do fluxo de aprovação do desenho/LC. */
export type StatusAprovacao =
  | 'rascunho'
  | 'aguardando_aprovacao'
  | 'aprovado'
  | 'reprovado';

export interface ControleLC {
  id: string;
  arquivo: string;
  os: string;
  cliente: string;
  equipamento: string;
  /** ISO yyyy-mm-dd */
  dtContratual: string;
  dtRecebimento: string;
  dtRetirada?: string;
  respRetirada: string;
  setor: string;
  gaveta?: string;
  /**
   * Data limite para testes finais (usada na Gestão LC Final).
   * Se vazia, a tela de gestão pode derivar de `dtRecebimento`.
   */
  dataLimiteTestes?: string;
  /** Checkbox da tela Gestão geral LC final. */
  gestaoFinalizado?: boolean;

  /** Fluxo de aprovação técnica. */
  statusAprovacao: StatusAprovacao;
  motivoReprovacao?: string;
  /** ISO datetime local simplificado para demo */
  aprovadoEm?: string;
  reprovadoEm?: string;
  aprovadorNome?: string;

  /** PCP: item aprovado e marcado para fabricação. */
  programadoFabricacao: boolean;
}

export const SETORES = [
  'Barra',
  'Fio Redondo',
  'Mecânica',
  'Polo',
  'Teste',
] as const;
