import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PageLayout } from '../components/PageLayout';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { resolvePapel } from '../auth/permissions';
import type { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/authStore';
import type { PapelUsuario } from '../types/models';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

const PAPEL_LABEL: Record<PapelUsuario, string> = {
  admin: 'Administrador (gestão de usuários)',
  desenhista: 'Desenho (cadastro / correções)',
  aprovador: 'Aprovação técnica',
  pcp: 'PCP — fabricação',
  gerencia: 'Gerência',
  visualizador: 'Somente leitura',
};

export function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const papel = resolvePapel(user);
  const logout = useAuthStore((s) => s.logout);

  const onLogout = () => {
    Alert.alert('Sair', 'Encerrar sessão neste dispositivo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <PageLayout maxWidth={480}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={56} color={colors.accent} />
        </View>
        <Text style={styles.name}>{user?.nome}</Text>
        <Text style={styles.meta}>@{user?.username}</Text>
        <View style={styles.row}>
          <Text style={styles.k}>E-mail</Text>
          <Text style={styles.v}>{user?.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.k}>Setor</Text>
          <Text style={styles.v}>{user?.setor}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.k}>Permissão</Text>
          <Text style={styles.v}>{user?.tipo === 'A' ? 'Edição' : 'Somente leitura'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.k}>Perfil no fluxo</Text>
          <Text style={styles.v}>{PAPEL_LABEL[papel]}</Text>
        </View>

        <Text style={styles.note}>
          Redefinição de senha: use &quot;Esqueci minha senha&quot; no login (e-mail do Supabase).
        </Text>

        <PrimaryButton title="Encerrar sessão" variant="danger" onPress={onLogout} />
      </View>
      </PageLayout>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingBottom: spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  back: { padding: spacing.sm },
  title: { color: colors.text, fontSize: 18, fontWeight: '800' },
  card: {
    padding: spacing.lg,
    backgroundColor: colors.bgElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    backgroundColor: 'rgba(34,211,238,0.08)',
  },
  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  meta: {
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  row: { marginBottom: spacing.sm },
  k: { color: colors.textMuted, fontSize: 12, marginBottom: 2 },
  v: { color: colors.text, fontSize: 16, fontWeight: '600' },
  note: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginVertical: spacing.lg,
  },
});
