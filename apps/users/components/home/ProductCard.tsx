import type { ImageSourcePropType } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Image, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

import { AddToCartButton } from './AddToCartButton';
import { DiscountBadge } from './DiscountBadge';
import { PriceLabel } from './PriceLabel';
import { WishlistButton } from './WishlistButton';

export type ProductCardProps = {
  title: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  discountLabel?: string;
  image: ImageSourcePropType;
  wishlisted?: boolean;
  onWishlistPress?: () => void;
  onAddPress?: () => void;
  /** Override card width (e.g. fixed width for horizontal carousels). */
  cardStyle?: StyleProp<ViewStyle>;
};

export function ProductCard({
  title,
  subtitle,
  price,
  originalPrice,
  discountLabel,
  image,
  wishlisted = false,
  onWishlistPress,
  onAddPress,
  cardStyle,
}: ProductCardProps) {
  const theme = useTheme();
const colorScheme = useColorScheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colorScheme == "dark" ? "#0F172A" : "#FFFFFF", borderColor: colorScheme == "dark" ? "#334155" : "#F1F5F9" },
        cardStyle,
      ]}>
      <View style={[styles.imageArea, { backgroundColor: colorScheme == "dark" ? "#1E293B" : "#F1F5F9" }]}>
        {discountLabel ? <DiscountBadge label={discountLabel} /> : null}
        {onWishlistPress ? (
          <WishlistButton active={wishlisted} onPress={onWishlistPress} />
        ) : null}
        <Image source={image} style={styles.productImage} resizeMode='contain' />
      </View>
      <View style={styles.body}>
        <Text
          style={[styles.title, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}
          numberOfLines={2}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={1}>
          {subtitle}
        </Text>
        <View style={styles.footer}>
          <View style={styles.priceBlock}>
            <PriceLabel price={price} originalPrice={originalPrice} />
          </View>
          {onAddPress ? <AddToCartButton onPress={onAddPress} /> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    height:218,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  imageArea: {
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  productImage: {
    width: '85%',
    height: '85%',
  },
  body: {
    padding: 12,
    paddingTop: 10,
  },
  title: {
    fontSize: 14,
    lineHeight: 18,
    minHeight: 36,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 8,
  },
  priceBlock: {
    flex: 1,
    minWidth: 0,
  },
});
