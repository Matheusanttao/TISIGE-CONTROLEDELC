import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { PageLayout } from '../components/PageLayout';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { StatusBadge } from '../components/StatusBadge';
import { useResponsive } from '../hooks/useResponsive';
import type { RootStackParamList } from '../navigation/types';
import { useLCStore } from '../store/lcStore';
import type { ControleLC } from '../types/models';
import { isoToBR } from '../utils/gestaoLcFinal';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AprovacaoLC'>;

export function AprovacaoLCScreen() {
  const navigation = useNavigation<Nav>();
  const items = useLCStore((s) => s.items);
  const [q, setQ] = useState('');
  const { listColumns } = useResponsive();

  const pending = useMemo(
    () => items.filter((x) => x.statusAprovacao === 'aguardando_aprovacao'),
    [items]
  );

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return pending;
    return pending.filter(
      (row) =>
        row.os.toLowerCase().includes(t) ||
        row.cliente.toLowerCase().includes(t) ||
        row.equipamento.toLowerCase().includes(t)
    );
  }, [pending, q]);

  const renderItem = ({ item }: { item: ControleLC }) => {
    const card = (
      <Pressable
        style={styles.row}
        onPress={() => navigation.navigate('LCApprovalDetail', { id: item.id })}
      >
        <View style={styles.rowTop}>
          <Text style={styles.os}>OS {item.os}</Text>
          <StatusBadge status={item.statusAprovacao} />
        </View>
        <Text style={styles.client}>{item.cliente}</Text>
        <Text style={styles.equip} numberOfLines={2}>
          {item.equipamento}
        </Text>
        <Text style={styles.meta}>Receb. {isoToBR(item.dtRecebimento)}</Text>
      </Pressable>
    );
    if (listColumns === 1) return card;
    return <View style={styles.cellWrap}>{card}</View>;
  };

  return (
    <ScreenWrapper>
      <View style={styles.screenFlex}>
        <PageLayout>
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} style={styles.back}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </Pressable>
            <Text style={styles.title}>Aprovação técnica</Text>
            <View style={{ width: 40 }} />
          </View>

          <Text style={styles.sub}>
            LCs aguardando decisão ({pending.length})
          </Text>

          <View style={styles.searchBox}>
            <Ionicons
              name="search"
              size={20}
              color={colors.textMuted}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Filtrar por OS, cliente ou equipamento"
              placeholderTextColor={colors.textMuted}
              value={q}
              onChangeText={setQ}
            />
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(x) => x.id}
            key={listColumns}
            numColumns={listColumns}
            renderItem={renderItem}
            style={styles.listFlex}
            contentContainerStyle={styles.list}
            columnWrapperStyle={listColumns === 2 ? styles.columnWrap : undefined}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Ionicons
                  name="checkmark-done-outline"
                  size={48}
                  color={colors.textMuted}
                />
                <Text style={styles.emptyTitle}>Nada na fila</Text>
                <Text style={styles.empty}>
                  Não há LC aguardando aprovação no momento.
                </Text>
              </View>
            }
          />
        </PageLayout>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screenFlex: { flex: 1 },
  cellWrap: { flex: 1, paddingHorizontal: 4 },
  columnWrap: { marginBottom: 8, gap: 8 },
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
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: {
    flex: 1,
    color: colors.text,
    paddingVertical: spacing.sm + 2,
    fontSize: 16,
  },
  listFlex: { flex: 1, minHeight: 200 },
  list: { paddingBottom: 48, flexGrow: 1 },
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
  os: { color: colors.accent, fontWeight: '800', fontSize: 16 },
  client: { color: colors.text, fontWeight: '600' },
  equip: { color: colors.textMuted, marginTop: 4, fontSize: 14 },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: 8 },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  emptyTitle: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  empty: { color: colors.textMuted, textAlign: 'center', fontSize: 14 },
});
