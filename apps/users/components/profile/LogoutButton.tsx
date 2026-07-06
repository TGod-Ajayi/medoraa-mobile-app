import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';
import { useLogout } from './useLogout';

type Props = {
  /** Full-width outlined button (profile). Icon-only for compact headers. */
  variant?: 'outline' | 'icon';
};

export function LogoutButton({ variant = 'outline' }: Props) {
  const theme = useTheme();
  const { logout, loggingOut } = useLogout();

  if (variant === 'icon') {
    return (
      <Pressable
        onPress={logout}
        disabled={loggingOut}
        style={({ pressed }) => [
          styles.iconBtn,
          { backgroundColor: theme.card, opacity: pressed || loggingOut ? 0.7 : 1 },
        ]}
        accessibilityRole='button'
        accessibilityLabel='Log out'>
        <Ionicons name='log-out-outline' size={22} color={theme.error} />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={logout}
      disabled={loggingOut}
      style={({ pressed }) => [
        styles.outlineBtn,
        {
          borderColor: theme.error,
          opacity: pressed || loggingOut ? 0.7 : 1,
        },
      ]}
      accessibilityRole='button'
      accessibilityLabel='Log out'>
      <View style={styles.outlineContent}>
        <Ionicons name='log-out-outline' size={20} color={theme.error} />
        <Text style={[styles.outlineLabel, { color: theme.error, fontFamily: fonts.semiBold }]}>
          {loggingOut ? 'Signing out…' : 'Log out'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineBtn: {
    marginTop: 28,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  outlineLabel: {
    fontSize: 16,
  },
});
