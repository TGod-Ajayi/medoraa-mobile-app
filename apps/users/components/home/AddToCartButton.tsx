import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '../../config/theme';

type Props = {
  onPress: () => void;
};

export function AddToCartButton({ onPress }: Props) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.btn, { backgroundColor: theme.accent }]}
      accessibilityRole='button'
      accessibilityLabel='Add to cart'>
      <Ionicons name='add' size={22} color='#FFFFFF' />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
