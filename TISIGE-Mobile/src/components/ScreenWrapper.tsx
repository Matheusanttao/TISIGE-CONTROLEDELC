import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

type Props = {
  children: ReactNode;
};

/** Fundo em gradiente + área segura. No web ocupa altura mínima da janela (100vh). */
export function ScreenWrapper({ children }: Props) {
  return (
    <LinearGradient
      colors={[colors.bg, '#15202b', colors.bg]}
      style={[styles.gradient, Platform.OS === 'web' && styles.gradientWeb]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  gradientWeb: {
    width: '100%',
    minHeight: '100vh' as unknown as number,
  },
  safe: { flex: 1, width: '100%' },
});
