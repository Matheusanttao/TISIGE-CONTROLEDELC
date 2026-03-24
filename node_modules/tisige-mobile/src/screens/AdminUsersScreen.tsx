import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { PapelUsuario, UserRole } from '../types/models';
import {
  fetchAllProfiles,
  updateProfileByAdmin,
  type ProfileListItem,
} from '../lib/adminUsers';
import { PageLayout } from '../components/PageLayout';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { hydrateAuthUser } from '../store/authStore';
import { supabase } from '../lib/supabase';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AdminUsers'>;

const PAPEIS: PapelUsuario[] = [
  'admin',
  'desenhista',
  'aprovador',
  'pcp',
  'gerencia',
  'visualizador',
];

const PAPEL_LABEL: Record<PapelUsuario, string> = {
  admin: 'Admin',
  desenhista: 'Desenho',
  aprovador: 'Aprovação',
  pcp: 'PCP',
  gerencia: 'Gerência',
  visualizador: 'Leitura',
};

export function AdminUsersScreen() {
  const navigation = useNavigation<Nav>();
  const [rows, setRows] = useState<ProfileListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [edit, setEdit] = useState<ProfileListItem | null>(null);
  const [tipo, setTipo] = useState<UserRole>('B');
  const [papel, setPapel] = useState<PapelUsuario>('desenhista');
  const [setor, setSetor] = useState('');
  const [nome, setNome] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const list = await fetchAllProfiles();
      setRows(list);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openEdit = (row: ProfileListItem) => {
    setEdit(row);
    setTipo(row.tipo);
    setPapel((row.papel as PapelUsuario) || 'desenhista');
    setSetor(row.setor ?? '');
    setNome(row.full_name ?? '');
  };

  const closeEdit = () => {
    setEdit(null);
  };

  const onSave = async () => {
    if (!edit) return;
    setSaving(true);
    try {
      await updateProfileByAdmin(edit.id, {
        tipo,
        papel,
        setor,
        full_name: nome,
      });
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && edit.id === session.user.id) {
        await hydrateAuthUser(session);
      }
      closeEdit();
      await load();
      Alert.alert('Salvo', 'Perfil atualizado.');
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  const renderItem = ({ item }: { item: ProfileListItem }) => (
    <Pressable style={styles.row} onPress={() => openEdit(item)}>
      <View style={styles.rowTop}>
        <Text style={styles.name} numberOfLines={1}>
          {item.full_name || item.email || '—'}
        </Text>
        <Text style={styles.badge}>{item.tipo}</Text>
      </View>
      <Text style={styles.email} numberOfLines={1}>
        {item.email}
      </Text>
      <Text style={styles.meta}>
        Papel: {PAPEL_LABEL[(item.papel as PapelUsuario) || 'visualizador']} · Setor:{' '}
        {item.setor || '—'}
      </Text>
      <Text style={styles.tap}>Toque para editar tipo, papel e setor</Text>
    </Pressable>
  );

  return (
    <ScreenWrapper>
      <View style={styles.screenFlex}>
        <PageLayout>
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} style={styles.back}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </Pressable>
            <Text style={styles.title}>Usuários</Text>
            <Pressable onPress={() => void load()} style={styles.back}>
              <Ionicons name="refresh" size={22} color={colors.accent} />
            </Pressable>
          </View>

          <Text style={styles.lead}>
            Defina quem é desenhista, aprovador, PCP, etc. Tipo A edita LCs no banco; tipo B é
            leitura.
          </Text>

          {err ? <Text style={styles.err}>{err}</Text> : null}

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.accent} />
            </View>
          ) : (
            <FlatList
              data={rows}
              keyExtractor={(x) => x.id}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
              ListEmptyComponent={
                <Text style={styles.empty}>Nenhum usuário encontrado.</Text>
              }
            />
          )}
        </PageLayout>
      </View>

      <Modal visible={!!edit} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar perfil</Text>
            <Text style={styles.modalEmail}>{edit?.email}</Text>

            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Nome completo"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.label}>Setor</Text>
            <TextInput
              style={styles.input}
              value={setor}
              onChangeText={setSetor}
              placeholder="Ex.: Engenharia"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.label}>Tipo (banco)</Text>
            <View style={styles.rowBtns}>
              {(['A', 'B'] as const).map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setTipo(t)}
                  style={[styles.chip, tipo === t && styles.chipOn]}
                >
                  <Text style={[styles.chipTxt, tipo === t && styles.chipTxtOn]}>
                    {t === 'A' ? 'A — edição' : 'B — leitura'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Papel no fluxo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.papelRow}>
              {PAPEIS.map((p) => (
                <Pressable
                  key={p}
                  onPress={() => setPapel(p)}
                  style={[styles.chipSm, papel === p && styles.chipOn]}
                >
                  <Text style={[styles.chipTxtSm, papel === p && styles.chipTxtOn]}>
                    {PAPEL_LABEL[p]}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <PrimaryButton title="Cancelar" variant="ghost" onPress={closeEdit} />
              <PrimaryButton title="Salvar" onPress={onSave} loading={saving} />
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screenFlex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  back: { padding: spacing.sm },
  title: { color: colors.text, fontSize: 18, fontWeight: '800' },
  lead: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  err: { color: colors.danger, marginBottom: spacing.sm },
  center: { paddingVertical: spacing.xxl, alignItems: 'center' },
  list: { paddingBottom: 48 },
  row: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  name: { color: colors.text, fontWeight: '700', flex: 1, fontSize: 16 },
  badge: {
    color: colors.accent,
    fontWeight: '800',
    fontSize: 12,
    backgroundColor: 'rgba(34,211,238,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  email: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: 8 },
  tap: { color: colors.accent, fontSize: 11, marginTop: 8, fontWeight: '600' },
  empty: { color: colors.textMuted, textAlign: 'center', padding: spacing.lg },
  modalBg: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.bgElevated,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    maxHeight: '90%',
  },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  modalEmail: { color: colors.textMuted, fontSize: 13, marginBottom: spacing.md },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    color: colors.text,
    fontSize: 16,
    backgroundColor: colors.surface,
  },
  rowBtns: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipOn: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(34,211,238,0.12)',
  },
  chipTxt: { color: colors.textMuted, fontSize: 14 },
  chipTxtOn: { color: colors.accent, fontWeight: '700' },
  papelRow: { flexGrow: 0, marginBottom: spacing.sm },
  chipSm: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  chipTxtSm: { color: colors.textMuted, fontSize: 12 },
  modalActions: { marginTop: spacing.lg, gap: spacing.sm },
});
