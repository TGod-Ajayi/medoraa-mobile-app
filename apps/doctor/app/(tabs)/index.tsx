import { fonts } from '@/config/fonts';
import { useTheme } from '@/config/theme';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useColorScheme } from '@repo/ui/hooks';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef } from 'react';


import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appointmentTime, recordRecord, notifications } from '@/config/svg';

import { SvgXml } from 'react-native-svg';
const MOCK_DOCTOR_NAME = 'Dr Zenifer Aniston';

const SCHEDULE_ITEMS = [
  {
    id: '1',
    name: 'John Doe',
    time: '09:30 AM',
    tag: 'Video consultation',
    tagTone: 'orange' as const,
    action: 'Start call',
  },
  {
    id: '2',
    name: 'Alice Smith',
    time: '10:15 AM',
    tag: 'Follow-up',
    tagTone: 'blue' as const,
    action: 'Start',
  },
  {
    id: '3',
    name: 'Robert Brown',
    time: '11:00 AM',
    tag: 'New patient',
    tagTone: 'green' as const,
    action: 'Start',
  },
];

const REVIEWS = [
  {
    id: '1',
    name: 'Emma Wilson',
    when: 'Yesterday',
    rating: 5,
    text: 'Very professional and thorough consultation. Highly recommended!',
  },
  {
    id: '2',
    name: 'James Chen',
    when: '2 days ago',
    rating: 4,
    text: 'Clear explanations and great bedside manner.',
  },
];

const APPOINTMENT_SHEET_ITEMS = [
  {
    id: 'p1',
    name: 'Alice Smith',
    time: '09:15 AM',
    tag: 'Follow-up',
    tagTone: 'blue' as const,
  },
  {
    id: 'p2',
    name: 'John Doe',
    time: '09:30 AM',
    tag: 'Video consultation',
    tagTone: 'orange' as const,
  },
  {
    id: 'p3',
    name: 'Alice Smith',
    time: '09:15 AM',
    tag: 'Follow-up',
    tagTone: 'blue' as const,
  },
  {
    id: 'p4',
    name: 'John Doe',
    time: '09:30 AM',
    tag: 'Video consultation',
    tagTone: 'orange' as const,
  },
  {
    id: 'p5',
    name: 'Robert Brown',
    time: '11:00 AM',
    tag: 'New patient',
    tagTone: 'green' as const,
  },
  {
    id: 'p6',
    name: 'Robert Brown',
    time: '11:00 AM',
    tag: 'New patient',
    tagTone: 'green' as const,
  },
  {
    id: 'p7',
    name: 'John Doe',
    time: '11:30 AM',
    tag: 'Video consultation',
    tagTone: 'orange' as const,
  },
  {
    id: 'p8',
    name: 'Emma Wilson',
    time: '12:00 PM',
    tag: 'Follow-up',
    tagTone: 'blue' as const,
  },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={14}
          color={i <= rating ? '#FBBF24' : '#CBD5E1'}
        />
      ))}
    </View>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';
  const consultationSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['45%'], []);
  const colorScheme = useColorScheme();

  const tagColors = {
    orange: { bg: isDark ? 'rgba(251,146,60,0.2)' : '#FFEDD5', text: '#C2410C' },
    blue: { bg: isDark ? 'rgba(59,130,246,0.2)' : '#DBEAFE', text: '#1D4ED8' },
    green: { bg: isDark ? 'rgba(34,197,94,0.2)' : '#DCFCE7', text: '#15803D' },
  };

  const openConsultationSheet = useCallback(() => {
    consultationSheetRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.35}
      />
    ),
    []
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeTop} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.avatar}
              accessibilityLabel="Profile"
            />
            <View style={styles.headerTextWrap}>
              <Text style={[styles.hello, { color: theme.textSecondary }]}>
                Hello!{' '}
              </Text>
                <Text style={[styles.doctorName, { color: theme.textPrimary }]}>
                  {MOCK_DOCTOR_NAME}
                </Text>
              
            </View>
            <Pressable
              hitSlop={12}
              style={styles.bellWrap}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              onPress={() => router.push('/notifications')}>
              <SvgXml xml={notifications}/>
            </Pressable>
          </View>

          {/* Quick actions */}
          <View style={styles.quickRow}>
            <Pressable
              style={[styles.quickCard, { backgroundColor: "#EBF6FF" , borderColor:"#99D1FF"}]}
              onPress={openConsultationSheet}>
              <View style={[styles.quickIconCircle, { backgroundColor: "#008CFF"}]}>
                <SvgXml xml={recordRecord}/>
              </View>
              <View style={styles.quickCardBody}>
                <Text style={[styles.quickTitle, { color: colorScheme === "dark" ? "#64748B" : "black" }]}>Start Consultation</Text>
                <Text style={[styles.quickSub, { color: theme.textSecondary }]}>2 patients waiting</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
            </Pressable>
            <Pressable
              style={[styles.quickCard, { backgroundColor: "#FCF5FF" , borderColor:"#E099FF" }]}
              onPress={openConsultationSheet}>
              <View style={[styles.quickIconCircle, { backgroundColor: "#AE00FF"}]}>
                <SvgXml xml={appointmentTime} />
              </View>
              <View style={styles.quickCardBody}>
                <Text style={[styles.quickTitle, { color:colorScheme === "dark" ? "#64748B" : "black"}]}>Appointments</Text>
                <Text style={[styles.quickSub, { color: theme.textSecondary }]}>8 upcoming today</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
            </Pressable>
          </View>

          {/* Today's schedule */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              {"Today's schedule"}
            </Text>
            <Pressable hitSlop={8}>
              <Text style={[styles.seeAll, { color: theme.accent }]}>See All</Text>
            </Pressable>
          </View>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            {SCHEDULE_ITEMS.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.scheduleRow,
                  index < SCHEDULE_ITEMS.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: theme.divider,
                  },
                ]}>
                <View style={styles.scheduleLeft}>
                  <Text style={[styles.patientName, { color: theme.textPrimary }]}>{item.name}</Text>
                  <Text style={[styles.scheduleTime, { color: theme.textSecondary }]}>{item.time}</Text>
                  <View
                    style={[
                      styles.tag,
                      { backgroundColor: tagColors[item.tagTone].bg },
                    ]}>
                    <Text style={[styles.tagText, { color: tagColors[item.tagTone].text }]}>{item.tag}</Text>
                  </View>
                </View>
                <Pressable
                  style={[styles.outlineBtn, { borderColor: theme.accent }]}
                  onPress={() => {}}>
                  <Text style={[styles.outlineBtnText, { color: theme.accent }]}>{item.action}</Text>
                </Pressable>
              </View>
            ))}
          </View>

          {/* Patient overview */}
          <Text style={[styles.sectionTitle, styles.sectionTitleSpaced, { color: theme.textPrimary }]}>
            Patient overview
          </Text>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Ionicons name="people-outline" size={24} color={theme.accent} />
              <Text style={[styles.statValue, { color: theme.textPrimary }]}>28</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Patients</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Ionicons name="chatbubbles-outline" size={24} color={theme.accent} />
              <Text style={[styles.statValue, { color: theme.textPrimary }]}>36</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Consultations</Text>
            </View>
          </View>

          {/* Recent reviews */}
          <Text style={[styles.sectionTitle, styles.sectionTitleSpaced, { color: theme.textPrimary }]}>
            Recent reviews
          </Text>
          {REVIEWS.map((r) => (
            <View key={r.id} style={[styles.reviewCard, { backgroundColor: theme.card }]}>
              <View style={styles.reviewTop}>
                <View>
                  <Text style={[styles.reviewName, { color: theme.textPrimary }]}>{r.name}</Text>
                  <Text style={[styles.reviewWhen, { color: theme.textMuted }]}>{r.when}</Text>
                </View>
                <StarRow rating={r.rating} />
              </View>
              <Text style={[styles.reviewBody, { color: theme.textSecondary }]}>{r.text}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>

      <BottomSheetModal
        ref={consultationSheetRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        handleIndicatorStyle={styles.sheetHandle}
        backgroundStyle={[styles.sheetContainer, { backgroundColor: theme.card }]}>
        <BottomSheetView style={styles.sheetContent}>
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: theme.textPrimary }]}>
              {"Today's appointments"}
            </Text>
            <View style={styles.sheetCountPill}>
              <Text style={styles.sheetCountText}>{APPOINTMENT_SHEET_ITEMS.length}</Text>
            </View>
          </View>

          <View style={styles.sheetList}>
            {APPOINTMENT_SHEET_ITEMS.map((item) => (
              <View key={item.id} style={[styles.sheetRow, { backgroundColor: theme.background }]}>
                <View style={styles.sheetLeft}>
                  <Text style={[styles.sheetPatient, { color: theme.textPrimary }]}>{item.name}</Text>
                  <View style={styles.sheetMetaRow}>
                    <Text style={[styles.sheetTime, { color: theme.textSecondary }]}>{item.time}</Text>
                    <View
                      style={[
                        styles.tag,
                        styles.sheetTag,
                        { backgroundColor: tagColors[item.tagTone].bg },
                      ]}>
                      <Text style={[styles.tagText, { color: tagColors[item.tagTone].text }]}>
                        {item.tag}
                      </Text>
                    </View>
                  </View>
                </View>

                <Pressable
                  style={[styles.outlineBtn, styles.sheetStartBtn, { borderColor: theme.accent }]}
                  onPress={() => {}}>
                  <Text style={[styles.outlineBtnText, { color: theme.accent }]}>Start</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeTop: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 20,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(45,194,177,0.35)',
  },
  headerTextWrap: {
    flex: 1,
  },
  hello: {
    fontSize: 15,
    fontFamily: fonts.regular,
    lineHeight: 22,
  },
  doctorName: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
  bellWrap: {
    position: 'relative',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor : "white"
  },
  bellDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53E3E',
  },
  quickRow: {
    gap: 12,
    marginBottom: 24,
  },
  quickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
   
    padding: 16,
    gap: 12,
  },
  quickIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCardBody: {
    flex: 1,
  },
  quickTitle: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    marginBottom: 4,
  },
  quickSub: {
    fontSize: 13,
    fontFamily: fonts.regular,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    fontWeight: '500',
    lineHeight: 24,
  },
  sectionTitleSpaced: {
    marginTop: 8,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  scheduleLeft: {
    flex: 1,
    gap: 6,
  },
  patientName: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },
  scheduleTime: {
    fontSize: 13,
    fontFamily: fonts.regular,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontFamily: fonts.medium,
  },
  outlineBtn: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  outlineBtnText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontFamily: fonts.bold,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: fonts.regular,
  },
  reviewCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  reviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  reviewName: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
  },
  reviewWhen: {
    fontSize: 12,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewBody: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.regular,
  },
  sheetContainer: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  sheetContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 99,
    backgroundColor: '#CBD5E1',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 16,
    fontFamily: fonts.medium,
    lineHeight: 24,
    fontWeight: "500",
    color: "#0F172A",
  },
  sheetCountPill: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  sheetCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },
  sheetList: {
    gap: 12,
  },
  sheetRow: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  sheetLeft: {
    flex: 1,
    gap: 8,
  },
  sheetPatient: {
    fontSize: 14,
    lineHeight: 36,
    fontFamily: fonts.semiBold,
  },
  sheetMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sheetTime: {
    fontSize: 14,
    lineHeight: "140%",
    fontFamily: fonts.regular,
    color : "#475569",
    fontWeight: "400",
  },
  sheetTag: {
    paddingVertical: 3,
  },
  sheetStartBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
