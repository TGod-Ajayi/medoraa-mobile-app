import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

type Props = {
  brandLabel?: string;
  maskedNumber: string;
  onPress?: () => void;
};

export function PayWithRow({
  brandLabel = 'VISA',
  maskedNumber,
  onPress,
}: Props) {
  const theme = useTheme();

  const content = (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.divider }]}>
      <Text style={[styles.title, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
        Pay with
      </Text>
      <View style={styles.row}>
        <View style={[styles.badge, { borderColor: theme.divider }]}>
          <Text style={[styles.brand, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
            {brandLabel}
          </Text>
        </View>
        <Text
          style={[styles.number, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}
          numberOfLines={1}>
          {maskedNumber}
        </Text>
        <Ionicons name='chevron-forward' size={20} color={theme.textMuted} />
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole='button'>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  brand: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  number: {
    flex: 1,
    fontSize: 15,
    minWidth: 0,
  },
});
