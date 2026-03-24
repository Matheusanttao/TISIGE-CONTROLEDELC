import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PageLayout } from '../components/PageLayout';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { TextField } from '../components/TextField';
import type { RootStackParamList } from '../navigation/types';
import { useLCStore } from '../store/lcStore';
import { computeGestaoDates } from '../utils/gestaoLcFinal';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList, 'GestaoLcFinal'>;

type Props = { route: { params: { os?: string } } };

export function GestaoLcFinalScreen({ route }: Props) {
  const navigation = useNavigation<Nav>();
  const items = useLCStore((s) => s.items);
  const findByOs = useLCStore((s) => s.findByOs);

  const [osInput, setOsInput] = useState(route.params.os ?? '');
  const [baseIso, setBaseIso] = useState('');

  const selected = useMemo(() => {
    const t = osInput.trim();
    if (!t) return undefined;
    return findByOs(t);
  }, [osInput, findByOs]);

  useEffect(() => {
    if (selected?.dataLimiteTestes) {
      setBaseIso(selected.dataLimiteTestes);
    } else if (selected?.dtRecebimento) {
      setBaseIso(selected.dtRecebimento);
    } else {
      setBaseIso('');
    }
  }, [selected]);

  const dates = useMemo(() => {
    if (!baseIso || baseIso.length < 10) return null;
    try {
      return computeGestaoDates(baseIso);
    } catch {
      return null;
    }
  }, [baseIso]);

  const onBuscar = () => {
    const t = osInput.trim();
    if (!t) return;
    const row = findByOs(t);
    if (!row) {
      navigation.navigate('OsInexistente', { os: t });
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.scroll}>
        <PageLayout>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.back}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.title}>Gestão LC final</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.lead}>
          Informe a OS e a data limite para testes finais. Os prazos ao PCP (+5 dias) e ao
          comercial (+15 dias) são calculados automaticamente.
        </Text>

        <Text style={styles.label}>Selecionar OS cadastrada</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.osRow}>
          {items.map((x) => (
            <Pressable
              key={x.id}
              onPress={() => setOsInput(x.os)}
              style={[styles.osChip, osInput === x.os && styles.osChipOn]}
            >
              <Text style={[styles.osChipText, osInput === x.os && styles.osChipTextOn]}>
                {x.os}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <TextField label="OS" value={osInput} onChangeText={setOsInput} keyboardType="numeric" />
        <Pressable style={styles.buscar} onPress={onBuscar}>
          <Text style={styles.buscarText}>Verificar OS na base</Text>
        </Pressable>

        <TextField
          label="Data limite testes finais (AAAA-MM-DD)"
          value={baseIso}
          onChangeText={setBaseIso}
        />

        {dates && (
          <View style={styles.cards}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Testes finais</Text>
              <Text style={styles.cardDate}>{dates.limiteTestes}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Entrega LC ao PCP (+5)</Text>
              <Text style={styles.cardDate}>{dates.limitePcp}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Entrega LC ao comercial (+15)</Text>
              <Text style={styles.cardDate}>{dates.limiteComercial}</Text>
            </View>
          </View>
        )}

        {!selected && osInput.trim() ? (
          <Text style={styles.warn}>
            OS não encontrada no cadastro local. Cadastre em Controle de LC ou ajuste o número.
          </Text>
        ) : null}
        </PageLayout>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  back: { padding: spacing.sm },
  title: { color: colors.text, fontSize: 18, fontWeight: '800' },
  scroll: { padding: spacing.md, paddingBottom: 48 },
  lead: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  osRow: { marginBottom: spacing.md, maxHeight: 44 },
  osChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    backgroundColor: colors.surface,
  },
  osChipOn: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(34,211,238,0.15)',
  },
  osChipText: { color: colors.textMuted, fontWeight: '600' },
  osChipTextOn: { color: colors.accent },
  buscar: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buscarText: { color: colors.accent, fontWeight: '700', fontSize: 14 },
  cards: { gap: 12 },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  cardTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  cardDate: { color: colors.accent, fontSize: 28, fontWeight: '800' },
  warn: { color: colors.warning, marginTop: spacing.md, fontSize: 13 },
});
