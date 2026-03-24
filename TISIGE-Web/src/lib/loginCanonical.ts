/**
 * Supabase Auth exige e-mail. Aceitamos o atalho "admin" / "admin" no login,
 * equivalente a admin@admin.local (ver seed_admin.sql e scripts/create-admin-user.mjs).
 */
/** E-mail usado no Supabase Auth para o atalho de login «admin». */
export const DEFAULT_ADMIN_EMAIL = 'admin@admin.local';

export function canonicalLoginEmail(raw: string): string {
  const t = raw.trim().toLowerCase();
  if (t === 'admin') return DEFAULT_ADMIN_EMAIL;
  return t;
}
