import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '../../config/theme';

type Props = {
  active: boolean;
  onPress: () => void;
};

export function WishlistButton({ active, onPress }: Props) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.hit, { backgroundColor: theme.card }]}
      hitSlop={8}
      accessibilityRole='button'
      accessibilityLabel={active ? 'Remove from wishlist' : 'Add to wishlist'}>
      <Ionicons
        name={active ? 'heart' : 'heart-outline'}
        size={20}
        color={active ? '#E53E3E' : theme.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
