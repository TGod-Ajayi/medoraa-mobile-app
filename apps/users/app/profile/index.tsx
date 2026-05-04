import { Ionicons } from '@expo/vector-icons';
import { onUserSignOut } from '@repo/ui/graphql';
import { useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';

import { ProfileMenuItem } from '../../components/profile';
import { ScreenHeader } from '../../components/doctor';
import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

const AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop';

type IonName = ComponentProps<typeof Ionicons>['name'];

const MENU: { id: string; label: string; icon: IonName }[] =
  [
    { id: 'favourites', label: 'Favourites', icon: 'heart-outline' },
    { id: 'address', label: 'Address book', icon: 'location-outline' },
    { id: 'payments', label: 'Payments', icon: 'wallet-outline' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications-outline' },
    { id: 'security', label: 'Security', icon: 'shield-checkmark-outline' },
    { id: 'language', label: 'Language', icon: 'language-outline' },
    { id: 'help', label: 'Help Center', icon: 'help-circle-outline' },
    { id: 'invite', label: 'Invite Friends', icon: 'people-outline' },
  ];

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await onUserSignOut();
      router.replace('/(auth)/login');
    } catch {
      showMessage({
        message: 'Could not sign out. Try again.',
        type: 'danger',
        duration: 4000,
      });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        <ScreenHeader title='Profile' />

        {/* Avatar + edit photo */}
        <View style={styles.avatarBlock}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: AVATAR }} style={styles.avatarLarge} />
            <Pressable
              style={[
                styles.editPhotoBtn,
                { backgroundColor: theme.accent, borderColor: theme.background },
              ]}
              accessibilityRole='button'
              accessibilityLabel='Change profile photo'>
              <Ionicons name='add' size={18} color='#FFFFFF' />
            </Pressable>
          </View>

          <View style={styles.nameRow}>
            <Text style={[styles.displayName, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
              Zenifer Aniston
            </Text>
            <Pressable
              hitSlop={8}
              onPress={() => router.push('/profile/edit')}
              accessibilityRole='button'
              accessibilityLabel='Edit profile'>
              <View style={[styles.editPencil, { backgroundColor: theme.accent }]}>
                <Ionicons name='pencil' size={14} color='#FFFFFF' />
              </View>
            </Pressable>
          </View>
          <Text style={[styles.email, { color: theme.textSecondary }]}>
            zenifer.aniston@email.com
          </Text>
        </View>

        <View style={[styles.sectionDivider, { backgroundColor: theme.divider }]} />

        <View style={styles.menu}>
          {MENU.map((item, index) => (
            <ProfileMenuItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              isLast={index === MENU.length - 1}
              onPress={() => {
                if (item.id === 'favourites') router.push('/profile/favourites');
                if (item.id === 'payments') router.push('/profile/payments');
                if (item.id === 'language') router.push('/profile/language');
                if (item.id === 'help') router.push('/profile/help');
              }}
            />
          ))}
        </View>

        <Pressable
          onPress={handleLogout}
          disabled={loggingOut}
          style={({ pressed }) => [
            styles.logoutBtn,
            {
              borderColor: theme.error,
              opacity: pressed || loggingOut ? 0.7 : 1,
            },
          ]}
          accessibilityRole='button'
          accessibilityLabel='Log out'>
          <Text style={[styles.logoutLabel, { color: theme.error, fontFamily: fonts.semiBold }]}>
            {loggingOut ? 'Signing out…' : 'Log out'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const AVATAR_SIZE = 112;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  avatarBlock: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarLarge: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#E2E8F0',
  },
  editPhotoBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 6,
  },
  displayName: {
    fontSize: 20,
  },
  editPencil: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  email: {
    fontSize: 14,
  },
  sectionDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
  menu: {
    paddingTop: 4,
  },
  logoutBtn: {
    marginTop: 28,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutLabel: {
    fontSize: 16,
  },
});
