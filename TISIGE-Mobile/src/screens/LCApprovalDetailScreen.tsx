import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { PageLayout } from '../components/PageLayout';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { StatusBadge } from '../components/StatusBadge';
import type { RootStackParamList } from '../navigation/types';
import { canApprove } from '../auth/permissions';
import { useAuthStore } from '../store/authStore';
import { useLCStore } from '../store/lcStore';
import { isoToBR } from '../utils/gestaoLcFinal';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList, 'LCApprovalDetail'>;
type Props = { route: { params: { id: string } } };

export function LCApprovalDetailScreen({ route }: Props) {
  const navigation = useNavigation<Nav>();
  const { id } = route.params;
  const user = useAuthStore((s) => s.user);
  const findById = useLCStore((s) => s.findById);
  const approve = useLCStore((s) => s.approve);
  const reject = useLCStore((s) => s.reject);

  const row = findById(id);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [busy, setBusy] = useState(false);

  if (!row) {
    return (
      <ScreenWrapper>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.back}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.title}>LC não encontrada</Text>
          <View style={{ width: 40 }} />
        </View>
      </ScreenWrapper>
    );
  }

  const onApprove = async () => {
    setBusy(true);
    try {
      const r = await approve(id, user?.nome ?? 'Aprovador');
      if (!r.ok) {
        Alert.alert('Aprovação', r.error ?? 'Erro');
        return;
      }
      navigation.goBack();
    } finally {
      setBusy(false);
    }
  };

  const onRejectSubmit = async () => {
    setBusy(true);
    try {
      const r = await reject(id, motivo);
      if (!r.ok) {
        Alert.alert('Reprovação', r.error ?? 'Erro');
        return;
      }
      setRejectOpen(false);
      setMotivo('');
      navigation.goBack();
    } finally {
      setBusy(false);
    }
  };

  const pending = row.statusAprovacao === 'aguardando_aprovacao';
  const allowDecision = pending && canApprove(user);

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>OS {row.os}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <PageLayout>
          <View style={styles.badgeRow}>
            <StatusBadge status={row.statusAprovacao} />
          </View>

          <Field k="Arquivo" v={row.arquivo || '—'} />
          <Field k="Cliente" v={row.cliente} />
          <Field k="Equipamento" v={row.equipamento} />
          <Field k="Contrato" v={isoToBR(row.dtContratual)} />
          <Field k="Recebimento" v={isoToBR(row.dtRecebimento)} />
          <Field k="Setor" v={row.setor} />
          <Field k="Gaveta" v={row.gaveta || '—'} />

          {allowDecision ? (
            <View style={styles.actions}>
              <PrimaryButton
                title="Aprovar"
                onPress={onApprove}
                loading={busy}
                icon={<Ionicons name="checkmark-circle" size={22} color="#042f2e" />}
              />
              <PrimaryButton
                title="Reprovar"
                variant="danger"
                onPress={() => setRejectOpen(true)}
                loading={busy}
              />
            </View>
          ) : pending ? (
            <Text style={styles.hint}>
              Apenas usuários do perfil &quot;Aprovação técnica&quot; podem decidir
              nesta tela.
            </Text>
          ) : (
            <Text style={styles.hint}>
              Esta LC não está aguardando aprovação. Use a lista de aprovação para
              itens pendentes.
            </Text>
          )}
        </PageLayout>
      </ScrollView>

      <Modal visible={rejectOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Motivo da reprovação</Text>
            <Text style={styles.modalSub}>
              O desenhista verá esta mensagem nas notificações e poderá corrigir a
              LC.
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Descreva o que precisa ser corrigido"
              placeholderTextColor={colors.textMuted}
              value={motivo}
              onChangeText={setMotivo}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalBtns}>
              <Pressable
                onPress={() => {
                  setRejectOpen(false);
                  setMotivo('');
                }}
                style={styles.modalGhost}
              >
                <Text style={styles.modalGhostTxt}>Cancelar</Text>
              </Pressable>
              <PrimaryButton
                title="Confirmar reprovação"
                variant="danger"
                onPress={onRejectSubmit}
                loading={busy}
                disabled={!motivo.trim()}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.k}>{k}</Text>
      <Text style={styles.v}>{v}</Text>
    </View>
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
  badgeRow: { marginBottom: spacing.md },
  field: {
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  k: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  v: { color: colors.text, fontSize: 16, marginTop: 4 },
  actions: { gap: spacing.sm, marginTop: spacing.md },
  hint: { color: colors.textMuted, fontSize: 14, lineHeight: 20, marginTop: spacing.md },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  modalSub: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalBtns: { marginTop: spacing.md, gap: spacing.sm },
  modalGhost: { alignItems: 'center', padding: spacing.sm },
  modalGhostTxt: { color: colors.textMuted, fontWeight: '600' },
});
