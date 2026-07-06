import { Ionicons } from '@expo/vector-icons';
import type { GestureResponderEvent, ImageSourcePropType } from 'react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

export type DoctorListCardProps = {
  name: string;
  specialty: string;
  qualifications: string;
  price: string;
  rating: string;
  image: ImageSourcePropType;
  favorited?: boolean;
  onPress?: () => void;
  onToggleFavorite?: () => void;
};

export function DoctorListCard({
  name,
  specialty,
  qualifications,
  price,
  rating,
  image,
  favorited = false,
  onPress,
  onToggleFavorite,
}: DoctorListCardProps) {
  const theme = useTheme();
  const Container = onPress ? Pressable : View;

  function handleFavoritePress(event: GestureResponderEvent) {
    event.stopPropagation();
    onToggleFavorite?.();
  }

  return (
    <Container
      style={[styles.card, { backgroundColor: theme.card }]}
      {...(onPress
        ? {
            accessibilityRole: 'button' as const,
            onPress,
          }
        : {})}>
      <Image source={image} style={styles.photo} resizeMode='cover' />

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.infoBlock}>
            <Text
              style={[styles.name, { color: theme.textPrimary }]}
              numberOfLines={1}>
              {name}
            </Text>
            <Text
              style={[styles.specialty, { color: theme.textSecondary }]}
              numberOfLines={1}>
              {specialty}
            </Text>
            <Text
              style={[styles.qualifications, { color: theme.textMuted }]}
              numberOfLines={2}>
              {qualifications}
            </Text>
          </View>

          {onToggleFavorite ? (
            <Pressable
              onPress={handleFavoritePress}
              hitSlop={8}
              style={styles.favoriteBtn}
              accessibilityRole='button'
              accessibilityLabel={
                favorited ? 'Remove from favorites' : 'Add to favorites'
              }>
              <Ionicons
                name={favorited ? 'heart' : 'heart-outline'}
                size={22}
                color={favorited ? '#E53E3E' : theme.textSecondary}
              />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.priceBadge}>
            <Text style={[styles.priceText, { color: theme.textPrimary }]}>
              {price}
            </Text>
          </View>

          <View style={styles.ratingRow}>
            <Ionicons name='star' size={14} color='#FBBF24' />
            <Text style={[styles.ratingText, { color: theme.textSecondary }]}>
              {rating}
            </Text>
          </View>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 12,
    gap: 12,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  photo: {
    width: 88,
    height: 88,
    borderRadius: 10,
  },
  body: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  infoBlock: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  name: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.semiBold,
  },
  specialty: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.medium,
    marginTop: 2,
  },
  qualifications: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  favoriteBtn: {
    paddingTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  priceBadge: {
    backgroundColor: '#E8F0F8',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  priceText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.semiBold,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
  },
});
