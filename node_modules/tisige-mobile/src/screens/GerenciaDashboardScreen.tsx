import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PageLayout } from '../components/PageLayout';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { StatusBadge } from '../components/StatusBadge';
import type { RootStackParamList } from '../navigation/types';
import { useLCStore } from '../store/lcStore';
import type { ControleLC, StatusAprovacao } from '../types/models';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList, 'GerenciaDashboard'>;

function countBy(items: ControleLC[], s: StatusAprovacao) {
  return items.filter((x) => x.statusAprovacao === s).length;
}

export function GerenciaDashboardScreen() {
  const navigation = useNavigation<Nav>();
  const items = useLCStore((s) => s.items);

  const stats = useMemo(() => {
    const programados = items.filter(
      (x) => x.statusAprovacao === 'aprovado' && x.programadoFabricacao
    ).length;
    return {
      total: items.length,
      rascunho: countBy(items, 'rascunho'),
      aguardando: countBy(items, 'aguardando_aprovacao'),
      aprovado: countBy(items, 'aprovado'),
      reprovado: countBy(items, 'reprovado'),
      programados,
    };
  }, [items]);

  const recent = useMemo(
    () => [...items].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 12),
    [items]
  );

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.scroll}>
        <PageLayout>
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} style={styles.back}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </Pressable>
            <Text style={styles.title}>Painel gerencial</Text>
            <View style={{ width: 40 }} />
          </View>

          <Text style={styles.sub}>
            Visão consolidada do fluxo de LCs / desenhos (status e programação).
          </Text>

          <View style={styles.grid}>
            <StatCard icon="layers-outline" label="Total" value={stats.total} tone="default" />
            <StatCard icon="document-outline" label="Rascunho" value={stats.rascunho} tone="muted" />
            <StatCard icon="time-outline" label="Aguardando" value={stats.aguardando} tone="warn" />
            <StatCard icon="checkmark-circle-outline" label="Aprovados" value={stats.aprovado} tone="ok" />
            <StatCard icon="close-circle-outline" label="Reprovados" value={stats.reprovado} tone="bad" />
            <StatCard icon="construct-outline" label="Prog. fabricação" value={stats.programados} tone="accent" />
          </View>

          <Text style={styles.section}>Registros recentes</Text>
          {recent.map((row) => (
            <Pressable
              key={row.id}
              style={styles.row}
              onPress={() =>
                navigation.navigate('LCForm', { mode: 'view', id: row.id })
              }
            >
              <View style={styles.rowTop}>
                <Text style={styles.os}>OS {row.os}</Text>
                <StatusBadge status={row.statusAprovacao} />
              </View>
              <Text style={styles.client} numberOfLines={1}>
                {row.cliente}
              </Text>
              {row.programadoFabricacao && (
                <View style={styles.tag}>
                  <Text style={styles.tagTxt}>Programado fabricação</Text>
                </View>
              )}
            </Pressable>
          ))}
        </PageLayout>
      </ScrollView>
    </ScreenWrapper>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
  tone: 'default' | 'muted' | 'warn' | 'ok' | 'bad' | 'accent';
}) {
  const border =
    tone === 'ok'
      ? 'rgba(52,211,153,0.35)'
      : tone === 'bad'
        ? 'rgba(248,113,113,0.35)'
        : tone === 'warn'
          ? 'rgba(251,191,36,0.35)'
          : tone === 'accent'
            ? 'rgba(34,211,238,0.35)'
            : colors.border;
  return (
    <View style={[styles.stat, { borderColor: border }]}>
      <Ionicons
        name={icon}
        size={22}
        color={colors.textMuted}
        style={{ marginBottom: 6 }}
      />
      <Text style={styles.statVal}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  stat: {
    width: '47%',
    minWidth: 140,
    flexGrow: 1,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  statVal: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  statLabel: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  section: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  row: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  os: { color: colors.accent, fontWeight: '800' },
  client: { color: colors.text, fontSize: 14 },
  tag: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: 'rgba(34,211,238,0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  tagTxt: { color: colors.accent, fontSize: 11, fontWeight: '700' },
});
