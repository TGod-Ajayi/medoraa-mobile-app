import { useViewUrl } from '@repo/ui/graphql';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';
import type { CategoryBadgeStyle } from './constants';

type Props = {
  mediaKey?: string | null;
  fallbackSource: ImageSourcePropType;
  badge: CategoryBadgeStyle;
  showPlayButton?: boolean;
};

export function FeedMedia({
  mediaKey,
  fallbackSource,
  badge,
  showPlayButton = false,
}: Props) {
  const theme = useTheme();
  const { url, loading } = useViewUrl(mediaKey);

  return (
    <View style={[styles.container, { backgroundColor: theme.surfaceMuted }]}>
      {url ? (
        <Image source={{ uri: url }} style={styles.image} resizeMode="cover" />
      ) : loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={theme.accent} />
        </View>
      ) : (
        <Image source={fallbackSource} style={styles.image} resizeMode="cover" />
      )}

      <View
        style={[
          styles.badge,
          {
            backgroundColor: badge.backgroundColor,
            borderColor: badge.borderColor,
          },
        ]}>
        <Text style={[styles.badgeText, { color: badge.textColor }]}>
          {badge.label}
        </Text>
      </View>

      {showPlayButton ? (
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <Ionicons name="play" size={28} color="#FFFFFF" style={styles.playIcon} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loaderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.18)',
  },
  playButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  playIcon: {
    marginLeft: 4,
  },
});
