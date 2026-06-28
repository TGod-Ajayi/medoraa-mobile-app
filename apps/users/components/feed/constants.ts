import type { ImageSourcePropType } from 'react-native';

import type { CreatorContentListItem } from '@repo/ui/graphql';

export type FeedCategoryChip = {
  id: string | null;
  label: string;
};

export type TopCreator = {
  id: string;
  name: string;
  subtitle: string;
  avatar: ImageSourcePropType;
};

export type CategoryBadgeStyle = {
  label: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
};

const FEED_PLACEHOLDER_IMAGES: ImageSourcePropType[] = [
  require('../../assets/images/cat2.png'),
  require('../../assets/images/doctorone.png'),
  require('../../assets/images/doctortwo.png'),
  require('../../assets/images/cat1.png'),
  require('../../assets/images/wellness.png'),
  require('../../assets/images/banner.png'),
];

const CATEGORY_BADGE_MAP: Record<string, CategoryBadgeStyle> = {
  'african-nutrition': {
    label: 'Nutrition Tip',
    backgroundColor: 'rgba(34, 197, 94, 0.18)',
    borderColor: 'rgba(74, 222, 128, 0.55)',
    textColor: '#4ADE80',
  },
  'weight-loss': {
    label: 'Transformation',
    backgroundColor: 'rgba(251, 146, 60, 0.18)',
    borderColor: 'rgba(251, 146, 60, 0.55)',
    textColor: '#FB923C',
  },
  hypertension: {
    label: 'Heart Health',
    backgroundColor: 'rgba(239, 68, 68, 0.18)',
    borderColor: 'rgba(248, 113, 113, 0.55)',
    textColor: '#F87171',
  },
  'home-workout': {
    label: 'Fitness',
    backgroundColor: 'rgba(45, 194, 177, 0.18)',
    borderColor: 'rgba(76, 203, 198, 0.55)',
    textColor: '#4CCBC6',
  },
};

const DEFAULT_BADGE: CategoryBadgeStyle = {
  label: 'Wellness',
  backgroundColor: 'rgba(96, 165, 250, 0.18)',
  borderColor: 'rgba(96, 165, 250, 0.55)',
  textColor: '#60A5FA',
};

export function formatEngagementCount(value: number): string {
  return value.toLocaleString('en-US');
}

export function getCategoryBadge(
  categorySlug?: string | null,
  categoryName?: string | null,
): CategoryBadgeStyle {
  if (categorySlug && CATEGORY_BADGE_MAP[categorySlug]) {
    return CATEGORY_BADGE_MAP[categorySlug];
  }

  if (categoryName) {
    return {
      ...DEFAULT_BADGE,
      label: categoryName,
    };
  }

  return DEFAULT_BADGE;
}

export function getFeedPlaceholderImage(seed: string): ImageSourcePropType {
  const hash = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return FEED_PLACEHOLDER_IMAGES[hash % FEED_PLACEHOLDER_IMAGES.length]!;
}

export function getEngagementStats(viewCount: number, seed: string) {
  const hash = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const base = Math.max(viewCount, 1);

  return {
    likes: base * 120 + (hash % 900) + 240,
    comments: Math.floor(base * 8) + (hash % 80) + 12,
    saves: Math.floor(base * 35) + (hash % 300) + 60,
  };
}

export function getDoctorName(item: CreatorContentListItem) {
  const { firstName, lastName } = item.doctor.user;
  return `Dr. ${firstName} ${lastName}`.trim();
}

export function getDoctorSubtitle(item: CreatorContentListItem) {
  const category = item.category?.name ?? 'Health Creator';
  const typeLabel = item.contentType
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ');

  return `${category} · ${typeLabel}`;
}

export function getFeedCaption(item: CreatorContentListItem) {
  if (item.body?.trim()) return item.body.trim();
  return item.title;
}

export function buildTopCreators(
  items: CreatorContentListItem[],
): TopCreator[] {
  const creators = new Map<string, TopCreator>();

  for (const item of items) {
    const doctorId = item.doctor.id;
    if (creators.has(doctorId)) continue;

    creators.set(doctorId, {
      id: doctorId,
      name: getDoctorName(item),
      subtitle: item.category?.name ?? 'Wellness',
      avatar: item.doctor.user.profilePhoto
        ? { uri: item.doctor.user.profilePhoto }
        : require('../../assets/images/user.png'),
    });
  }

  return Array.from(creators.values()).slice(0, 8);
}

export function buildCategoryChips(
  categories: { id: string; name: string }[],
): FeedCategoryChip[] {
  return [
    { id: null, label: 'All' },
    ...categories.map((category) => ({
      id: category.id,
      label: category.name,
    })),
  ];
}
