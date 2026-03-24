import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

const PERFIS_SISTEMA: { titulo: string; descricao: string }[] = [
  { titulo: 'Admin', descricao: 'Gestão de usuários e permissões no sistema.' },
  {
    titulo: 'Desenho (desenhista)',
    descricao: 'Cadastra e edita LC em rascunho; envia para aprovação.',
  },
  { titulo: 'Aprovação', descricao: 'Aprova ou reprova solicitações técnicas.' },
  { titulo: 'PCP', descricao: 'Fabricação e programação.' },
  { titulo: 'Gerência', descricao: 'Visão gerencial e indicadores.' },
  { titulo: 'Leitura', descricao: 'Somente visualização, sem editar dados.' },
];

type Nav = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const register = useAuthStore((s) => s.register);
  const { height } = useWindowDimensions();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [loading, setLoading] = useState(false);
  const isWeb = Platform.OS === 'web';

  const onSubmit = async () => {
    if (!fullName.trim()) {
      Alert.alert('Cadastro', 'Informe o nome completo.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Cadastro', 'Informe o e-mail.');
      return;
    }
    if (pass !== pass2) {
      Alert.alert('Cadastro', 'As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      const r = await register(email.trim(), pass, fullName.trim());
      if (!r.ok) {
        Alert.alert('Cadastro', r.error);
        return;
      }
      if (r.needsEmailConfirmation) {
        Alert.alert(
          'Confirme seu e-mail',
          'Enviamos um link de confirmação. Abra a caixa de entrada (e o spam) e clique no link para ativar a conta. Depois volte e faça login.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
        return;
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
            <View style={styles.topRow}>
              <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={12}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </Pressable>
            </View>

            <LinearGradient
              colors={['rgba(34,211,238,0.2)', 'transparent']}
              style={styles.hero}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            >
              <Text style={styles.h1}>Criar conta</Text>
              <Text style={styles.sub}>
                O perfil (Desenho, PCP, etc.) não se escolhe aqui: um administrador define depois. A
                conta começa em leitura até liberarem.
              </Text>
            </LinearGradient>

            <View style={styles.howBox}>
              <Text style={styles.howTitle}>Como ganho meu perfil?</Text>
              <Text style={styles.howBody}>
                1) Cadastre-se e entre.{'\n'}
                2) Peça ao administrador do TISIGE para te liberar.{'\n'}
                3) No site (web), ele abre o menu Usuários, escolhe seu e-mail e define Tipo + Papel.
                {'\n\n'}
                Se você administra o Supabase: Table Editor → profiles → edite tipo (A/B) e papel.
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Tipos de perfil (referência)</Text>
              {PERFIS_SISTEMA.map((p) => (
                <View key={p.titulo} style={styles.infoRow}>
                  <Text style={styles.infoBullet}>•</Text>
                  <Text style={styles.infoText}>
                    <Text style={styles.infoTitulo}>{p.titulo}</Text>
                    {' — '}
                    {p.descricao}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <TextField
                label="Nome completo *"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Seu nome"
                autoCapitalize="words"
              />
              <TextField
                label="E-mail *"
                value={email}
                onChangeText={setEmail}
                placeholder="nome@empresa.com.br"
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextField
                label="Senha * (mín. 6 caracteres)"
                value={pass}
                onChangeText={setPass}
                placeholder="••••••••"
                secureTextEntry
              />
              <TextField
                label="Confirmar senha *"
                value={pass2}
                onChangeText={setPass2}
                placeholder="••••••••"
                secureTextEntry
              />
              <PrimaryButton
                title="Cadastrar"
                onPress={onSubmit}
                loading={loading}
                disabled={!fullName.trim() || !email.trim() || !pass || !pass2}
              />
              <PrimaryButton
                title="Já tenho conta — entrar"
                variant="ghost"
                onPress={() => navigation.navigate('Login')}
              />
            </View>
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
  topRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  back: { padding: spacing.xs },
  hero: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  h1: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  sub: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: spacing.sm,
  },
  howBox: {
    backgroundColor: 'rgba(34, 211, 238, 0.06)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  howTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  howBody: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  infoTitle: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: spacing.xs,
  },
  infoBullet: {
    color: 'rgba(34, 211, 238, 0.75)',
    fontSize: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  infoTitulo: {
    color: colors.text,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
});
