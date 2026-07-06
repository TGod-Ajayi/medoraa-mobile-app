import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  type ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppointmentListCard,
  type AppointmentListStatus,
} from '../../components/appointment';
import { ScreenHeader } from '../../components/doctor';
import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';
import {
  CONSULTATION_HISTORY_TAB_FILTER,
  resolveConsultationListStatus,
  useConsultationHistory,
  type ConsultationHistoryItem,
  type ConsultationHistoryTab,
} from '@repo/ui/graphql';

const TABS: { key: ConsultationHistoryTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const DEFAULT_DOCTOR_IMAGE = require('../../assets/images/user.png');
const EMPTY_HISTORY_IMAGE = require('../../assets/images/emptyDept.png');

function formatAppointmentDateTime(startDate: string) {
  const date = new Date(startDate);
  if (Number.isNaN(date.getTime())) return '';

  const datePart = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return `${datePart} | ${timePart}`;
}

function getDoctorName(appointment: ConsultationHistoryItem) {
  const { firstName, lastName } = appointment.doctor.user;
  return `Dr. ${firstName} ${lastName}`.trim();
}

function getDoctorSpecialty(appointment: ConsultationHistoryItem) {
  return (
    appointment.doctor.doctorsSpecialties?.[0]?.specialty.name ?? 'General'
  );
}

function getDoctorQualifications(appointment: ConsultationHistoryItem) {
  const parts = [
    appointment.doctor.medicalSchool,
    appointment.doctor.level,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : '—';
}

function getDoctorPhoto(appointment: ConsultationHistoryItem): ImageSourcePropType {
  return appointment.doctor.user.profilePhoto
    ? { uri: appointment.doctor.user.profilePhoto }
    : DEFAULT_DOCTOR_IMAGE;
}

function listStatusForTab(
  tab: ConsultationHistoryTab,
  appointment: ConsultationHistoryItem
): AppointmentListStatus {
  if (tab === 'upcoming') return 'upcoming';
  if (tab === 'completed') return 'completed';
  if (tab === 'cancelled') return 'cancelled';
  return resolveConsultationListStatus(appointment.status);
}

export default function HistoryTabScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [tab, setTab] = useState<ConsultationHistoryTab>('all');
  const filter = CONSULTATION_HISTORY_TAB_FILTER[tab];

  const { consultations, loading, error, refetch } = useConsultationHistory({
    filter,
  });

  const rows = useMemo(
    () =>
      consultations.map((appointment) => ({
        id: appointment.id,
        doctorName: getDoctorName(appointment),
        specialty: getDoctorSpecialty(appointment),
        qualifications: getDoctorQualifications(appointment),
        dateTimeLabel: formatAppointmentDateTime(appointment.startDate),
        photoSource: getDoctorPhoto(appointment),
        status: listStatusForTab(tab, appointment),
      })),
    [consultations, tab]
  );

  useEffect(() => {
    console.log(
      'consultationHistory response\n' +
        JSON.stringify(
          {
            tab,
            filter,
            consultations,
            loading,
            error: error?.message ?? null,
          },
          null,
          2
        )
    );
  }, [consultations, error, filter, loading, tab]);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps='handled'>
        <ScreenHeader title='History' />

        <View style={styles.segmentOuter}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.segmentRow}>
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <Pressable
                  key={t.key}
                  style={styles.tabPress}
                  onPress={() => setTab(t.key)}
                  accessibilityRole='tab'
                  accessibilityState={{ selected: active }}>
                  <Text
                    style={[
                      styles.tabLabel,
                      {
                        color: active ? theme.accent : theme.textSecondary,
                        fontFamily: active ? fonts.semiBold : fonts.regular,
                      },
                    ]}>
                    {t.label}
                  </Text>
                  <View
                    style={[
                      styles.tabIndicator,
                      { backgroundColor: active ? theme.accent : 'transparent' },
                    ]}
                  />
                </Pressable>
              );
            })}
          </ScrollView>
          <View style={[styles.tabBaseline, { backgroundColor: theme.divider }]} />
        </View>

        <View style={styles.list}>
          {loading && rows.length === 0 ? (
            <View style={styles.statusContainer}>
              <ActivityIndicator size='small' color={theme.accent} />
            </View>
          ) : error ? (
            <View style={styles.statusContainer}>
              <Text style={[styles.empty, { color: theme.textSecondary }]}>
                Unable to load history right now.
              </Text>
              <Pressable
                onPress={() => void refetch()}
                style={[styles.retryBtn, { borderColor: theme.accent }]}>
                <Text style={[styles.retryText, { color: theme.accent }]}>
                  Try again
                </Text>
              </Pressable>
            </View>
          ) : rows.length === 0 ? (
            <View style={styles.emptyState}>
              <Image
                source={EMPTY_HISTORY_IMAGE}
                style={styles.emptyImage}
                resizeMode='contain'
              />
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                No {tab === 'all' ? '' : `${tab} `}consultations yet
              </Text>
              <Text style={[styles.empty, { color: theme.textSecondary }]}>
                Your consultation history will appear here.
              </Text>
            </View>
          ) : (
            rows.map((row) => (
              <AppointmentListCard
                key={row.id}
                doctorName={row.doctorName}
                specialty={row.specialty}
                qualifications={row.qualifications}
                dateTimeLabel={row.dateTimeLabel}
                photoSource={row.photoSource}
                status={row.status}
                onSecondaryAction={() =>
                  router.push({
                    pathname: '/appointment-details',
                    params: { id: row.id },
                  })
                }
                secondaryLabel={
                  row.status === 'completed'
                    ? 'View details'
                    : row.status === 'cancelled'
                      ? 'Book again'
                      : 'View details'
                }
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 4,
  },
  segmentOuter: {
    marginBottom: 16,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 2,
  },
  tabPress: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 10,
    minWidth: 72,
  },
  tabLabel: {
    fontSize: 14,
  },
  tabIndicator: {
    marginTop: 4,
    height: 3,
    width: '70%',
    borderRadius: 2,
  },
  tabBaseline: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  list: {
    paddingTop: 4,
    gap: 12,
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 8,
  },
  emptyImage: {
    width: 140,
    height: 140,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
  },
  empty: {
    fontSize: 15,
    textAlign: 'center',
  },
  retryBtn: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  retryText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
  },
});
