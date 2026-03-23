import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../config/theme';

export type DepartmentIconItemProps = {
  name: string;
  icon: string;
  backgroundColor: string;
  onPress?: () => void;
};

export function DepartmentIconItem({
  name,
  icon,
  backgroundColor,
  onPress,
}: DepartmentIconItemProps) {
  const theme = useTheme();

  const inner = (
    <>
      <View style={[styles.iconWrap, { backgroundColor }]}>
        <MaterialCommunityIcons
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          name={icon as any}
          size={28}
          color={theme.textPrimary}
        />
      </View>
      <Text style={[styles.label, { color: theme.textSecondary }]} numberOfLines={2}>
        {name}
      </Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        style={styles.cell}
        onPress={onPress}
        accessibilityRole='button'
        accessibilityLabel={name}>
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
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
  },
});
