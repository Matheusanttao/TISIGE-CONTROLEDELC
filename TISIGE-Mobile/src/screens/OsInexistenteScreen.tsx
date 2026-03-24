import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { PageLayout } from '../components/PageLayout';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import type { RootStackParamList, RootScreenProps } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList, 'OsInexistente'>;

export function OsInexistenteScreen({ route }: RootScreenProps<'OsInexistente'>) {
  const navigation = useNavigation<Nav>();
  const os = route.params.os;

  return (
    <ScreenWrapper>
      <View style={styles.box}>
        <PageLayout maxWidth={440}>
          <Text style={styles.title}>OS inexistente</Text>
          <Text style={styles.body}>
            Não encontramos a OS <Text style={styles.os}>{os}</Text> na base de demonstração.
            Verifique o número ou cadastre em Controle de LC.
          </Text>
          <PrimaryButton title="Voltar" variant="danger" onPress={() => navigation.goBack()} />
        </PageLayout>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    color: colors.warning,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  body: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  os: { color: colors.accent, fontWeight: '700' },
});
