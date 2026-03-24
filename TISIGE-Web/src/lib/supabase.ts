import { createClient } from '@supabase/supabase-js';

const url = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

export function isSupabaseConfigured(): boolean {
  return url.length > 0 && anon.length > 0;
}

export function getSupabaseProjectHost(): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const storage =
  typeof window !== 'undefined' ? window.localStorage : undefined;

/** Chave onde o Supabase guarda a sessão (localStorage). */
export function getSupabaseAuthStorageKey(): string | null {
  if (!url) return null;
  try {
    const host = new URL(url).hostname;
    const ref = host.split('.')[0];
    if (!ref) return null;
    return `sb-${ref}-auth-token`;
  } catch {
    return null;
  }
}

export function clearSupabaseAuthStorage(): void {
  if (typeof window === 'undefined') return;
  const key = getSupabaseAuthStorageKey();
  if (key) localStorage.removeItem(key);
}

export const supabase = createClient(url, anon, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
