import type { ControleLC, PapelUsuario, User } from '../types/models';

export function resolvePapel(user: User | null): PapelUsuario {
  if (!user) return 'visualizador';
  if (user.papel) return user.papel;
  if (user.username === 'pcp.motor') return 'pcp';
  if (user.tipo === 'B') return 'visualizador';
  return 'desenhista';
}

/** Criação de nova LC (setor desenho / engenharia). */
export function canCreateLC(user: User | null): boolean {
  return user?.tipo === 'A' && resolvePapel(user) === 'desenhista';
}

/** Edição de campos da LC (somente rascunho ou reprovado). */
export function canEditLCRecord(user: User | null, lc: ControleLC): boolean {
  if (!user || user.tipo !== 'A') return false;
  if (resolvePapel(user) !== 'desenhista') return false;
  return (
    lc.statusAprovacao === 'rascunho' || lc.statusAprovacao === 'reprovado'
  );
}

export function canSubmitForApproval(
  user: User | null,
  lc: ControleLC
): boolean {
  if (!user || user.tipo !== 'A') return false;
  if (resolvePapel(user) !== 'desenhista') return false;
  return (
    lc.statusAprovacao === 'rascunho' || lc.statusAprovacao === 'reprovado'
  );
}

export function canApprove(user: User | null): boolean {
  return user?.tipo === 'A' && resolvePapel(user) === 'aprovador';
}

export function canAccessPcpFabricacao(user: User | null): boolean {
  return user?.tipo === 'A' && resolvePapel(user) === 'pcp';
}

export function canAccessGerencia(user: User | null): boolean {
  return user?.tipo === 'A' && resolvePapel(user) === 'gerencia';
}

/** Listar/editar usuários (tipo e papel) — só perfil admin. */
export function canManageUsers(user: User | null): boolean {
  return user?.tipo === 'A' && resolvePapel(user) === 'admin';
}

/** Painel consolidado: gerência (edição implícita) ou perfil somente leitura. */
export function canViewGerenciaDashboard(user: User | null): boolean {
  if (!user) return false;
  if (resolvePapel(user) === 'gerencia' && user.tipo === 'A') return true;
  return user.tipo === 'B';
}

/** Compat: edição genérica (qualquer A) — preferir canEditLCRecord onde couber. */
export function canEdit(user: User | null): boolean {
  return user?.tipo === 'A';
}
