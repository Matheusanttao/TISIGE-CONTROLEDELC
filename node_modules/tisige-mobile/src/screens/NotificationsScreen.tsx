import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PageLayout } from '../components/PageLayout';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import type { RootStackParamList } from '../navigation/types';
import { useNotificationStore } from '../store/notificationStore';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Notifications'>;

function formatWhen(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function NotificationsScreen() {
  const navigation = useNavigation<Nav>();
  const items = useNotificationStore((s) => s.items);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.scroll}>
        <PageLayout>
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} style={styles.back}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </Pressable>
            <Text style={styles.title}>Notificações</Text>
            <View style={{ width: 40 }} />
          </View>

          <Text style={styles.sub}>
            Alertas de reprovação e outros avisos deste dispositivo (persistidos localmente).
          </Text>

          {items.length > 0 && (
            <PrimaryButton
              title="Marcar todas como lidas"
              variant="ghost"
              onPress={markAllRead}
            />
          )}

          {items.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="notifications-off-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>Nenhuma notificação</Text>
              <Text style={styles.emptyTxt}>
                Quando uma LC for reprovada, o aviso aparecerá aqui.
              </Text>
            </View>
          ) : (
            items.map((n) => (
              <Pressable
                key={n.id}
                style={[styles.card, !n.read && styles.cardUnread]}
                onPress={() => {
                  markRead(n.id);
                  if (n.lcId) {
                    navigation.navigate('LCForm', { mode: 'view', id: n.lcId });
                  }
                }}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.cardTitle}>{n.title}</Text>
                  <Text style={styles.cardWhen}>{formatWhen(n.createdAt)}</Text>
                </View>
                <Text style={styles.cardBody}>{n.body}</Text>
                {n.lcId && (
                  <Text style={styles.cardHint}>Toque para ver a LC</Text>
                )}
              </Pressable>
            ))
          )}
        </PageLayout>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xxl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  back: { padding: spacing.sm },
  title: { color: colors.text, fontSize: 18, fontWeight: '800' },
  sub: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  empty: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyTitle: {
    color: colors.text,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptyTxt: { color: colors.textMuted, textAlign: 'center', paddingHorizontal: spacing.md },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardUnread: {
    borderColor: 'rgba(34,211,238,0.45)',
    backgroundColor: 'rgba(34,211,238,0.06)',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  cardTitle: { color: colors.text, fontWeight: '800', flex: 1 },
  cardWhen: { color: colors.textMuted, fontSize: 11 },
  cardBody: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  cardHint: { color: colors.accent, fontSize: 12, marginTop: 8, fontWeight: '600' },
});
