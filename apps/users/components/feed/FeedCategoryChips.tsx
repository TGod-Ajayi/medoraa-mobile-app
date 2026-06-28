import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';
import type { FeedCategoryChip } from './constants';

type Props = {
  chips: FeedCategoryChip[];
  selectedId: string | null;
  onSelect: (chip: FeedCategoryChip) => void;
};

export function FeedCategoryChips({ chips, selectedId, onSelect }: Props) {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {chips.map((chip) => {
        const selected = chip.id === selectedId;

        return (
          <Pressable
            key={chip.id ?? 'all'}
            onPress={() => onSelect(chip)}
            style={[
              styles.chip,
              selected
                ? {
                    backgroundColor: theme.accent,
                    borderColor: theme.accent,
                  }
                : {
                    backgroundColor: theme.card,
                    borderColor: theme.accentFocus,
                  },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected }}>
            <Text
              style={[
                styles.chipText,
                {
                  color: selected ? '#FFFFFF' : theme.textSecondary,
                },
              ]}>
              {chip.label}
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
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  chipText: {
    fontSize: 13,
    fontFamily: fonts.medium,
  },
});
