import type { ImageSourcePropType } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Image, StyleSheet, Text, View } from 'react-native';

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

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.divider },
        cardStyle,
      ]}>
      <View style={[styles.imageArea, { backgroundColor: theme.surfaceMuted }]}>
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
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
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
