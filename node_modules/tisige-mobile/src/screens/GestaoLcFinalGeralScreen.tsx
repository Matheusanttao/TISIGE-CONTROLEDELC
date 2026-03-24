import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { PageLayout } from '../components/PageLayout';
import { ScreenWrapper } from '../components/ScreenWrapper';
import type { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/authStore';
import { useLCStore } from '../store/lcStore';
import { computeGestaoDates } from '../utils/gestaoLcFinal';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList, 'GestaoLcFinalGeral'>;

export function GestaoLcFinalGeralScreen() {
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const items = useLCStore((s) => s.items);
  const toggle = useLCStore((s) => s.toggleGestaoFinal);
  const canToggle = user?.tipo === 'A';

  const rows = useMemo(() => {
    return items.map((row) => {
      const base = row.dataLimiteTestes || row.dtRecebimento;
      let d: ReturnType<typeof computeGestaoDates> | null = null;
      try {
        if (base && base.length >= 10) d = computeGestaoDates(base);
      } catch {
        d = null;
      }
      return { row, d };
    });
  }, [items]);

  return (
    <ScreenWrapper>
      <PageLayout>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Gestão geral</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.sub}>
        Prazos e status de finalização por OS
        {!canToggle ? ' · apenas perfil com edição (tipo A) altera o switch.' : ''}
      </Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {rows.map(({ row, d }) => (
          <View key={row.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.os}>OS {row.os}</Text>
              <View style={styles.finalRow}>
                <Text style={styles.finalLabel}>Finalizado</Text>
                <Switch
                  value={!!row.gestaoFinalizado}
                  disabled={!canToggle}
                  onValueChange={async (v) => {
                    try {
                      await toggle(row.id, v);
                    } catch (e) {
                      Alert.alert(
                        'Erro',
                        e instanceof Error ? e.message : 'Não foi possível atualizar.'
                      );
                    }
                  }}
                  trackColor={{ false: colors.surface, true: 'rgba(34,211,238,0.4)' }}
                  thumbColor={row.gestaoFinalizado ? colors.accent : colors.textMuted}
                />
              </View>
            </View>
            {d ? (
              <View style={styles.grid}>
                <View style={styles.cell}>
                  <Text style={styles.k}>Testes finais</Text>
                  <Text style={styles.v}>{d.limiteTestes}</Text>
                </View>
                <View style={styles.cell}>
                  <Text style={styles.k}>LC → PCP</Text>
                  <Text style={styles.v}>{d.limitePcp}</Text>
                </View>
                <View style={styles.cell}>
                  <Text style={styles.k}>LC → Comercial</Text>
                  <Text style={styles.v}>{d.limiteComercial}</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.missing}>Defina data limite testes na LC.</Text>
            )}
          </View>
        ))}
      </ScrollView>
      </PageLayout>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  back: { padding: spacing.sm },
  title: { color: colors.text, fontSize: 18, fontWeight: '800' },
  sub: {
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  scroll: { padding: spacing.md, paddingBottom: 48, gap: 12 },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  os: { color: colors.accent, fontWeight: '800', fontSize: 16 },
  finalRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  finalLabel: { color: colors.textMuted, fontSize: 13 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  cell: {
    flexGrow: 1,
    flexBasis: '30%',
    minWidth: 90,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  k: { color: colors.textMuted, fontSize: 11, fontWeight: '600', marginBottom: 4 },
  v: { color: colors.text, fontWeight: '700', fontSize: 14 },
  missing: { color: colors.warning, fontSize: 13, marginTop: 4 },
});
