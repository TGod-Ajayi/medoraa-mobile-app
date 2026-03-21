import { Pressable, StyleSheet, Text } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

type Props = {
  label: string;
  onPress?: () => void;
};

export function PrimaryCtaButton({ label, onPress }: Props) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: theme.accent, opacity: pressed ? 0.92 : 1 },
      ]}
      accessibilityRole='button'>
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
