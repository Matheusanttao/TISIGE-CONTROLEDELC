import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { PageLayout } from '../components/PageLayout';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { TextField } from '../components/TextField';
import type { RootStackParamList } from '../navigation/types';
import { getSupabaseProjectHost, isSupabaseConfigured } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const login = useAuthStore((s) => s.login);
  const { height } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const isWeb = Platform.OS === 'web';

  const onSubmit = async () => {
    setLoading(true);
    try {
      const r = await login(email.trim(), pass);
      if (!r.ok) {
        Alert.alert('Login', r.error ?? 'Falha ao entrar.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            isWeb && height > 640 && styles.scrollWebCenter,
            isWeb && { minHeight: height - 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <PageLayout maxWidth={440}>
            <LinearGradient
              colors={['rgba(34,211,238,0.2)', 'transparent']}
              style={styles.hero}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            >
              <View style={styles.badge}>
                <Text style={styles.badgeText}>TISIGE</Text>
              </View>
              <Text style={styles.h1}>Controle de LC</Text>
              <Text style={styles.sub}>
                E-mail ou usuário (atalho: admin / admin)
              </Text>
            </LinearGradient>

            {!isSupabaseConfigured() ? (
              <View style={styles.warnBox}>
                <Text style={styles.warnText}>
                  Supabase não configurado: crie o arquivo .env na pasta TISIGE-Mobile com
                  EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY (veja .env.example) e
                  reinicie o Expo.
                </Text>
              </View>
            ) : __DEV__ ? (
              <Text style={styles.devProject}>
                Projeto Supabase (confira no Dashboard): {getSupabaseProjectHost() ?? '?'}
              </Text>
            ) : null}

            <View style={styles.card}>
              <TextField
                label="E-mail ou usuário"
                value={email}
                onChangeText={setEmail}
                placeholder="admin ou nome@empresa.com.br"
                autoCapitalize="none"
                keyboardType="default"
              />
              <TextField
                label="Senha"
                value={pass}
                onChangeText={setPass}
                placeholder="••••••••"
                secureTextEntry
              />
              <PrimaryButton
                title="Entrar"
                onPress={onSubmit}
                loading={loading}
                disabled={!email.trim() || !pass}
              />
              <PrimaryButton
                title="Criar conta"
                variant="ghost"
                onPress={() => navigation.navigate('Register')}
              />
              <PrimaryButton
                title="Esqueci minha senha"
                variant="ghost"
                onPress={() => navigation.navigate('ForgotPassword')}
              />
            </View>

            <Text style={styles.footerHint}>
              Admin: no login use utilizador «admin» e senha «admin» (equivale a admin@admin.local).
              Crie o utilizador no Supabase (ou npm run seed:admin no TISIGE-Web com service_role) e rode
              seed_admin.sql; no site web, menu Usuários para permissões.
            </Text>
          </PageLayout>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  scrollWebCenter: {
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
  },
  badge: {
    backgroundColor: 'rgba(34,211,238,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    marginBottom: spacing.md,
  },
  badgeText: {
    color: colors.accent,
    fontWeight: '800',
    letterSpacing: 3,
    fontSize: 11,
  },
  h1: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  sub: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 15,
  },
  devProject: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  warnBox: {
    backgroundColor: 'rgba(185, 28, 28, 0.2)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.5)',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  warnText: {
    color: colors.danger,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  footerHint: {
    marginTop: spacing.lg,
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});
