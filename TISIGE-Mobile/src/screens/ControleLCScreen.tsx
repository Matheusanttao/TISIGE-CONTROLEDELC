import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  canCreateLC,
  canEditLCRecord,
} from '../auth/permissions';
import { PageLayout } from '../components/PageLayout';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { StatusBadge } from '../components/StatusBadge';
import { useResponsive } from '../hooks/useResponsive';
import type { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/authStore';
import { useLCStore } from '../store/lcStore';
import type { ControleLC } from '../types/models';
import { isoToBR } from '../utils/gestaoLcFinal';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ControleLC'>;

export function ControleLCScreen() {
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const items = useLCStore((s) => s.items);
  const loading = useLCStore((s) => s.loading);
  const error = useLCStore((s) => s.error);
  const hydrate = useLCStore((s) => s.hydrate);
  const remove = useLCStore((s) => s.remove);

  useFocusEffect(
    useCallback(() => {
      void hydrate();
    }, [hydrate])
  );
  const fabOk = canCreateLC(user);

  const [q, setQ] = useState('');
  const { listColumns } = useResponsive();

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter(
      (row) =>
        row.os.toLowerCase().includes(t) ||
        row.cliente.toLowerCase().includes(t) ||
        row.equipamento.toLowerCase().includes(t)
    );
  }, [items, q]);

  const confirmDelete = (row: ControleLC) => {
    Alert.alert('Excluir LC', `Remover OS ${row.os}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await remove(row.id);
          } catch (e) {
            Alert.alert(
              'Erro',
              e instanceof Error ? e.message : 'Não foi possível excluir.'
            );
          }
        },
      },
    ]);
  };

  const openRow = (item: ControleLC) => {
    if (canEditLCRecord(user, item)) {
      navigation.navigate('LCForm', { mode: 'edit', id: item.id });
    } else {
      navigation.navigate('LCForm', { mode: 'view', id: item.id });
    }
  };

  const renderItem = ({ item }: { item: ControleLC }) => {
    const canEdit = canEditLCRecord(user, item);
    const card = (
      <Pressable style={styles.row} onPress={() => openRow(item)}>
        <View style={styles.rowTop}>
          <Text style={styles.os}>OS {item.os}</Text>
          <StatusBadge status={item.statusAprovacao} />
        </View>
        <Text style={styles.client}>{item.cliente}</Text>
        <Text style={styles.equip} numberOfLines={2}>
          {item.equipamento}
        </Text>
        <View style={styles.rowMeta}>
          <Text style={styles.meta}>Contrato {isoToBR(item.dtContratual)}</Text>
          <Text style={styles.meta}>Receb. {isoToBR(item.dtRecebimento)}</Text>
        </View>
        {item.programadoFabricacao && (
          <View style={styles.pcpTag}>
            <Text style={styles.pcpTagTxt}>Programado fabricação</Text>
          </View>
        )}
        {canEdit && (
          <View style={styles.actions}>
            <Pressable
              onPress={() => navigation.navigate('LCForm', { mode: 'edit', id: item.id })}
              style={styles.iconBtn}
            >
              <Ionicons name="create-outline" size={22} color={colors.accent} />
            </Pressable>
            <Pressable onPress={() => confirmDelete(item)} style={styles.iconBtn}>
              <Ionicons name="trash-outline" size={22} color={colors.danger} />
            </Pressable>
          </View>
        )}
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
            <Text style={styles.title}>Controle de LC</Text>
            <View style={{ width: 40 }} />
          </View>

          {error ? (
            <View style={styles.errBox}>
              <Text style={styles.errText}>{error}</Text>
              <PrimaryButton
                title="Tentar novamente"
                variant="ghost"
                onPress={() => void hydrate()}
              />
            </View>
          ) : null}

          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por OS, cliente ou equipamento"
              placeholderTextColor={colors.textMuted}
              value={q}
              onChangeText={setQ}
            />
          </View>

        {loading && items.length === 0 ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingTxt}>Carregando LCs…</Text>
          </View>
        ) : error ? null : (
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
                <Ionicons name="folder-open-outline" size={48} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>Nada por aqui</Text>
                <Text style={styles.empty}>
                  {q.trim()
                    ? 'Nenhum resultado para essa busca.'
                    : 'Nenhum registro ainda. Toque em Nova LC para começar.'}
                </Text>
              </View>
            }
          />
        )}
        </PageLayout>
      </View>

      {fabOk && (
        <View style={styles.fabWrap}>
          <PrimaryButton
            title="Nova LC"
            onPress={() => navigation.navigate('LCForm', { mode: 'create' })}
            icon={<Ionicons name="add" size={22} color="#042f2e" />}
          />
        </View>
      )}
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
  errBox: {
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
    gap: spacing.sm,
  },
  errText: {
    color: colors.danger,
    fontSize: 13,
  },
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  loadingTxt: { color: colors.textMuted, fontSize: 14 },
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
  searchInput: { flex: 1, color: colors.text, paddingVertical: spacing.sm + 2, fontSize: 16 },
  listFlex: { flex: 1, minHeight: 200 },
  list: { paddingBottom: 100, flexGrow: 1 },
  emptyWrap: { alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.md },
  emptyTitle: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
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
  os: { color: colors.accent, fontWeight: '800', fontSize: 16 },
  client: { color: colors.text, fontWeight: '600', flex: 1 },
  equip: { color: colors.textMuted, marginTop: 6, fontSize: 14 },
  rowMeta: { flexDirection: 'row', gap: 12, marginTop: 8 },
  meta: { color: colors.textMuted, fontSize: 12 },
  pcpTag: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: 'rgba(34,211,238,0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  pcpTagTxt: { color: colors.accent, fontSize: 11, fontWeight: '700' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  iconBtn: { padding: 4 },
  empty: { color: colors.textMuted, textAlign: 'center', fontSize: 14, lineHeight: 20 },
  fabWrap: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.lg,
  },
});
