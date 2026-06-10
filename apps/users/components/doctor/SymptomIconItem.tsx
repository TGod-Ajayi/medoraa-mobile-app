import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { useTheme } from '../../config/theme';
import { SvgXml } from 'react-native-svg';

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
 
  const colorScheme = useColorScheme();
  const inner = (
    <>
      <View style={[styles.iconWrap, { backgroundColor}]}>
        <SvgXml xml={icon} width={32} height={32}/>
      </View>
      <Text style={[styles.label, { color: colorScheme === "dark" ? "#94A3B8" : "#64748B" }]} numberOfLines={2}>
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
    fontSize: 14,
    fontWeight: "500",
    textAlign: 'center',
  },
});
