import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

type Props = {
  labels: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

export function FilterChipRow({ labels, selectedIndex, onSelect }: Props) {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {labels.map((label, i) => {
        const selected = selectedIndex === i;
        return (
          <Pressable
            key={label}
            onPress={() => onSelect(i)}
            style={[
              styles.chip,
              {
                borderColor: selected ? theme.accent : theme.divider,
                backgroundColor: theme.card,
              },
            ]}>
            <Text
              style={[
                styles.chipText,
                {
                  color: selected ? theme.accent : theme.textSecondary,
                  fontFamily: selected ? fonts.medium : fonts.regular,
                },
              ]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
  },
});
