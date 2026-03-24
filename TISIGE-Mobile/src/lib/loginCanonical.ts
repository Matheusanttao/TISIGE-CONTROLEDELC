export const DEFAULT_ADMIN_EMAIL = 'admin@admin.local';

export function canonicalLoginEmail(raw: string): string {
  const t = raw.trim().toLowerCase();
  if (t === 'admin') return DEFAULT_ADMIN_EMAIL;
  return t;
}
