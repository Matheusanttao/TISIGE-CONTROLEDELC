import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  canAccessPcpFabricacao,
  canApprove,
  canManageUsers,
  canViewGerenciaDashboard,
  resolvePapel,
} from '../auth/permissions';
import { MenuCard } from '../components/MenuCard';
import { PageLayout } from '../components/PageLayout';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useResponsive } from '../hooks/useResponsive';
import type { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import type { PapelUsuario } from '../types/models';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const PAPEL_LABEL: Record<PapelUsuario, string> = {
  admin: 'Admin',
  desenhista: 'Desenho',
  aprovador: 'Aprovação',
  pcp: 'PCP',
  gerencia: 'Gerência',
  visualizador: 'Leitura',
};

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { menuColumns } = useResponsive();
  const unread = useNotificationStore((s) => s.items.filter((x) => !x.read).length);
  const papel = resolvePapel(user);
  const showAprovacao = user ? canApprove(user) : false;
  const showPcpFab = user ? canAccessPcpFabricacao(user) : false;
  const showGerencia = user ? canViewGerenciaDashboard(user) : false;
  const showAdminUsers = user ? canManageUsers(user) : false;

  const onLogout = () => {
    Alert.alert('Sair da conta', 'Encerrar sessão para entrar com outro usuário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          void logout();
        },
      },
    ]);
  };

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <PageLayout>
          <View style={styles.top}>
            <View style={{ flex: 1 }}>
              <Text style={styles.hello}>Bem-vindo</Text>
              <Text style={styles.name} numberOfLines={2}>
                {user?.nome ?? 'Usuário'}
              </Text>
              <View style={styles.pillRow}>
                <View style={styles.pill}>
                  <Ionicons name="business-outline" size={14} color={colors.accent} />
                  <Text style={styles.pillText}>{user?.setor ?? '—'}</Text>
                </View>
                <View style={styles.pill}>
                  <Ionicons name="people-outline" size={14} color={colors.warning} />
                  <Text style={styles.pillText}>{PAPEL_LABEL[papel]}</Text>
                </View>
                <View style={[styles.pill, user?.tipo === 'B' && styles.pillMuted]}>
                  <Ionicons
                    name={user?.tipo === 'A' ? 'create-outline' : 'eye-outline'}
                    size={14}
                    color={user?.tipo === 'A' ? colors.success : colors.textMuted}
                  />
                  <Text style={styles.pillText}>
                    {user?.tipo === 'A' ? 'Edição' : 'Somente leitura'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.topActions}>
              <Pressable
                onPress={() => navigation.navigate('Notifications')}
                style={styles.bellBtn}
                accessibilityRole="button"
                accessibilityLabel="Notificações"
              >
                <Ionicons name="notifications-outline" size={26} color={colors.text} />
                {unread > 0 ? (
                  <View style={styles.bellBadge}>
                    <Text style={styles.bellBadgeTxt}>{unread > 9 ? '9+' : unread}</Text>
                  </View>
                ) : null}
              </Pressable>
              <Pressable
                onPress={onLogout}
                style={styles.exitBtn}
                accessibilityRole="button"
                accessibilityLabel="Sair da conta"
              >
                <Ionicons name="log-out-outline" size={24} color={colors.danger} />
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate('Profile')}
                style={styles.avatarBtn}
                accessibilityRole="button"
                accessibilityLabel="Abrir perfil"
              >
                <LinearGradient
                  colors={['rgba(34,211,238,0.35)', 'rgba(99,102,241,0.2)']}
                  style={styles.avatarRing}
                >
                  <Ionicons name="person" size={28} color={colors.text} />
                </LinearGradient>
              </Pressable>
            </View>
          </View>

          <LinearGradient
            colors={[colors.bgElevated, 'rgba(26,35,50,0.6)']}
            style={styles.heroCard}
          >
            <Text style={styles.heroTitle}>Painel</Text>
            <Text style={styles.heroSub}>
              Fluxo de desenho/LC: cadastro, aprovação técnica, PCP e acompanhamento.
            </Text>
          </LinearGradient>

          <Text style={styles.section}>Módulos</Text>

          <View
            style={[
              styles.menuGrid,
              menuColumns === 2 && styles.menuGridDesktop,
              Platform.OS === 'web' && menuColumns === 2 && styles.menuGridWeb,
            ]}
          >
            <MenuCard
              title="Controle de LC"
              subtitle="Lista, cadastro e detalhes (conforme seu perfil)"
              icon="list-outline"
              onPress={() => navigation.navigate('ControleLC')}
              containerStyle={menuColumns === 2 ? styles.menuCellDesktop : undefined}
            />
            {showAprovacao && (
              <MenuCard
                title="Aprovação técnica"
                subtitle="Fila de LCs aguardando aprovação ou reprovação"
                icon="shield-checkmark-outline"
                accent="#fbbf24"
                onPress={() => navigation.navigate('AprovacaoLC')}
                containerStyle={menuColumns === 2 ? styles.menuCellDesktop : undefined}
              />
            )}
            {showPcpFab && (
              <MenuCard
                title="PCP — Fabricação"
                subtitle="LCs aprovadas e marcação para programação"
                icon="construct-outline"
                accent="#22d3ee"
                onPress={() => navigation.navigate('PcpFabricacao')}
                containerStyle={menuColumns === 2 ? styles.menuCellDesktop : undefined}
              />
            )}
            {showGerencia && (
              <MenuCard
                title="Painel gerencial"
                subtitle="Status do fluxo e visão consolidada"
                icon="stats-chart-outline"
                accent="#c084fc"
                onPress={() => navigation.navigate('GerenciaDashboard')}
                containerStyle={menuColumns === 2 ? styles.menuCellDesktop : undefined}
              />
            )}
            {showAdminUsers && (
              <MenuCard
                title="Usuários (admin)"
                subtitle="Listar e definir tipo (A/B) e papel de cada um"
                icon="people-circle-outline"
                accent="#fb7185"
                onPress={() => navigation.navigate('AdminUsers')}
                containerStyle={menuColumns === 2 ? styles.menuCellDesktop : undefined}
              />
            )}
            <MenuCard
              title="Gestão LC final"
              subtitle="Prazos de testes, PCP e comercial por OS"
              icon="calendar-outline"
              accent="#a78bfa"
              onPress={() => navigation.navigate('GestaoLcFinal', {})}
              containerStyle={menuColumns === 2 ? styles.menuCellDesktop : undefined}
            />
            <MenuCard
              title="Gestão geral LC final"
              subtitle="Visão consolidada e status de finalização"
              icon="grid-outline"
              accent="#34d399"
              onPress={() => navigation.navigate('GestaoLcFinalGeral')}
              containerStyle={menuColumns === 2 ? styles.menuCellDesktop : undefined}
            />
          </View>

          <Pressable
            style={styles.profileLink}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="settings-outline" size={18} color={colors.textMuted} />
            <Text style={styles.profileLinkText}>Minha conta e dados</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>

          <PrimaryButton
            title="Sair da conta"
            variant="danger"
            onPress={onLogout}
            icon={<Ionicons name="log-out-outline" size={20} color="#fff" />}
          />
        </PageLayout>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  exitBtn: { padding: spacing.sm },
  bellBtn: { padding: spacing.sm, position: 'relative' },
  bellBadge: {
    position: 'absolute',
    top: 4,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  bellBadgeTxt: { color: '#fff', fontSize: 10, fontWeight: '800' },
  hello: { color: colors.textMuted, fontSize: 14 },
  name: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 4,
  },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillMuted: { opacity: 0.9 },
  pillText: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  avatarBtn: { padding: 2 },
  avatarRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.35)',
  },
  heroCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSub: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  menuGrid: {
    width: '100%',
  },
  menuGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  menuGridWeb: {
    /** gap + wrap estável no Chrome */
    rowGap: 12,
    columnGap: 12,
  },
  /** Dois cartões por linha no PC (48% + gap). */
  menuCellDesktop: {
    width: '48%',
    minWidth: 260,
    marginBottom: 12,
  },
  profileLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  profileLinkText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
});
