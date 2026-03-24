import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PageLayout } from '../components/PageLayout';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { TextField } from '../components/TextField';
import type { RootStackParamList } from '../navigation/types';
import { supabase } from '../lib/supabase';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen() {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSend = async () => {
    const e = email.trim().toLowerCase();
    if (!e) {
      Alert.alert('E-mail', 'Informe o e-mail cadastrado.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(e);
      if (error) {
        Alert.alert('Recuperação', error.message);
        return;
      }
      Alert.alert(
        'E-mail enviado',
        'Se o endereço existir, você receberá o link para redefinir a senha (verifique o spam).',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <PageLayout maxWidth={440}>
          <View style={styles.inner}>
            <Text style={styles.emoji} accessibilityLabel="">
              🔐
            </Text>
            <Text style={styles.title}>Recuperação de senha</Text>
            <Text style={styles.body}>
              Informe o e-mail da sua conta. O Supabase enviará um link de redefinição (se
              estiver habilitado no painel Authentication → Providers → Email).
            </Text>
            <TextField
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              placeholder="nome@empresa.com.br"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <PrimaryButton title="Enviar link" onPress={onSend} loading={loading} />
            <PrimaryButton title="Voltar ao login" variant="ghost" onPress={() => navigation.goBack()} />
          </View>
        </PageLayout>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  inner: {
    paddingVertical: spacing.lg,
  },
  emoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  body: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});
