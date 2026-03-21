import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

type Props = {
  title: string;
};

/**
 * Top bar: circular back (when navigation allows) + centered title.
 */
export function ScreenHeader({ title }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const canGoBack = router.canGoBack();

  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {canGoBack ? (
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: theme.card }]}
            accessibilityRole='button'
            accessibilityLabel='Go back'>
            <Ionicons name='chevron-back' size={22} color={theme.textSecondary} />
          </Pressable>
        ) : null}
      </View>
      <Text
        style={[styles.title, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}
        numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.side} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    minHeight: 48,
  },
  side: {
    width: 44,
    alignItems: 'flex-start',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
  },
});
