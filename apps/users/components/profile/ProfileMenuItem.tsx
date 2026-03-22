import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

type IonName = ComponentProps<typeof Ionicons>['name'];

type Props = {
  label: string;
  icon: IonName;
  onPress?: () => void;
  /** Hide bottom divider on last row */
  isLast?: boolean;
};

/**
 * Single row in profile settings: circular icon, label, chevron.
 */
export function ProfileMenuItem({ label, icon, onPress, isLast }: Props) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.divider },
        { opacity: pressed ? 0.85 : 1 },
      ]}
      accessibilityRole='button'
      accessibilityLabel={label}>
      <View style={[styles.iconCircle, { backgroundColor: theme.surfaceMuted }]}>
        <Ionicons name={icon} size={22} color={theme.textSecondary} />
      </View>
      <Text style={[styles.label, { color: theme.textPrimary, fontFamily: fonts.medium }]}>
        {label}
      </Text>
      <Ionicons name='chevron-forward' size={20} color={theme.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
});
