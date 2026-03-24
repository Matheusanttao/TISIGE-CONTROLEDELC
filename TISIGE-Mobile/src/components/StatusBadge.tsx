import { StyleSheet, Text, View } from 'react-native';
import type { StatusAprovacao } from '../types/models';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

const MAP: Record<
  StatusAprovacao,
  { label: string; bg: string; fg: string }
> = {
  rascunho: {
    label: 'Rascunho',
    bg: 'rgba(148,163,184,0.25)',
    fg: colors.textMuted,
  },
  aguardando_aprovacao: {
    label: 'Aguardando aprovação',
    bg: 'rgba(251,191,36,0.2)',
    fg: '#fbbf24',
  },
  aprovado: {
    label: 'Aprovado',
    bg: 'rgba(52,211,153,0.18)',
    fg: colors.success,
  },
  reprovado: {
    label: 'Reprovado',
    bg: 'rgba(248,113,113,0.18)',
    fg: colors.danger,
  },
};

export function StatusBadge({ status }: { status: StatusAprovacao }) {
  const m = MAP[status];
  return (
    <View style={[styles.wrap, { backgroundColor: m.bg }]}>
      <Text style={[styles.txt, { color: m.fg }]}>{m.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  txt: { fontSize: 11, fontWeight: '800' },
});
