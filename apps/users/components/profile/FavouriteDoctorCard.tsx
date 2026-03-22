import { Ionicons } from '@expo/vector-icons';
import type { ImageSourcePropType } from 'react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

export type FavouriteDoctorCardProps = {
  name: string;
  specialty: string;
  qualifications: string;
  priceLabel: string;
  rating: string;
  image: ImageSourcePropType;
  /** Solid pastel behind the photo square */
  imageBackgroundColor: string;
  /** Heart tap — e.g. open remove confirmation sheet */
  onPressRemove?: () => void;
  /** Tapping the main area (photo + text + price row) opens remove flow */
  onPressCard?: () => void;
};

/**
 * Doctor row for Favourite Doctor list: photo, info, heart, price pill, star rating.
 */
export function FavouriteDoctorCard({
  name,
  specialty,
  qualifications,
  priceLabel,
  rating,
  image,
  imageBackgroundColor,
  onPressRemove,
  onPressCard,
}: FavouriteDoctorCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.divider }]}>
      <View style={styles.topSection}>
        <Pressable
          onPress={onPressCard}
          disabled={!onPressCard}
          style={({ pressed }) => [
            styles.mainPress,
            onPressCard && pressed && styles.mainPressed,
          ]}
          accessibilityRole={onPressCard ? 'button' : undefined}
          accessibilityLabel={onPressCard ? `${name}, ${specialty}` : undefined}>
          <View style={[styles.photoWrap, { backgroundColor: imageBackgroundColor }]}>
            <Image source={image} style={styles.photo} resizeMode='cover' />
          </View>

          <View style={styles.textBlock}>
            <Text style={[styles.name, { color: theme.textPrimary, fontFamily: fonts.semiBold }]} numberOfLines={1}>
              {name}
            </Text>
            <Text style={[styles.specialty, { color: theme.textSecondary }]} numberOfLines={1}>
              {specialty}
            </Text>
            <Text style={[styles.qual, { color: theme.textMuted }]} numberOfLines={2}>
              {qualifications}
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={onPressRemove}
          hitSlop={8}
          style={styles.heartBtn}
          accessibilityRole='button'
          accessibilityLabel='Remove from favourites'>
          <Ionicons name='heart' size={22} color='#E53E3E' />
        </Pressable>
      </View>

      <Pressable
        onPress={onPressCard}
        disabled={!onPressCard}
        style={({ pressed }) => [
          styles.bottomPress,
          onPressCard && pressed && styles.mainPressed,
        ]}>
        <View style={styles.bottomRow}>
          <View style={[styles.pricePill, { backgroundColor: theme.surfaceMuted }]}>
            <Text style={[styles.priceText, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
              {priceLabel}
            </Text>
          </View>
          <View style={styles.ratingRow}>
            <Ionicons name='star' size={14} color='#FBBF24' />
            <Text style={[styles.ratingText, { color: theme.textSecondary }]}>{rating}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const PHOTO = 80;

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  mainPress: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    minWidth: 0,
  },
  mainPressed: {
    opacity: 0.92,
  },
  heartBtn: {
    paddingTop: 2,
  },
  photoWrap: {
    width: PHOTO,
    height: PHOTO,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  bottomPress: {
    marginTop: 10,
  },
  name: {
    fontSize: 16,
  },
  specialty: {
    fontSize: 14,
    marginTop: 2,
  },
  qual: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pricePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  priceText: {
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
  },
});
