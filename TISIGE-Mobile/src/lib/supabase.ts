import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

/** Espaços no .env quebram o URL; trim evita "credenciais inválidas" com projeto certo. */
const url = (process.env.EXPO_PUBLIC_SUPABASE_URL ?? '').trim();
const anon = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();
const configured = url.length > 0 && anon.length > 0;

export function isSupabaseConfigured(): boolean {
  return configured;
}

/** Host do projeto (ex.: abcdefgh.supabase.co) — só para conferir se o .env é o do Dashboard. */
export function getSupabaseProjectHost(): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

/** Mesma chave que o cliente Supabase usa em AsyncStorage. */
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

export async function clearSupabaseAuthStorage(): Promise<void> {
  const key = getSupabaseAuthStorageKey();
  if (key) await AsyncStorage.removeItem(key);
}

/** Cliente Supabase — sessão em AsyncStorage (web usa localStorage por baixo). */
const safeUrl = configured ? url : 'https://invalid.local';
const safeAnon = configured ? anon : 'invalid-anon-key';

export const supabase = createClient(safeUrl, safeAnon, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: typeof window !== 'undefined',
  },
});

export function assertSupabaseConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Configure EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no arquivo .env'
    );
  }
}
