import { fonts } from '@/config/fonts';
import { appointmentCancelled } from '@/config/svg';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { SvgXml } from 'react-native-svg';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FilterTab = 'all' | 'unread';

type NotificationKind =
  | 'patient'
  | 'consultation'
  | 'message'
  | 'appt_new'
  | 'appt_cancel';

type NotificationItem = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    kind: 'patient',
    title: 'New Patient Signup',
    body: 'Emily Johnson has requested to join your practice',
    time: '5 min',
    unread: true,
  },
  {
    id: '2',
    kind: 'consultation',
    title: 'Consultation Request',
    body: 'Michael Chen wants to schedule a video consultation',
    time: '18 hrs',
    unread: true,
  },
  {
    id: '3',
    kind: 'message',
    title: 'New Message',
    body: 'Sarah Williams sent you a message regarding lab results',
    time: '1 day',
    unread: true,
  },
  {
    id: '4',
    kind: 'appt_new',
    title: 'New Appointment request',
    body: 'David Park requested an appointment for tomorrow at 2:00 PM',
    time: '2 days',
    unread: true,
  },
  {
    id: '5',
    kind: 'appt_cancel',
    title: 'Appointment cancelled',
    body: 'Lisa Anderson cancelled her appointment scheduled for Friday',
    time: '3 days',
    unread: false,
  },
];

function renderKindIcon(kind: NotificationKind, color: string) {
  switch (kind) {
    case 'patient':
      return <Ionicons name="person-add-outline" size={22} color={color} />;
    case 'consultation':
      return <Ionicons name="videocam-outline" size={22} color={color} />;
    case 'message':
      return (
        <Ionicons name="chatbubble-ellipses-outline" size={22} color={color} />
      );
    case 'appt_new':
      return <Ionicons name="calendar-outline" size={22} color={color} />;
    case 'appt_cancel':
      return <SvgXml xml={appointmentCancelled} width={22} height={22} />;
    default:
      return <Ionicons name="notifications-outline" size={22} color={color} />;
  }
}

function iconStyle(kind: NotificationKind): {
  bg: string;
  color: string;
} {
  switch (kind) {
    case 'patient':
      return { bg: '#DCFCE7', color: '#15803D' };
    case 'consultation':
      return { bg: '#DBEAFE', color: '#1D4ED8' };
    case 'message':
      return { bg: '#EDE9FE', color: '#6D28D9' };
    case 'appt_new':
      return { bg: '#DCFCE7', color: '#15803D' };
    case 'appt_cancel':
      return { bg: '#FEE2E2', color: '#DC2626' };
    default:
      return { bg: '#F1F5F9', color: '#64748B' };
  }
}

export default function NotificationsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [filter, setFilter] = useState<FilterTab>('all');
  const [items, setItems] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const visible = useMemo(
    () => (filter === 'unread' ? items.filter((n) => n.unread) : items),
    [filter, items],
  );

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={[styles.backBtn, { backgroundColor: theme.card }]}
          onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={theme.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Notifications
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.toolbar}>
        <View style={styles.filterGroup}>
          <Pressable
            onPress={() => setFilter('all')}
            style={[
              styles.filterPill,
              {
                borderColor: filter === 'all' ? theme.accent : theme.divider,
                backgroundColor: theme.card,
              },
            ]}>
            <Text
              style={[
                styles.filterPillText,
                {
                  color: filter === 'all' ? theme.accent : theme.textMuted,
                },
              ]}>
              All
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setFilter('unread')}
            style={[
              styles.filterPill,
              {
                borderColor: filter === 'unread' ? theme.accent : theme.divider,
                backgroundColor: theme.card,
              },
            ]}>
            <Text
              style={[
                styles.filterPillText,
                {
                  color: filter === 'unread' ? theme.accent : theme.textMuted,
                },
              ]}>
              Unread
            </Text>
          </Pressable>
        </View>
        <Pressable
          onPress={markAllRead}
          style={[styles.markAllBtn, { borderColor: theme.accent }]}>
          <Text style={[styles.markAllText, { color: theme.accent }]}>
            Mark all as read
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}>
        {visible.map((n) => {
          const { bg, color } = iconStyle(n.kind);
          const timeColor = n.unread ? theme.accent : theme.textMuted;

          return (
            <View
              key={n.id}
              style={[styles.card, { backgroundColor: theme.card }]}>
              <View style={styles.cardTop}>
                <View style={styles.iconWrap}>
                  <View style={[styles.iconCircle, { backgroundColor: bg }]}>
                    {renderKindIcon(n.kind, color)}
                  </View>
                  {n.unread ? <View style={styles.unreadDot} /> : null}
                </View>
                <View style={styles.cardTextCol}>
                  <View style={styles.titleRow}>
                    <Text
                      style={[styles.cardTitle, { color: theme.textPrimary }]}
                      numberOfLines={2}>
                      {n.title}
                    </Text>
                    <Text style={[styles.time, { color: timeColor }]}>{n.time}</Text>
                  </View>
                  <Text
                    style={[styles.cardBody, { color: theme.textSecondary }]}
                    numberOfLines={3}>
                    {n.body}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: fonts.semiBold,
  },
  headerSpacer: {
    width: 40,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 12,
  },
  filterGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterPillText: {
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  markAllBtn: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  markAllText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    borderRadius: 12,
    padding: 14,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconWrap: {
    position: 'relative',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#20BEB8',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cardTextCol: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.semiBold,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    fontFamily: fonts.medium,
    marginTop: 2,
  },
  cardBody: {
    fontSize: 13,
    fontFamily: fonts.regular,
    lineHeight: 19,
  },
});
