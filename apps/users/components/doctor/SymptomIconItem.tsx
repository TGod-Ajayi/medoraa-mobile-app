import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../config/theme';

export type SymptomIconItemProps = {
  label: string;
  /** MCI icon name */
  icon: string;
  /** Very light pastel tile */
  backgroundColor: string;
  onPress?: () => void;
};

export function SymptomIconItem({
  label,
  icon,
  backgroundColor,
  onPress,
}: SymptomIconItemProps) {
  const theme = useTheme();

  const inner = (
    <>
      <View style={[styles.iconWrap, { backgroundColor }]}>
        <MaterialCommunityIcons
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          name={icon as any}
          size={32}
          color={theme.accent}
        />
      </View>
      <Text style={[styles.label, { color: theme.textSecondary }]} numberOfLines={2}>
        {label}
      </Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        style={styles.cell}
        onPress={onPress}
        accessibilityRole='button'
        accessibilityLabel={label}>
        {inner}
      </Pressable>
    );
  }

  return <View style={styles.cell}>{inner}</View>;
}

const styles = StyleSheet.create({
  cell: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 16,
    minWidth: 72,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
  },
});
