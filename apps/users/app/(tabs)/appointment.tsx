import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppointmentListCard,
  RescheduleAppointmentBottomSheet,
  type AppointmentListStatus,
  type RescheduleAppointmentTarget,
} from '../../components/appointment';
import { ScreenHeader } from '../../components/doctor';
import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';
import {
  APPOINTMENT_TAB_STATUSES,
  useMyAppointments,
  type UserAppointment,
} from '@repo/ui/graphql';

type TabKey = AppointmentListStatus;

const TABS: { key: TabKey; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const DEFAULT_DOCTOR_IMAGE = require('../../assets/images/user.png');

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

function getDoctorName(appointment: UserAppointment) {
  const { firstName, lastName } = appointment.doctor.user;
  return `Dr. ${firstName} ${lastName}`.trim();
}

function getDoctorSpecialty(appointment: UserAppointment) {
  return (
    appointment.doctor.doctorsSpecialties?.[0]?.specialty.name ?? 'General'
  );
}

function getDoctorQualifications(appointment: UserAppointment) {
  const parts = [
    appointment.doctor.medicalSchool,
    appointment.doctor.level,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : '—';
}

function getDoctorPhoto(appointment: UserAppointment): ImageSourcePropType {
  return appointment.doctor.user.profilePhoto
    ? { uri: appointment.doctor.user.profilePhoto }
    : DEFAULT_DOCTOR_IMAGE;
}

export default function AppointmentTabScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>('upcoming');

  const statuses = APPOINTMENT_TAB_STATUSES[tab];
  const { appointments, loading, error, refetch } = useMyAppointments({
    statuses,
  });
  const [rescheduleTarget, setRescheduleTarget] =
    useState<RescheduleAppointmentTarget | null>(null);

  useEffect(() => {
    console.log(
      'myAppointments response\n' +
        JSON.stringify(
          {
            tab,
            statuses,
            appointments,
            loading,
            error: error?.message ?? null,
          },
          null,
          2
        )
    );
  }, [appointments, error, loading, statuses, tab]);

  const rows = useMemo(
    () =>
      appointments.map((appointment) => ({
        id: appointment.id,
        doctorId: appointment.doctor.id,
        doctorName: getDoctorName(appointment),
        specialty: getDoctorSpecialty(appointment),
        qualifications: getDoctorQualifications(appointment),
        dateTimeLabel: formatAppointmentDateTime(appointment.startDate),
        photoSource: getDoctorPhoto(appointment),
        status: tab,
      })),
    [appointments, tab]
  );

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps='handled'>
        <ScreenHeader title='Appointments' />

        {/* Segment tabs */}
        <View style={styles.segmentOuter}>
          <View style={styles.segmentRow}>
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
          </View>
          <View style={[styles.tabBaseline, { backgroundColor: theme.divider }]} />
        </View>

        <View style={styles.list}>
          {loading ? (
            <View style={styles.statusContainer}>
              <ActivityIndicator size='small' color={theme.accent} />
            </View>
          ) : error ? (
            <Text style={[styles.empty, { color: theme.textSecondary }]}>
              Unable to load appointments right now.
            </Text>
          ) : rows.length === 0 ? (
            <Text style={[styles.empty, { color: theme.textSecondary }]}>
              No {tab} appointments.
            </Text>
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
                onCancel={row.status === 'upcoming' ? () => {} : undefined}
                onReschedule={
                  row.status === 'upcoming'
                    ? () =>
                        setRescheduleTarget({
                          appointmentId: row.id,
                          doctorId: row.doctorId,
                          doctorName: row.doctorName,
                          currentDateTimeLabel: row.dateTimeLabel,
                          specialty: row.specialty,
                          qualifications: row.qualifications,
                          photoSource: row.photoSource,
                        })
                    : undefined
                }
                onSecondaryAction={
                  row.status !== 'upcoming'
                    ? () =>
                        router.push({
                          pathname: '/appointment-details',
                          params: { id: row.id },
                        })
                    : undefined
                }
                secondaryLabel={
                  row.status === 'completed'
                    ? 'View details'
                    : row.status === 'cancelled'
                      ? 'Book again'
                      : undefined
                }
              />
            ))
          )}
        </View>
      </ScrollView>

      <RescheduleAppointmentBottomSheet
        visible={rescheduleTarget != null}
        target={rescheduleTarget}
        onClose={() => setRescheduleTarget(null)}
        onSuccess={() => void refetch()}
      />
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
  },
  tabPress: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 10,
  },
  tabLabel: {
    fontSize: 15,
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
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  empty: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 32,
  },
});
