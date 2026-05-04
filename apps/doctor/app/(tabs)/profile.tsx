import { Button } from '@/components';
import { fonts } from '@/config/fonts';
import { help, language, terms } from '@/config/svg';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import { onUserSignOut } from '@repo/ui/graphql';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';
import { SvgXml } from 'react-native-svg';

type MenuItem = {
  id: string;
  label: string;
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
  iconXml?: string;
};

const MENU_ITEMS: MenuItem[] = [
  { id: 'wallet', label: 'Wallet', iconName: 'wallet-outline' },
  { id: 'account-settings', label: 'Account Settings', iconName: 'settings-outline' },
  { id: 'availability', label: 'Availability', iconName: 'calendar-outline' },
  { id: 'security', label: 'Security', iconName: 'shield-checkmark-outline' },
  { id: 'language', label: 'Language', iconXml: language },
  { id: 'terms', label: 'Terms & Conditions', iconXml: terms },
  { id: 'help', label: 'Help Center', iconXml: help },
];

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await onUserSignOut();
      router.replace('/(auth)/sign-in');
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

  const handleMenuPress = (id: string) => {
    if (id === 'wallet') {
      router.push('/wallet' as never);
    }
    if (id === 'account-settings') {
      router.push('/account-settings' as never);
    }
    if (id === 'availability') {
      router.push('/availability' as never);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.profileTop}>
          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
              style={styles.avatar}
            />
            <Pressable style={styles.addAvatarBtn}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: theme.textPrimary }]}>Dr Zenifer Aniston</Text>
            <Ionicons name="checkmark-circle-outline" size={22} color="#20BEB8" />
          </View>
          <Text style={styles.email}>amilie498@gmail.com</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuWrap}>
          {MENU_ITEMS.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => handleMenuPress(item.id)}
              style={styles.menuRow}>
              <View style={styles.menuLeft}>
                <View style={styles.menuIconWrap}>
                  {item.iconXml ? (
                    <SvgXml xml={item.iconXml} />
                  ) : (
                    <Ionicons
                      name={item.iconName ?? 'ellipse-outline'}
                      size={22}
                      color="#64748B"
                    />
                  )}
                </View>
                <Text style={[styles.menuLabel, { color: theme.textPrimary }]}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#64748B" />
            </Pressable>
          ))}
        </View>

        <View style={styles.footer}>
          <Button
            theme={theme}
            label={loggingOut ? 'Logging out...' : 'Logout'}
            onPress={handleLogout}
            variant="secondary"
            disabled={loggingOut}
            labelStyle={{ color: '#F04438', fontFamily: fonts.medium }}
            style={{
              borderColor: '#F04438',
              borderRadius: 30,
              backgroundColor: 'transparent',
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  profileTop: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 16,
  },
  avatarWrap: {
    width: 100,
    height: 100,
    borderRadius: 62,
    backgroundColor: '#BFE7E5',
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 62,
  },
  addAvatarBtn: {
    position: 'absolute',
    right: -2,
    bottom: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#20BEB8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  name: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: fonts.semiBold,
  },
  email: {
    color: '#64748B',
    fontSize: 17,
    lineHeight: 22,
    fontFamily: fonts.regular,
  },
  divider: {
    height: 1,
    backgroundColor: '#D1D9E5',
    marginBottom: 14,
  },
  menuWrap: {
    gap: 12,
  },
  menuRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: fonts.medium,
  },
  footer: {
    marginTop: 18,
    paddingBottom: 8,
  },
});
