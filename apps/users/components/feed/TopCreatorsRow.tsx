import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';
import type { TopCreator } from './constants';

type Props = {
  creators: TopCreator[];
  onPressCreator?: (creatorId: string) => void;
};

export function TopCreatorsRow({ creators, onPressCreator }: Props) {
  const theme = useTheme();

  if (creators.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Top Creators</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {creators.map((creator) => (
          <Pressable
            key={creator.id}
            onPress={() => onPressCreator?.(creator.id)}
            style={styles.item}
            accessibilityRole="button"
            accessibilityLabel={`View ${creator.name}`}>
            <View style={styles.avatarWrap}>
              <Image source={creator.avatar} style={styles.avatar} />
              <View style={[styles.onlineDot, { borderColor: theme.card }]} />
            </View>
            <Text
              style={[styles.name, { color: theme.textPrimary }]}
              numberOfLines={1}>
              {creator.name}
            </Text>
            <Text
              style={[styles.subtitle, { color: theme.textSecondary }]}
              numberOfLines={1}>
              {creator.subtitle}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  row: {
    paddingHorizontal: 16,
    gap: 18,
  },
  item: {
    width: 78,
    alignItems: 'center',
    gap: 6,
  },
  avatarWrap: {
    width: 64,
    height: 64,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  onlineDot: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
  },
  name: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    fontFamily: fonts.regular,
    textAlign: 'center',
  },
});
