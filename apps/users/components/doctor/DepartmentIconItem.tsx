import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { useTheme } from '../../config/theme';
import { SvgXml } from 'react-native-svg';

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
  const colorScheme = useColorScheme();
  const inner = (
    <>
      <View style={[styles.iconWrap, { backgroundColor }]}>
        <SvgXml xml={icon} width={36} height={36}/>
      </View>
      <Text style={[styles.label, { color: colorScheme === "dark" ? "#94A3B8" : "#475569" }]} numberOfLines={2}>
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
    width: 72,
    height: 72,
    borderRadius: 14,
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
