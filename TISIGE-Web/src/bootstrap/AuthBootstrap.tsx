import { useEffect } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { hydrateAuthUser, useAuthStore } from '@/store/authStore';
import { useLCStore } from '@/store/lcStore';

const BOOT_MS = 25_000;

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('timeout')), ms);
    p.then(
      (v) => {
        clearTimeout(id);
        resolve(v);
      },
      (e) => {
        clearTimeout(id);
        reject(e);
      }
    );
  });
}

/** Inicializa sessão Supabase (equivalente ao App.tsx do mobile). */
export function AuthBootstrap() {
  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      if (!isSupabaseConfigured()) {
        useAuthStore.setState({ user: null, ready: true });
        useLCStore.getState().clear();
        return;
      }
      try {
        const { data } = await withTimeout(supabase.auth.getSession(), BOOT_MS);
        if (!mounted) return;
        if (data.session) {
          await withTimeout(
            (async () => {
              await hydrateAuthUser(data.session);
              await useLCStore.getState().hydrate();
            })(),
            BOOT_MS
          );
        } else {
          useAuthStore.setState({ user: null });
          useLCStore.getState().clear();
        }
      } catch {
        useAuthStore.setState({ user: null });
        useLCStore.getState().clear();
      } finally {
        useAuthStore.setState({ ready: true });
      }
    };

    void boot();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (!mounted) return;
      if (session) {
        await hydrateAuthUser(session);
        await useLCStore.getState().hydrate();
      } else {
        useAuthStore.setState({ user: null });
        useLCStore.getState().clear();
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return null;
}
