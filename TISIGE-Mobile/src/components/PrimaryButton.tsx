import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

type Variant = 'primary' | 'ghost' | 'danger';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
  icon?: ReactNode;
  style?: ViewStyle;
};

export function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  icon,
  style,
}: Props) {
  const dim = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={dim}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        dim && styles.disabled,
        pressed && !dim && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? colors.accent : '#042f2e'} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              variant === 'ghost' && styles.textGhost,
              variant === 'danger' && styles.textDanger,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    minHeight: 52,
  },
  primary: {
    backgroundColor: colors.accentDark,
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 4,
        blurRadius: 8,
        spreadDistance: 0,
        color: 'rgba(34, 211, 238, 0.35)',
      },
    ],
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: '#b91c1c',
  },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
  text: {
    color: '#042f2e',
    fontSize: 16,
    fontWeight: '700',
  },
  textGhost: { color: colors.text },
  textDanger: { color: '#fff' },
});
