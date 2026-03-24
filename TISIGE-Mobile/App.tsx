import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { isSupabaseConfigured, supabase } from './src/lib/supabase';
import { hydrateAuthUser, useAuthStore } from './src/store/authStore';
import { useLCStore } from './src/store/lcStore';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/colors';

const BOOT_TIMEOUT_MS = 25_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error(`timeout ${ms}ms`)), ms);
    promise.then(
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

export default function App() {
  const ready = useAuthStore((s) => s.ready);

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      if (!isSupabaseConfigured()) {
        if (__DEV__) {
          console.warn(
            '[TISIGE] Defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no .env e reinicie o Expo.'
          );
        }
        useAuthStore.setState({ user: null, ready: true });
        useLCStore.getState().clear();
        return;
      }

      try {
        const { data } = await withTimeout(
          supabase.auth.getSession(),
          BOOT_TIMEOUT_MS
        );
        if (!mounted) return;
        const session = data.session;
        if (session) {
          await withTimeout(
            (async () => {
              await hydrateAuthUser(session);
              await useLCStore.getState().hydrate();
            })(),
            BOOT_TIMEOUT_MS
          );
        } else {
          useAuthStore.setState({ user: null });
          useLCStore.getState().clear();
        }
      } catch (e) {
        if (__DEV__) {
          console.warn('[TISIGE] Falha ao iniciar sessão (rede ou timeout):', e);
        }
        useAuthStore.setState({ user: null });
        useLCStore.getState().clear();
      } finally {
        useAuthStore.setState({ ready: true });
      }
    };

    void boot();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        if (session) {
          await hydrateAuthUser(session);
          await useLCStore.getState().hydrate();
        } else {
          useAuthStore.setState({ user: null });
          useLCStore.getState().clear();
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        {!ready ? (
          <View style={styles.boot}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.bootHint}>Carregando…</Text>
          </View>
        ) : (
          <RootNavigator />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  boot: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    minHeight: '100%',
  },
  bootHint: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
