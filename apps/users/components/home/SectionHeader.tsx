import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

type Props = {
  title: string;
  seeAllLabel?: string;
  onPressSeeAll?: () => void;
};

/**
 * Section title row: bold title (left) + optional teal “See all” (right).
 */
export function SectionHeader({
  title,
  seeAllLabel = 'See All',
  onPressSeeAll,
}: Props) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
        {title}
      </Text>
      {onPressSeeAll ? (
        <Pressable onPress={onPressSeeAll} hitSlop={8}>
          <Text style={[styles.seeAll, { color: theme.accent }]}>{seeAllLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
});
