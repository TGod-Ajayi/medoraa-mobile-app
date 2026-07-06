import { useCreatorContents, useLifestyleCategories } from '@repo/ui/graphql';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  buildCategoryChips,
  buildTopCreators,
  FeedCategoryChips,
  FeedContentCard,
  TopCreatorsRow,
  type FeedCategoryChip,
} from '../../components/feed';
import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

const EMPTY_FEED_IMAGE = require('../../assets/images/emptyDept.png');

export default function FeedScreen() {
  const theme = useTheme();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());

  const { categories, loading: categoriesLoading } = useLifestyleCategories(true);

  const categoryChips = useMemo(() => buildCategoryChips(categories), [categories]);

  const filter = useMemo(() => {
    if (!selectedCategoryId) return undefined;
    return { categoryId: selectedCategoryId };
  }, [selectedCategoryId]);

  const {
    creatorContents,
    loading: feedLoading,
    error,
    refetch,
    data: feedData,
    pageInfo,
    metaData,
  } = useCreatorContents({
    limit: 20,
    page: 1,
    filter,
  });

  const {
    creatorContents: allCreatorContents,
    data: allFeedData,
  } = useCreatorContents({
    limit: 50,
    page: 1,
  });

  const topCreators = useMemo(
    () => buildTopCreators(allCreatorContents),
    [allCreatorContents],
  );

  useEffect(() => {
    console.log(
      'wellness feed response\n' +
        JSON.stringify(
          {
            filter: filter ?? null,
            feed: {
              paginationArgs: { limit: 20, page: 1 },
              getCreatorContents: feedData?.getCreatorContents ?? null,
              items: creatorContents,
              pageInfo,
              metaData,
              loading: feedLoading,
              error: error?.message ?? null,
            },
            topCreators: {
              paginationArgs: { limit: 50, page: 1 },
              getCreatorContents: allFeedData?.getCreatorContents ?? null,
              derived: topCreators,
            },
            categories,
          },
          null,
          2,
        ),
    );
  }, [
    allFeedData,
    categories,
    creatorContents,
    feedData,
    feedLoading,
    error,
    filter,
    metaData,
    pageInfo,
    topCreators,
  ]);

  const showInitialLoader =
    (feedLoading || categoriesLoading) && creatorContents.length === 0;

  const handleCategorySelect = useCallback((chip: FeedCategoryChip) => {
    setSelectedCategoryId(chip.id);
  }, []);

  const toggleFollow = useCallback((doctorId: string) => {
    setFollowingIds((current) => {
      const next = new Set(current);
      if (next.has(doctorId)) {
        next.delete(doctorId);
      } else {
        next.add(doctorId);
      }
      return next;
    });
  }, []);

  const listHeader = (
    <View style={styles.headerBlock}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Wellness Feed</Text>

      <FeedCategoryChips
        chips={categoryChips}
        selectedId={selectedCategoryId}
        onSelect={handleCategorySelect}
      />

      <TopCreatorsRow creators={topCreators} />
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top']}>
      {showInitialLoader ? (
        <View style={styles.loaderWrap}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Wellness Feed</Text>
          <ActivityIndicator color={theme.accent} style={styles.loader} />
        </View>
      ) : error ? (
        <View style={styles.loaderWrap}>
          {listHeader}
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
              Unable to load feed
            </Text>
            <Text style={[styles.emptyBody, { color: theme.textSecondary }]}>
              Pull down to try again.
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={creatorContents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FeedContentCard
              item={item}
              isFollowing={followingIds.has(item.doctor.id)}
              onToggleFollow={() => toggleFollow(item.doctor.id)}
            />
          )}
          ListHeaderComponent={listHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={feedLoading && creatorContents.length > 0}
              onRefresh={() => {
                void refetch();
              }}
              tintColor={theme.accent}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Image source={EMPTY_FEED_IMAGE} style={styles.emptyImage} />
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                No content in this category
              </Text>
              <Text style={[styles.emptyBody, { color: theme.textSecondary }]}>
                Try another category or check back later for new wellness posts.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  headerBlock: {
    paddingTop: 8,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
    marginBottom: 18,
    paddingHorizontal: 16,
  },
  loaderWrap: {
    flex: 1,
    paddingTop: 8,
  },
  loader: {
    marginTop: 32,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: 'center',
    lineHeight: 20,
  },
});
