import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import {
  LayoutAnimation,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '../../components/doctor';
import { fonts } from '../../config/fonts';
import { useTheme, type AppTheme } from '../../config/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type HelpTab = 'faq' | 'contact';

const FAQ_ITEMS: { id: string; question: string; answer: string }[] = [
  {
    id: '1',
    question: 'What is Medicare?',
    answer:
      'Lorem ipsum dolor sit amet consectetur. Risus quam risus scelerisque eu ipsum.',
  },
  {
    id: '2',
    question: 'How to use Medicare?',
    answer:
      'Lorem ipsum dolor sit amet consectetur. Follow the in-app guide to browse plans and book care.',
  },
  {
    id: '3',
    question: 'How do I save the recordings?',
    answer:
      'Recordings are saved automatically to your account. You can access them from the History tab.',
  },
  {
    id: '4',
    question: 'How do I cancel an appointment?',
    answer:
      'Open Appointments, select the booking, and tap Cancel. Cancellation policies may apply.',
  },
  {
    id: '5',
    question: 'How do I exit the app?',
    answer:
      'Use your device home gesture or app switcher to leave the app. You can sign out from Profile → Security.',
  },
];

const PHONE_DISPLAY = '01626-865021';
const PHONE_TEL = 'tel:+8801626865021';
const WHATSAPP_LINK = 'https://wa.me/8801626865021';
const WEBSITE_URL = 'https://www.medicare.com';

function ContactUsTab({ theme }: { theme: AppTheme }) {
  const openUrl = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contactScroll}
      keyboardShouldPersistTaps='handled'>
      <Pressable
        onPress={() => {
          /* In-app chat can be wired later */
        }}
        style={({ pressed }) => [
          styles.contactCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.divider,
            shadowColor: '#000',
            opacity: pressed ? 0.95 : 1,
          },
        ]}
        accessibilityRole='button'
        accessibilityLabel='Live chat'>
        <Ionicons name='chatbubbles-outline' size={28} color={theme.accent} style={styles.contactIcon} />
        <Text style={[styles.contactRowTitle, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
          Live Chat
        </Text>
        <Ionicons name='chevron-forward' size={20} color={theme.textMuted} />
      </Pressable>

      <Pressable
        onPress={() => openUrl(PHONE_TEL)}
        style={({ pressed }) => [
          styles.contactCard,
          styles.contactCardSpacing,
          {
            backgroundColor: theme.card,
            borderColor: theme.divider,
            shadowColor: '#000',
            opacity: pressed ? 0.95 : 1,
          },
        ]}
        accessibilityRole='button'
        accessibilityLabel={`Hotline ${PHONE_DISPLAY}`}>
        <View style={styles.phoneIconWrap}>
          <Ionicons name='call-outline' size={26} color={theme.accent} />
          <View style={[styles.badge24, { backgroundColor: theme.accent }]}>
            <Text style={styles.badge24Text}>24</Text>
          </View>
        </View>
        <View style={styles.contactTextCol}>
          <Text style={[styles.contactSubtitle, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
            Hotline Number
          </Text>
          <Text style={[styles.contactValue, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
            {PHONE_DISPLAY}
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={() => openUrl(WHATSAPP_LINK)}
        style={({ pressed }) => [
          styles.contactCard,
          styles.contactCardSpacing,
          {
            backgroundColor: theme.card,
            borderColor: theme.divider,
            shadowColor: '#000',
            opacity: pressed ? 0.95 : 1,
          },
        ]}
        accessibilityRole='button'
        accessibilityLabel={`Whatsapp ${PHONE_DISPLAY}`}>
        <Ionicons name='logo-whatsapp' size={28} color={theme.accent} style={styles.contactIcon} />
        <View style={styles.contactTextCol}>
          <Text style={[styles.contactSubtitle, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
            Whatsapp
          </Text>
          <Text style={[styles.contactValue, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
            {PHONE_DISPLAY}
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={() => {
          WebBrowser.openBrowserAsync(WEBSITE_URL).catch(() => {});
        }}
        style={({ pressed }) => [
          styles.contactCard,
          styles.contactCardSpacing,
          {
            backgroundColor: theme.card,
            borderColor: theme.divider,
            shadowColor: '#000',
            opacity: pressed ? 0.95 : 1,
          },
        ]}
        accessibilityRole='button'
        accessibilityLabel='Open website'>
        <Ionicons name='globe-outline' size={28} color={theme.accent} style={styles.contactIcon} />
        <View style={styles.contactTextCol}>
          <Text style={[styles.contactSubtitle, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
            Website
          </Text>
          <Text style={[styles.contactValue, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
            www.medicare.com
          </Text>
        </View>
        <Ionicons name='chevron-forward' size={20} color={theme.textMuted} />
      </Pressable>
    </ScrollView>
  );
}

export default function HelpCenterScreen() {
  const theme = useTheme();
  const [tab, setTab] = useState<HelpTab>('faq');
  const [expandedId, setExpandedId] = useState<string | null>('1');

  const toggleFaq = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScreenHeader title='Help Center' />

      {/* Tabs */}
      <View style={[styles.tabBar, { borderBottomColor: theme.divider }]}>
        <Pressable
          onPress={() => setTab('faq')}
          style={styles.tabHalf}
          accessibilityRole='tab'
          accessibilityState={{ selected: tab === 'faq' }}>
          <Text
            style={[
              styles.tabLabel,
              {
                color: tab === 'faq' ? theme.accent : theme.textSecondary,
                fontFamily: tab === 'faq' ? fonts.semiBold : fonts.regular,
              },
            ]}>
            FAQ
          </Text>
          <View
            style={[
              styles.tabUnderline,
              { backgroundColor: tab === 'faq' ? theme.accent : 'transparent' },
            ]}
          />
        </Pressable>
        <Pressable
          onPress={() => setTab('contact')}
          style={styles.tabHalf}
          accessibilityRole='tab'
          accessibilityState={{ selected: tab === 'contact' }}>
          <Text
            style={[
              styles.tabLabel,
              {
                color: tab === 'contact' ? theme.accent : theme.textSecondary,
                fontFamily: tab === 'contact' ? fonts.semiBold : fonts.regular,
              },
            ]}>
            Contact US
          </Text>
          <View
            style={[
              styles.tabUnderline,
              { backgroundColor: tab === 'contact' ? theme.accent : 'transparent' },
            ]}
          />
        </Pressable>
      </View>

      {tab === 'faq' ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps='handled'>
          {FAQ_ITEMS.map((item, index) => {
            const open = expandedId === item.id;
            return (
              <View
                key={item.id}
                style={[
                  styles.faqCard,
                  index < FAQ_ITEMS.length - 1 && styles.faqCardSpacing,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.divider,
                    shadowColor: '#000',
                  },
                ]}>
                <Pressable
                  onPress={() => toggleFaq(item.id)}
                  style={({ pressed }) => [styles.faqHeader, pressed && styles.pressed]}
                  accessibilityRole='button'
                  accessibilityState={{ expanded: open }}
                  accessibilityLabel={item.question}>
                  <Text
                    style={[
                      styles.question,
                      { color: theme.textPrimary, fontFamily: fonts.semiBold },
                    ]}>
                    {item.question}
                  </Text>
                  <Text style={[styles.expandIcon, { color: theme.textSecondary }]}>
                    {open ? '−' : '+'}
                  </Text>
                </Pressable>
                {open ? (
                  <Text style={[styles.answer, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
                    {item.answer}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <ContactUsTab theme={theme} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 20,
  },
  tabHalf: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 16,
    paddingBottom: 12,
  },
  tabUnderline: {
    height: 3,
    width: '100%',
    borderRadius: 2,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  faqCardSpacing: {
    marginBottom: 12,
  },
  faqCard: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  question: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  expandIcon: {
    fontSize: 22,
    lineHeight: 24,
    width: 28,
    textAlign: 'center',
    fontWeight: '500',
  },
  answer: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
    paddingRight: 4,
  },
  pressed: {
    opacity: 0.9,
  },
  contactScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 72,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 14,
  },
  contactCardSpacing: {
    marginTop: 12,
  },
  contactIcon: {
    marginTop: 2,
  },
  phoneIconWrap: {
    position: 'relative',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge24: {
    position: 'absolute',
    top: -2,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badge24Text: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
  },
  contactTextCol: {
    flex: 1,
    minWidth: 0,
  },
  contactSubtitle: {
    fontSize: 13,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
  },
  contactRowTitle: {
    flex: 1,
    fontSize: 16,
  },
});
