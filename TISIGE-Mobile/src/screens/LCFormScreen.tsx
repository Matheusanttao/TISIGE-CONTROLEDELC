import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  canCreateLC,
  canEditLCRecord,
  canSubmitForApproval,
  resolvePapel,
} from '../auth/permissions';
import { PageLayout } from '../components/PageLayout';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { StatusBadge } from '../components/StatusBadge';
import { TextField } from '../components/TextField';
import type { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/authStore';
import { useLCStore } from '../store/lcStore';
import { SETORES, type ControleLC } from '../types/models';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList, 'LCForm'>;
type Props = { route: { params: { mode: 'create' | 'edit' | 'view'; id?: string } } };

const empty: Omit<ControleLC, 'id'> = {
  arquivo: '',
  os: '',
  cliente: '',
  equipamento: '',
  dtContratual: '',
  dtRecebimento: '',
  dtRetirada: '',
  respRetirada: '',
  setor: 'Teste',
  gaveta: '',
  dataLimiteTestes: '',
  gestaoFinalizado: false,
  statusAprovacao: 'rascunho',
  programadoFabricacao: false,
};

function isIsoDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export function LCFormScreen({ route }: Props) {
  const navigation = useNavigation<Nav>();
  const { mode, id } = route.params;
  const user = useAuthStore((s) => s.user);
  const add = useLCStore((s) => s.add);
  const update = useLCStore((s) => s.update);
  const findById = useLCStore((s) => s.findById);
  const fetchById = useLCStore((s) => s.fetchById);
  const submitForApproval = useLCStore((s) => s.submitForApproval);

  const [form, setForm] = useState<Omit<ControleLC, 'id'>>(empty);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const editing = mode === 'edit' && id;
  const viewing = mode === 'view' && id;
  const readOnly = mode === 'view';

  const row = id ? findById(id) : undefined;

  useEffect(() => {
    if (id && (editing || viewing) && !findById(id)) {
      void fetchById(id);
    }
  }, [id, editing, viewing, findById, fetchById]);

  useEffect(() => {
    if ((editing || viewing) && id) {
      const r = findById(id);
      if (r) {
        const { id: _, ...rest } = r;
        setForm({
          ...empty,
          ...rest,
          dtRetirada: rest.dtRetirada || '',
          dataLimiteTestes: rest.dataLimiteTestes || '',
          gaveta: rest.gaveta || '',
          motivoReprovacao: rest.motivoReprovacao,
        });
      }
    }
  }, [editing, viewing, id, row]);

  useEffect(() => {
    if (mode === 'edit' && row && user) {
      if (!canEditLCRecord(user, row)) {
        navigation.replace('LCForm', { mode: 'view', id: row.id });
      }
    }
  }, [mode, row, user, navigation]);

  const set =
    (key: keyof Omit<ControleLC, 'id'>) => (v: string) =>
      setForm((f) => ({ ...f, [key]: v }));

  const hintGaveta = useMemo(
    () => 'G1: 01–30 · G2: 31–60 · G3: 61+',
    []
  );

  const editable =
    !readOnly &&
    (mode === 'create'
      ? canCreateLC(user)
      : row
        ? canEditLCRecord(user, row)
        : false);

  const mergedForFlow: ControleLC | null = row
    ? { ...row, ...form, id: row.id }
    : null;
  const showSubmit =
    !readOnly &&
    mergedForFlow &&
    canSubmitForApproval(user, mergedForFlow) &&
    (mergedForFlow.statusAprovacao === 'rascunho' ||
      mergedForFlow.statusAprovacao === 'reprovado');

  const onSave = async () => {
    if (!form.os.trim() || !form.cliente.trim() || !form.equipamento.trim()) {
      Alert.alert('Validação', 'Preencha OS, cliente e equipamento.');
      return;
    }
    if (!isIsoDate(form.dtContratual) || !isIsoDate(form.dtRecebimento)) {
      Alert.alert('Validação', 'Datas contratual e recebimento devem estar em AAAA-MM-DD.');
      return;
    }
    if (form.dtRetirada && !isIsoDate(form.dtRetirada)) {
      Alert.alert('Validação', 'Data retirada inválida (use AAAA-MM-DD ou vazio).');
      return;
    }
    if (form.dataLimiteTestes && !isIsoDate(form.dataLimiteTestes)) {
      Alert.alert('Validação', 'Data limite testes inválida.');
      return;
    }

    setSaving(true);
    try {
      if (mode === 'create') {
        const r = await add(form);
        if (!r.ok) {
          Alert.alert('Cadastro', r.error ?? 'Erro');
          return;
        }
      } else if (id) {
        const r = await update(id, form);
        if (!r.ok) {
          Alert.alert('Atualizar', r.error ?? 'Erro');
          return;
        }
      }
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  const onSubmitApproval = () => {
    if (!id || !row) return;
    if (!form.os.trim() || !form.cliente.trim() || !form.equipamento.trim()) {
      Alert.alert('Validação', 'Preencha OS, cliente e equipamento antes de enviar.');
      return;
    }
    if (!isIsoDate(form.dtContratual) || !isIsoDate(form.dtRecebimento)) {
      Alert.alert('Validação', 'Datas contratual e recebimento devem estar em AAAA-MM-DD.');
      return;
    }
    Alert.alert(
      'Enviar para aprovação',
      'Os dados serão salvos e a LC ficará na fila do aprovador técnico. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: async () => {
            setSubmitting(true);
            try {
              const rUpdate = await update(id, form);
              if (!rUpdate.ok) {
                Alert.alert('Salvar', rUpdate.error ?? 'Erro');
                return;
              }
              const r = await submitForApproval(id);
              if (!r.ok) {
                Alert.alert('Envio', r.error ?? 'Erro');
                return;
              }
              navigation.goBack();
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const title =
    mode === 'create'
      ? 'Nova LC'
      : readOnly
        ? 'Detalhes da LC'
        : 'Editar LC';

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <PageLayout>
          {row && (
            <View style={styles.statusBlock}>
              <StatusBadge status={form.statusAprovacao} />
              {form.statusAprovacao === 'aprovado' && (
                <Text style={styles.statusMeta}>
                  {form.aprovadorNome
                    ? `Aprovado por ${form.aprovadorNome}`
                    : 'Aprovado'}{' '}
                  {form.aprovadoEm
                    ? `· ${new Date(form.aprovadoEm).toLocaleString('pt-BR')}`
                    : ''}
                </Text>
              )}
              {form.statusAprovacao === 'reprovado' && form.motivoReprovacao ? (
                <View style={styles.reproBox}>
                  <Text style={styles.reproLabel}>Motivo da reprovação</Text>
                  <Text style={styles.reproTxt}>{form.motivoReprovacao}</Text>
                </View>
              ) : null}
              {form.statusAprovacao === 'aprovado' && form.programadoFabricacao ? (
                <Text style={styles.tagPcp}>Programado para fabricação (PCP)</Text>
              ) : null}
            </View>
          )}

          <TextField
            label="Arquivo"
            value={form.arquivo}
            onChangeText={set('arquivo')}
            editable={editable}
          />
          <TextField
            label="OS *"
            value={form.os}
            onChangeText={set('os')}
            keyboardType="numeric"
            editable={editable && mode === 'create'}
          />
          <TextField
            label="Cliente *"
            value={form.cliente}
            onChangeText={set('cliente')}
            editable={editable}
          />
          <TextField
            label="Equipamento *"
            value={form.equipamento}
            onChangeText={set('equipamento')}
            multiline
            editable={editable}
          />
          <TextField
            label="Data contratual * (AAAA-MM-DD)"
            value={form.dtContratual}
            onChangeText={set('dtContratual')}
            editable={editable}
          />
          <TextField
            label="Data recebimento * (AAAA-MM-DD)"
            value={form.dtRecebimento}
            onChangeText={set('dtRecebimento')}
            editable={editable}
          />
          <TextField
            label="Data retirada (opcional)"
            value={form.dtRetirada || ''}
            onChangeText={set('dtRetirada')}
            editable={editable}
          />
          <TextField
            label="Responsável retirada"
            value={form.respRetirada}
            onChangeText={set('respRetirada')}
            editable={editable}
          />
          <TextField
            label="Gaveta"
            value={form.gaveta || ''}
            onChangeText={set('gaveta')}
            editable={editable}
          />
          <Text style={styles.small}>{hintGaveta}</Text>

          <Text style={styles.label}>Setor</Text>
          <View style={styles.chips}>
            {SETORES.map((s) => (
              <Pressable
                key={s}
                onPress={() => editable && setForm((f) => ({ ...f, setor: s }))}
                style={[
                  styles.chip,
                  form.setor === s && styles.chipOn,
                  !editable && styles.chipDisabled,
                ]}
              >
                <Text style={[styles.chipText, form.setor === s && styles.chipTextOn]}>
                  {s}
                </Text>
              </Pressable>
            ))}
          </View>

          <TextField
            label="Data limite testes finais (Gestão — AAAA-MM-DD)"
            value={form.dataLimiteTestes || ''}
            onChangeText={set('dataLimiteTestes')}
            editable={editable}
          />

          {readOnly && (
            <Text style={styles.readHint}>
              Perfil: {resolvePapel(user)} · Visualização somente leitura.
            </Text>
          )}

          {!readOnly && (
            <PrimaryButton title="Salvar" onPress={onSave} loading={saving} />
          )}
          {showSubmit && (
            <PrimaryButton
              title="Enviar para aprovação técnica"
              variant="ghost"
              onPress={onSubmitApproval}
              loading={submitting}
              icon={<Ionicons name="send-outline" size={20} color={colors.text} />}
            />
          )}
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
  small: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: -8,
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipOn: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(34,211,238,0.12)',
  },
  chipDisabled: { opacity: 0.65 },
  chipText: { color: colors.textMuted, fontSize: 13 },
  chipTextOn: { color: colors.accent, fontWeight: '700' },
  statusBlock: { marginBottom: spacing.lg, gap: spacing.sm },
  statusMeta: { color: colors.textMuted, fontSize: 12 },
  reproBox: {
    backgroundColor: 'rgba(248,113,113,0.08)',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.25)',
  },
  reproLabel: { color: colors.danger, fontWeight: '700', fontSize: 12, marginBottom: 6 },
  reproTxt: { color: colors.text, fontSize: 14, lineHeight: 20 },
  tagPcp: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 13,
  },
  readHint: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
});
