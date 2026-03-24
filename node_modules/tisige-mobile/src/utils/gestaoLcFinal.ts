/**
 * Regras de negócio da Gestão LC Final (mesma lógica de `GestaoLcFinal.html`):
 * - PCP = data limite testes + 5 dias
 * - Comercial = data limite testes + 15 dias
 */

export const DIAS_ATE_PCP = 5;
export const DIAS_ATE_COMERCIAL = 15;

export function addDays(isoDate: string, days: number): Date {
  const d = new Date(isoDate + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d;
}

export function formatBR(d: Date): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function isoToBR(iso: string): string {
  if (!iso) return '—';
  const [y, m, day] = iso.split('-');
  if (!y || !m || !day) return iso;
  return `${day}/${m}/${y}`;
}

export function computeGestaoDates(dataLimiteTestesIso: string) {
  const base = new Date(dataLimiteTestesIso + 'T12:00:00');
  const pcp = new Date(base);
  pcp.setDate(pcp.getDate() + DIAS_ATE_PCP);
  const comercial = new Date(base);
  comercial.setDate(comercial.getDate() + DIAS_ATE_COMERCIAL);
  return {
    limiteTestes: formatBR(base),
    limitePcp: formatBR(pcp),
    limiteComercial: formatBR(comercial),
  };
}
