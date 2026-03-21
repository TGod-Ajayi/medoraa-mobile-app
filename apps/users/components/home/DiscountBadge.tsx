import { StyleSheet, Text, View } from 'react-native';

type Props = {
  /** e.g. "-30%" */
  label: string;
};

export function DiscountBadge({ label }: Props) {
  return (
    <View style={styles.badge} accessibilityLabel={`Discount ${label}`}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#EF4444',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
