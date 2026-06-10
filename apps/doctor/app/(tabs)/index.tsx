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
import {
  Types,
  useAppointments,
  useDoctor,
  useDoctorReviews,
  type DoctorAppointment,
  type DoctorProfile,
  type DoctorReviewItem,
} from '@repo/ui/graphql';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  ActivityIndicator,
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

const ACTIVE_APPOINTMENT_STATUSES = new Set([
  Types.AppointmentStatus.Scheduled,
  Types.AppointmentStatus.Confirmed,
  Types.AppointmentStatus.Pending,
  Types.AppointmentStatus.InProgress,
  Types.AppointmentStatus.Rescheduled,
]);

type ScheduleRow = {
  id: string;
  name: string;
  time: string;
  tag: string;
  tagTone: 'orange' | 'blue' | 'green';
  action: string;
};

type ReviewRow = {
  id: string;
  name: string;
  when: string;
  rating: number;
  text: string;
};

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

function formatDoctorDisplayName(doctor: DoctorProfile | null): string {
  const user = doctor?.user;
  if (user?.firstName || user?.lastName) {
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
    return fullName.startsWith('Dr') ? fullName : `Dr ${fullName}`;
  }
  return 'Doctor';
}

function isSameCalendarDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function formatAppointmentTime(startDate: string) {
  const date = new Date(startDate);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatScheduleDateTime(startDate: string, referenceDay: Date) {
  const date = new Date(startDate);
  if (Number.isNaN(date.getTime())) return '—';
  const time = formatAppointmentTime(startDate);
  if (isSameCalendarDay(date, referenceDay)) return time;
  const datePart = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  return `${datePart} · ${time}`;
}

function getPatientName(appointment: DoctorAppointment) {
  const { firstName, lastName } = appointment.patient.user;
  return [firstName, lastName].filter(Boolean).join(' ').trim() || 'Patient';
}

function getAppointmentTag(appointment: DoctorAppointment): {
  tag: string;
  tagTone: ScheduleRow['tagTone'];
} {
  if (appointment.type === Types.AppointmentType.Instant) {
    return { tag: 'Instant consultation', tagTone: 'orange' };
  }
  if (appointment.isRescheduled) {
    return { tag: 'Rescheduled', tagTone: 'blue' };
  }
  if (appointment.notes?.trim()) {
    return { tag: appointment.notes.trim(), tagTone: 'green' };
  }
  return { tag: 'Scheduled visit', tagTone: 'blue' };
}

function mapAppointmentToScheduleRow(
  appointment: DoctorAppointment,
  referenceDay: Date,
): ScheduleRow {
  const { tag, tagTone } = getAppointmentTag(appointment);
  return {
    id: appointment.id,
    name: getPatientName(appointment),
    time: formatScheduleDateTime(appointment.startDate, referenceDay),
    tag,
    tagTone,
    action: appointment.type === Types.AppointmentType.Instant ? 'Start call' : 'Start',
  };
}

function isActiveAppointment(appointment: DoctorAppointment) {
  return ACTIVE_APPOINTMENT_STATUSES.has(appointment.status);
}

function isTodayAppointment(appointment: DoctorAppointment, today: Date) {
  const start = new Date(appointment.startDate);
  return !Number.isNaN(start.getTime()) && isSameCalendarDay(start, today);
}

function isUpcomingAppointment(appointment: DoctorAppointment, today: Date) {
  if (!isActiveAppointment(appointment)) return false;
  const start = new Date(appointment.startDate);
  return !Number.isNaN(start.getTime()) && start.getTime() >= startOfDay(today).getTime();
}

function getReviewPatientName(review: DoctorReviewItem) {
  const { firstName, lastName } = review.patient.user;
  return [firstName, lastName].filter(Boolean).join(' ').trim() || 'Patient';
}

function formatReviewWhen(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '';
  const now = new Date();
  const diffDays = Math.floor(
    (startOfDay(now).getTime() - startOfDay(date).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function mapReviewToRow(review: DoctorReviewItem): ReviewRow {
  return {
    id: review.id,
    name: getReviewPatientName(review),
    when: formatReviewWhen(review.createdAt),
    rating: review.rating,
    text: review.text?.trim() || 'No review text provided.',
  };
}

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { doctor, loading, error } = useDoctor();
  const doctorDisplayName = useMemo(() => formatDoctorDisplayName(doctor), [doctor]);

  const {
    appointments,
    pageInfo,
    metaData,
    loading: appointmentsLoading,
    error: appointmentsError,
    data: appointmentsData,
  } = useAppointments({
    skip: !doctor?.id,
    filter: doctor?.id ? { doctorId: doctor.id } : undefined,
    limit: 20,
    page: 1,
  });

  const {
    reviews,
    loading: reviewsLoading,
    error: reviewsError,
    data: reviewsData,
  } = useDoctorReviews({
    doctorId: doctor?.id,
    skip: !doctor?.id,
  });

  const reviewRows = useMemo(() => reviews.map(mapReviewToRow), [reviews]);

  useEffect(() => {
    console.log(
      '[doctor-home] getDoctor response:\n' +
        JSON.stringify(
          {
            doctor,
            loading,
            error: error?.message ?? null,
          },
          null,
          2,
        ),
    );
  }, [doctor, loading, error]);

  useEffect(() => {
    console.log(
      '[doctor-home] appointments response:',
      JSON.stringify(
        {
          appointments,
          pageInfo,
          metaData,
          loading: appointmentsLoading,
          error: appointmentsError?.message ?? null,
          raw: appointmentsData,
        },
        null,
        2,
      ),
    );
  }, [
    appointments,
    pageInfo,
    metaData,
    appointmentsLoading,
    appointmentsError,
    appointmentsData,
  ]);

  useEffect(() => {
    if (!doctor?.id) return;
    console.log(
      '[doctor-home] getDoctorReviews response:\n' +
        JSON.stringify(
          {
            doctorId: doctor.id,
            reviews,
            loading: reviewsLoading,
            error: reviewsError?.message ?? null,
            raw: reviewsData,
          },
          null,
          2,
        ),
    );
  }, [doctor?.id, reviews, reviewsLoading, reviewsError, reviewsData]);

  const today = useMemo(() => new Date(), []);

  const todayScheduleItems = useMemo(
    () =>
      appointments
        .filter((item) => isActiveAppointment(item) && isTodayAppointment(item, today))
        .sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
        )
        .map((item) => mapAppointmentToScheduleRow(item, today)),
    [appointments, today],
  );

  const upcomingScheduleItems = useMemo(
    () =>
      appointments
        .filter((item) => isUpcomingAppointment(item, today))
        .sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
        )
        .map((item) => mapAppointmentToScheduleRow(item, today)),
    [appointments, today],
  );

  const scheduleItems =
    todayScheduleItems.length > 0 ? todayScheduleItems : upcomingScheduleItems;
  const scheduleMode = todayScheduleItems.length > 0 ? 'today' : 'upcoming';

  const appointmentsSummaryLabel = useMemo(() => {
    if (todayScheduleItems.length > 0) {
      const count = todayScheduleItems.length;
      return count === 1 ? '1 appointment today' : `${count} appointments today`;
    }
    if (upcomingScheduleItems.length > 0) {
      const count = upcomingScheduleItems.length;
      return count === 1 ? '1 upcoming appointment' : `${count} upcoming appointments`;
    }
    return 'No upcoming appointments';
  }, [todayScheduleItems.length, upcomingScheduleItems.length]);

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
                  {doctorDisplayName}
                </Text>
              
            </View>
            <Pressable
              hitSlop={12}
              style={styles.bellWrap}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              onPress={() => router.push('/notifications')}>
              <SvgXml xml={notifications} width={20} height={20} />
            </Pressable>
          </View>

          {/* Quick actions */}
          <View style={styles.quickRow}>
            <Pressable
              style={[styles.quickCard, { backgroundColor: "#EBF6FF" , borderColor:"#99D1FF"}]}
              onPress={openConsultationSheet}>
              <View style={[styles.quickIconCircle, { backgroundColor: "#008CFF"}]}>
                <SvgXml xml={recordRecord} width={20} height={20} />
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
                <SvgXml xml={appointmentTime} width={20} height={20} />
              </View>
              <View style={styles.quickCardBody}>
                <Text style={[styles.quickTitle, { color:colorScheme === "dark" ? "#64748B" : "black"}]}>Appointments</Text>
                <Text style={[styles.quickSub, { color: theme.textSecondary }]}>
                  {appointmentsSummaryLabel}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
            </Pressable>
          </View>

          {/* Today's schedule */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              {scheduleMode === 'today' ? "Today's schedule" : 'Upcoming appointments'}
            </Text>
            <Pressable
              hitSlop={8}
              accessibilityRole='button'
              accessibilityLabel='See all appointments'
              onPress={() => router.push('/appointments')}>
              <Text style={[styles.seeAll, { color: theme.accent }]}>See All</Text>
            </Pressable>
          </View>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            {appointmentsLoading ? (
              <View style={styles.scheduleStatus}>
                <ActivityIndicator size='small' color={theme.accent} />
              </View>
            ) : appointmentsError ? (
              <View style={styles.scheduleStatus}>
                <Text style={[styles.scheduleStatusText, { color: theme.textSecondary }]}>
                  Unable to load appointments right now.
                </Text>
              </View>
            ) : scheduleItems.length === 0 ? (
              <View style={styles.scheduleStatus}>
                <Text style={[styles.scheduleStatusText, { color: theme.textSecondary }]}>
                  No upcoming appointments.
                </Text>
              </View>
            ) : (
              scheduleItems.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.scheduleRow,
                    index < scheduleItems.length - 1 && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: theme.divider,
                    },
                  ]}>
                  <View style={styles.scheduleLeft}>
                    <Text style={[styles.patientName, { color: theme.textPrimary }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.scheduleTime, { color: theme.textSecondary }]}>
                      {item.time}
                    </Text>
                    <View
                      style={[
                        styles.tag,
                        { backgroundColor: tagColors[item.tagTone].bg },
                      ]}>
                      <Text style={[styles.tagText, { color: tagColors[item.tagTone].text }]}>
                        {item.tag}
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    style={[styles.outlineBtn, { borderColor: theme.accent }]}
                    onPress={() => {}}>
                    <Text style={[styles.outlineBtnText, { color: theme.accent }]}>
                      {item.action}
                    </Text>
                  </Pressable>
                </View>
              ))
            )}
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
          {reviewsLoading && reviewRows.length === 0 ? (
            <View style={styles.reviewsStatus}>
              <ActivityIndicator size='small' color={theme.accent} />
            </View>
          ) : reviewsError ? (
            <View style={styles.reviewsStatus}>
              <Text style={[styles.reviewsStatusText, { color: theme.textSecondary }]}>
                Unable to load reviews right now.
              </Text>
            </View>
          ) : reviewRows.length === 0 ? (
            <View style={styles.reviewsStatus}>
              <Text style={[styles.reviewsStatusText, { color: theme.textSecondary }]}>
                No reviews yet.
              </Text>
            </View>
          ) : (
            reviewRows.map((r) => (
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
            ))
          )}
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
              {scheduleMode === 'today' ? "Today's appointments" : 'Upcoming appointments'}
            </Text>
            <View style={styles.sheetCountPill}>
              <Text style={styles.sheetCountText}>{scheduleItems.length}</Text>
            </View>
          </View>

          <View style={styles.sheetList}>
            {scheduleItems.length === 0 ? (
              <Text style={[styles.sheetEmptyText, { color: theme.textSecondary }]}>
                No upcoming appointments.
              </Text>
            ) : null}
            {scheduleItems.map((item) => (
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
  scheduleStatus: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleStatusText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: 'center',
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
  reviewsStatus: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewsStatusText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: 'center',
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
  sheetEmptyText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: 'center',
    paddingVertical: 8,
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
