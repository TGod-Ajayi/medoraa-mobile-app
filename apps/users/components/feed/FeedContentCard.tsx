import { Ionicons } from '@expo/vector-icons';
import type { CreatorContentListItem } from '@repo/ui/graphql';
import { useMemo } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';
import {
  formatEngagementCount,
  getCategoryBadge,
  getDoctorName,
  getDoctorSubtitle,
  getEngagementStats,
  getFeedCaption,
  getFeedPlaceholderImage,
} from './constants';
import { FeedMedia } from './FeedMedia';

const DEFAULT_AVATAR = require('../../assets/images/user.png');

type Props = {
  item: CreatorContentListItem;
  isFollowing?: boolean;
  onToggleFollow?: () => void;
  onPress?: () => void;
};

function getDoctorAvatar(item: CreatorContentListItem): ImageSourcePropType {
  return item.doctor.user.profilePhoto
    ? { uri: item.doctor.user.profilePhoto }
    : DEFAULT_AVATAR;
}

function getPrimaryMediaKey(item: CreatorContentListItem) {
  const sortedMedia = [...(item.media ?? [])].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );

  return sortedMedia[0]?.file.key ?? null;
}

export function FeedContentCard({
  item,
  isFollowing = false,
  onToggleFollow,
  onPress,
}: Props) {
  const theme = useTheme();
  const badge = useMemo(
    () => getCategoryBadge(item.category?.slug, item.category?.name),
    [item.category?.name, item.category?.slug],
  );
  const engagement = useMemo(
    () => getEngagementStats(item.viewCount, item.id),
    [item.id, item.viewCount],
  );
  const caption = getFeedCaption(item);
  const showPlayButton =
    item.contentType === 'VIDEO_POST' || item.contentType === 'IMAGE_POST';

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: theme.card }]}
      accessibilityRole="button"
      accessibilityLabel={`Open post by ${getDoctorName(item)}`}>
      <View style={styles.headerRow}>
        <Image source={getDoctorAvatar(item)} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={[styles.doctorName, { color: theme.textPrimary }]} numberOfLines={1}>
            {getDoctorName(item)}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={1}>
            {getDoctorSubtitle(item)}
          </Text>
        </View>

        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            onToggleFollow?.();
          }}
          style={[
            styles.followButton,
            isFollowing
              ? { backgroundColor: theme.surfaceMuted, borderColor: theme.divider }
              : { backgroundColor: 'transparent', borderColor: theme.accent },
          ]}
          accessibilityRole="button"
          accessibilityLabel={isFollowing ? 'Unfollow creator' : 'Follow creator'}>
          <Text
            style={[
              styles.followText,
              { color: isFollowing ? theme.textSecondary : theme.accent },
            ]}>
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </Pressable>
      </View>

      <FeedMedia
        mediaKey={getPrimaryMediaKey(item)}
        fallbackSource={getFeedPlaceholderImage(item.id)}
        badge={badge}
        showPlayButton={showPlayButton}
      />

      <Text style={[styles.caption, { color: theme.textPrimary }]}>{caption}</Text>

      <View style={styles.engagementRow}>
        <View style={styles.engagementGroup}>
          <EngagementItem
            icon="heart-outline"
            count={formatEngagementCount(engagement.likes)}
            color={theme.textSecondary}
          />
          <EngagementItem
            icon="chatbubble-outline"
            count={formatEngagementCount(engagement.comments)}
            color={theme.textSecondary}
          />
          <EngagementItem
            icon="bookmark-outline"
            count={formatEngagementCount(engagement.saves)}
            color={theme.textSecondary}
          />
        </View>

        <Pressable
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Share post"
          onPress={(event) => event.stopPropagation()}>
          <Ionicons name="share-social-outline" size={20} color={theme.textSecondary} />
        </Pressable>
      </View>
    </Pressable>
  );
}

function EngagementItem({
  icon,
  count,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  count: string;
  color: string;
}) {
  return (
    <View style={styles.engagementItem}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.engagementCount, { color }]}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 14,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  doctorName: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: fonts.regular,
  },
  followButton: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  followText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },
  caption: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: fonts.regular,
  },
  engagementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  engagementGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  engagementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  engagementCount: {
    fontSize: 13,
    fontFamily: fonts.medium,
  },
});
