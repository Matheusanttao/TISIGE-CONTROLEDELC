/**
 * Paleta TISIGE — espelha o tema web (fundo escuro + acento ciano).
 * @see docs/ARQUITETURA.md
 */
export const colors = {
  bg: '#0f1419',
  bgElevated: '#1a2332',
  surface: '#243044',
  border: 'rgba(255,255,255,0.08)',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  accent: '#22d3ee',
  accentDark: '#0891b2',
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
  overlay: 'rgba(0,0,0,0.55)',
} as const;

export type ColorKey = keyof typeof colors;
