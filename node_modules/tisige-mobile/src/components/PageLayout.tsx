import type { ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';
import { spacing } from '../theme/spacing';

type Props = {
  children: ReactNode;
  /** Força largura máxima (sobrescreve o valor responsivo). */
  maxWidth?: number;
};

/**
 * Centraliza o conteúdo no web e limita largura conforme o tamanho da janela.
 * Em mobile nativo, só aplica padding lateral.
 */
export function PageLayout({ children, maxWidth: maxOverride }: Props) {
  const { maxContent, isWeb } = useResponsive();
  const max = maxOverride ?? maxContent;

  return (
    <View
      style={[
        styles.base,
        isWeb && {
          maxWidth: max,
          width: '100%',
          alignSelf: 'center',
          paddingHorizontal: spacing.md,
        },
      ]}
    >
      {children}
    </View>
  );
}

/** Container de largura total com padding — útil fora do fluxo centralizado. */
export function PageGutter({ children }: { children: ReactNode }) {
  const { isWeb } = useResponsive();
  return (
    <View style={[styles.gutter, isWeb && { paddingHorizontal: spacing.md }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    width: '100%',
    ...Platform.select({
      default: { paddingHorizontal: 0 },
      web: {},
    }),
  },
  gutter: { width: '100%' },
});
