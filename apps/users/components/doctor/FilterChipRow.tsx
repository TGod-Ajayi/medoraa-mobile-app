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
                borderColor: selected ? "#60A5FA" : "#94A3B8",
                backgroundColor: theme.card,
              },
            ]}>
            <Text
              style={[
                styles.chipText,
                {
                  color: selected ? "#20BEB8" : "#94A3B8",
                  fontWeight: "500",
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
    paddingBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
  },
});
