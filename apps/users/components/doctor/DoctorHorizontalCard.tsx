import { Ionicons } from '@expo/vector-icons';
import type { ImageSourcePropType } from 'react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

export type DoctorHorizontalCardProps = {
  name: string;
  specialty: string;
  rating: string;
  image: ImageSourcePropType;
  online?: boolean;
  favorited?: boolean;
  onToggleFavorite?: () => void;
};

/**
 * Compact card for horizontal lists (Doctor tab).
 */
export function DoctorHorizontalCard({
  name,
  specialty,
  rating,
  image,
  online = true,
  favorited = false,
  onToggleFavorite,
}: DoctorHorizontalCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.divider }]}>
      <View style={styles.imageBlock}>
        <Image source={image} style={styles.photo} resizeMode='cover' />
        {online ? (
          <View style={[styles.onlineDot, { borderColor: theme.card }]} />
        ) : null}
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text
              style={[styles.name, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}
              numberOfLines={1}>
              {name}
            </Text>
            <Text style={[styles.spec, { color: theme.textSecondary }]} numberOfLines={1}>
              {specialty}
            </Text>
          </View>
          {onToggleFavorite ? (
            <Pressable onPress={onToggleFavorite} hitSlop={8}>
              <Ionicons
                name={favorited ? 'heart' : 'heart-outline'}
                size={20}
                color={favorited ? '#E53E3E' : theme.textSecondary}
              />
            </Pressable>
          ) : null}
        </View>
        <View style={styles.ratingRow}>
          <Ionicons name='star' size={14} color='#FBBF24' />
          <Text style={[styles.ratingText, { color: theme.textSecondary }]}>{rating}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    borderRadius: 14,
    marginRight: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  imageBlock: {
    height: 120,
    backgroundColor: '#BFDBFE',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  onlineDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    borderWidth: 2,
  },
  body: {
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 14,
  },
  spec: {
    fontSize: 12,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  ratingText: {
    fontSize: 12,
  },
});
