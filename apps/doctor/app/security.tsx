import { fonts } from '@/config/fonts';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SecurityItem = {
  id: string;
  label: string;
  href?: string;
};

const SECURITY_ITEMS: SecurityItem[] = [
  { id: 'change-password', label: 'Change Password', href: '/change-password' },
  { id: 'two-factor', label: '2 Factor Authentication' },
];

export default function SecurityScreen() {
  const theme = useTheme();
  const router = useRouter();

  const handleItemPress = (item: SecurityItem) => {
    if (item.href) {
      router.push(item.href as never);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.card }]}>
          <Ionicons name="chevron-back" size={22} color="#667085" />
        </Pressable>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Security</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {SECURITY_ITEMS.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => handleItemPress(item)}
              style={[styles.card, { backgroundColor: theme.card }]}>
              <Text style={[styles.cardLabel, { color: theme.textPrimary }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#667085" />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  list: {
    gap: 10,
  },
  card: {
    minHeight: 56,
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.medium,
  },
});
