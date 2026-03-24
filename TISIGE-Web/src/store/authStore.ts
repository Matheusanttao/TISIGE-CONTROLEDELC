import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import type { User } from '@/types/models';
import { fetchProfileForUser } from '@/lib/profile';
import {
  canonicalLoginEmail,
  DEFAULT_ADMIN_EMAIL,
} from '@/lib/loginCanonical';
import {
  clearSupabaseAuthStorage,
  isSupabaseConfigured,
  supabase,
} from '@/lib/supabase';

const ENV_MISSING =
  'Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env (veja .env.example) e reinicie o servidor (npm run dev).';

function mapAuthError(
  err: { message: string; code?: string },
  attemptedEmail?: string
): string {
  const m = err.message.toLowerCase();
  const code = err.code ?? '';
  if (
    code === 'invalid_credentials' ||
    m.includes('invalid login') ||
    m.includes('invalid credentials')
  ) {
    if (attemptedEmail === DEFAULT_ADMIN_EMAIL) {
      return (
        'A conta admin@admin.local ainda não existe neste projeto Supabase, ou a senha não é «admin». ' +
        'Crie o utilizador: Dashboard → Authentication → Users → Add user → e-mail admin@admin.local, ' +
        'senha admin, marque Auto Confirm. Depois rode o ficheiro seed_admin.sql no SQL Editor. ' +
        'Confirme também que VITE_SUPABASE_URL no .env é o mesmo projeto (Settings → API).'
      );
    }
    return (
      'E-mail ou senha incorretos — ou usuário inexistente neste projeto Supabase. ' +
      'Confira Authentication → Users e se o .env é do mesmo projeto (Settings → API).'
    );
  }
  if (m.includes('email not confirmed')) {
    return (
      'Confirme o e-mail ou desative "Confirm email" em Authentication → Providers → Email (dev).'
    );
  }
  if (m.includes('fetch') || m.includes('network') || m.includes('failed to fetch')) {
    return 'Sem internet ou URL do Supabase inválida.';
  }
  return err.message;
}

function fallbackUser(session: Session): User {
  const email = session.user.email ?? '';
  return {
    username: (email.split('@')[0] || 'usuario').toLowerCase(),
    nome: String(session.user.user_metadata?.full_name ?? email.split('@')[0] ?? ''),
    email,
    setor: '—',
    tipo: 'B',
  };
}

const PROFILE_FETCH_TIMEOUT_MS = 12_000;

async function resolveProfileUser(
  userId: string,
  email: string,
  session: Session
): Promise<User> {
  try {
    const u = await Promise.race([
      fetchProfileForUser(userId, email),
      new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), PROFILE_FETCH_TIMEOUT_MS)
      ),
    ]);
    return u ?? fallbackUser(session);
  } catch {
    return fallbackUser(session);
  }
}

export type RegisterResult =
  | { ok: true; needsEmailConfirmation: boolean }
  | { ok: false; error: string };

interface AuthState {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<RegisterResult>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  ready: false,
  login: async (email, password) => {
    if (!isSupabaseConfigured()) {
      return { ok: false, error: ENV_MISSING };
    }
    const emailForAuth = canonicalLoginEmail(email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailForAuth,
        password,
      });
      if (error) {
        return { ok: false, error: mapAuthError(error, emailForAuth) };
      }
      if (!data.user || !data.session) return { ok: false, error: 'Sem sessão.' };
      const u = await resolveProfileUser(
        data.user.id,
        data.user.email ?? emailForAuth,
        data.session
      );
      set({ user: u });
      void import('@/store/lcStore').then(({ useLCStore }) =>
        useLCStore.getState().hydrate()
      );
      return { ok: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { ok: false, error: mapAuthError({ message: msg }) };
    }
  },
  register: async (email, password, fullName) => {
    if (!isSupabaseConfigured()) {
      return { ok: false, error: ENV_MISSING };
    }
    const trimmed = email.trim().toLowerCase();
    const name = fullName.trim();
    if (!name) {
      return { ok: false, error: 'Informe o nome completo.' };
    }
    if (password.length < 6) {
      return { ok: false, error: 'A senha deve ter pelo menos 6 caracteres.' };
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmed,
        password,
        options: {
          data: { full_name: name },
        },
      });
      if (error) {
        return { ok: false, error: mapAuthError(error) };
      }
      if (!data.user) {
        return { ok: false, error: 'Não foi possível criar a conta.' };
      }
      if (data.session) {
        const u = await resolveProfileUser(
          data.user.id,
          data.user.email ?? trimmed,
          data.session
        );
        set({ user: u });
        void import('@/store/lcStore').then(({ useLCStore }) =>
          useLCStore.getState().hydrate()
        );
        return { ok: true, needsEmailConfirmation: false };
      }
      return { ok: true, needsEmailConfirmation: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { ok: false, error: mapAuthError({ message: msg }) };
    }
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error && import.meta.env.DEV) {
      console.warn('[TISIGE] signOut:', error.message);
    }
    clearSupabaseAuthStorage();
    set({ user: null });
    const { useLCStore } = await import('@/store/lcStore');
    useLCStore.getState().clear();
  },
}));

export async function hydrateAuthUser(session: Session | null): Promise<void> {
  if (!session?.user) {
    useAuthStore.setState({ user: null });
    return;
  }
  const u = await resolveProfileUser(
    session.user.id,
    session.user.email ?? '',
    session
  );
  useAuthStore.setState({ user: u });
}
