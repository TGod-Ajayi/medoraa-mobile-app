import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

type Props = {
  price: string;
  originalPrice?: string;
};

export function PriceLabel({ price, originalPrice }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <Text style={[styles.price, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
        {price}
      </Text>
      {originalPrice ? (
        <Text
          style={[styles.was, { color: theme.textMuted }]}
          numberOfLines={1}>
          {originalPrice}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  price: {
    fontSize: 16,
  },
  was: {
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
});
