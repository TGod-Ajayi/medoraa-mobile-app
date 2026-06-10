import { Button } from '@/components';
import { fonts } from '@/config/fonts';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Recipient = {
  id: string;
  initials: string;
  name: string;
  account: string;
  bank: string;
  tone: 'teal' | 'blue' | 'orange';
};
const {width, height} = Dimensions.get('window');
const recipients: Recipient[] = [
  {
    id: 'r1',
    initials: 'AZ',
    name: 'Aniston Zenifer',
    account: '2286421122',
    bank: 'Zenith Bank',
    tone: 'teal',
  },
  {
    id: 'r2',
    initials: 'ZA',
    name: 'Zenifer Aniston',
    account: '0428120756',
    bank: 'GTB',
    tone: 'blue',
  },
  {
    id: 'r3',
    initials: 'ZA',
    name: 'Zenifer Aniston',
    account: '8164499626',
    bank: 'PAYCOM',
    tone: 'orange',
  },
];

const toneStyle: Record<Recipient['tone'], { bg: string; text: string }> = {
  teal: { bg: '#E6F7F6', text: '#14B8A6' },
  blue: { bg: '#EAF3FF', text: '#3B82F6' },
  orange: { bg: '#FFF2E8', text: '#D97706' },
};

export default function WithdrawScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.card }]}>
          <Ionicons name="chevron-back" size={22} color="#64748B" />
        </Pressable>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Withdraw</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Recipients</Text>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {recipients.map((item) => (
          <Pressable key={item.id} style={[styles.recipientCard, { backgroundColor: theme.card }]}>
            <View style={[styles.initialsCircle, { backgroundColor: toneStyle[item.tone].bg }]}>
              <Text style={[styles.initialsText, { color: toneStyle[item.tone].text }]}>
                {item.initials}
              </Text>
            </View>
            <View style={styles.recipientInfo}>
              <Text style={[styles.recipientName, { color: theme.textPrimary }]}>{item.name}</Text>
              <Text style={styles.recipientMeta}>
                {item.account} • {item.bank}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          theme={theme}
          label="New Recipient"
          variant="secondary"
          style={styles.newRecipientBtn}
          labelStyle={styles.newRecipientLabel}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 14,
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
  title: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: fonts.semiBold,
  },
  headerSpacer: {
    width: 40,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 10,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.semiBold,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 10,
  },
  recipientCard: {
    borderRadius: 10,
    minHeight: 58,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  initialsCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.medium,
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.semiBold,
    marginBottom: 2,
  },
  recipientMeta: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  newRecipientBtn: {
    borderColor: '#20BEB8',
    borderRadius: 30,
    backgroundColor: 'transparent',
    marginBottom: (250/height) * 100
  },
  newRecipientLabel: {
    color: '#20BEB8',
    fontFamily: fonts.medium,
  },
});
