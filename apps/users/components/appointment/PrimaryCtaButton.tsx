import { Pressable, StyleSheet, Text } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

type Props = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

export function PrimaryCtaButton({ label, onPress, disabled }: Props) {
  const theme = useTheme();
  const isDisabled = disabled || !onPress;

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: theme.accent,
          opacity: isDisabled ? 0.45 : pressed ? 0.92 : 1,
        },
      ]}
      accessibilityRole='button'
      accessibilityState={{ disabled: isDisabled }}>
      <Text style={[styles.label, { fontFamily: fonts.semiBold }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
