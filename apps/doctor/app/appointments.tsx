import { fonts } from '@/config/fonts';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import {
  Types,
  useAppointments,
  useDoctor,
  type DoctorAppointment,
} from '@repo/ui/graphql';
import { useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function getPatientName(appointment: DoctorAppointment) {
  const { firstName, lastName } = appointment.patient.user;
  return [firstName, lastName].filter(Boolean).join(' ').trim() || 'Patient';
}

function formatAppointmentDateTime(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime())) return '—';

  const datePart = start.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const startTime = start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const endTime = !Number.isNaN(end.getTime())
    ? end.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : null;

  return endTime ? `${datePart} · ${startTime} – ${endTime}` : `${datePart} · ${startTime}`;
}

function formatStatusLabel(status: string) {
  return status.replace(/_/g, ' ');
}

function statusTone(
  status: Types.AppointmentStatus,
): { bg: string; text: string } {
  switch (status) {
    case Types.AppointmentStatus.Cancelled:
    case Types.AppointmentStatus.Missed:
      return { bg: '#FEE2E2', text: '#B91C1C' };
    case Types.AppointmentStatus.Completed:
      return { bg: '#DCFCE7', text: '#15803D' };
    case Types.AppointmentStatus.InProgress:
      return { bg: '#FFEDD5', text: '#C2410C' };
    default:
      return { bg: '#DBEAFE', text: '#1D4ED8' };
  }
}

export default function AppointmentsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { doctor } = useDoctor();

  const {
    appointments,
    pageInfo,
    metaData,
    loading,
    error,
    refetch,
    data,
  } = useAppointments({
    skip: !doctor?.id,
    filter: doctor?.id ? { doctorId: doctor.id } : undefined,
    limit: 50,
    page: 1,
  });

  const sortedAppointments = useMemo(
    () =>
      [...appointments].sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      ),
    [appointments],
  );

  useEffect(() => {
    console.log(
      '[doctor-appointments] full response\n' +
        JSON.stringify(
          {
            appointments: sortedAppointments,
            pageInfo,
            metaData,
            loading,
            error: error?.message ?? null,
            raw: data,
          },
          null,
          2,
        ),
    );
  }, [sortedAppointments, pageInfo, metaData, loading, error, data]);

  const totalLabel =
    pageInfo?.totalItems != null
      ? `${pageInfo.totalItems} total`
      : `${sortedAppointments.length} total`;

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.card }]}>
          <Ionicons name='chevron-back' size={20} color='#667085' />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            All appointments
          </Text>
          <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
            {totalLabel}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {loading && sortedAppointments.length === 0 ? (
        <View style={styles.centeredState}>
          <ActivityIndicator size='large' color={theme.accent} />
        </View>
      ) : error ? (
        <View style={styles.centeredState}>
          <Text style={[styles.stateText, { color: theme.textSecondary }]}>
            Could not load appointments.
          </Text>
          <Pressable
            onPress={() => void refetch()}
            style={[styles.retryBtn, { borderColor: theme.accent }]}>
            <Text style={[styles.retryText, { color: theme.accent }]}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.contentContainer,
            sortedAppointments.length === 0 && styles.contentContainerEmpty,
          ]}>
          {sortedAppointments.length === 0 ? (
            <Text style={[styles.stateText, { color: theme.textSecondary }]}>
              No appointments found.
            </Text>
          ) : (
            sortedAppointments.map((item) => {
              const tone = statusTone(item.status);
              return (
                <View
                  key={item.id}
                  style={[styles.card, { backgroundColor: theme.card }]}>
                  <View style={styles.cardTop}>
                    <Text
                      style={[styles.patientName, { color: theme.textPrimary }]}
                      numberOfLines={1}>
                      {getPatientName(item)}
                    </Text>
                    <View style={[styles.statusPill, { backgroundColor: tone.bg }]}>
                      <Text style={[styles.statusText, { color: tone.text }]}>
                        {formatStatusLabel(item.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.metaRow}>
                    <Ionicons name='calendar-outline' size={14} color={theme.accent} />
                    <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                      {formatAppointmentDateTime(item.startDate, item.endDate)}
                    </Text>
                  </View>

                  <View style={styles.detailGrid}>
                    <Text style={[styles.detailLabel, { color: theme.textMuted }]}>
                      Type
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.textSecondary }]}>
                      {formatStatusLabel(item.type)}
                    </Text>
                    <Text style={[styles.detailLabel, { color: theme.textMuted }]}>
                      Payment
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.textSecondary }]}>
                      {formatStatusLabel(item.paymentStatus)}
                    </Text>
                    {item.notes ? (
                      <>
                        <Text style={[styles.detailLabel, { color: theme.textMuted }]}>
                          Notes
                        </Text>
                        <Text style={[styles.detailValue, { color: theme.textSecondary }]}>
                          {item.notes}
                        </Text>
                      </>
                    ) : null}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
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
    paddingHorizontal: 12,
    paddingTop: 8,
    marginBottom: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: fonts.semiBold,
  },
  headerSub: {
    fontSize: 12,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  headerSpacer: {
    width: 32,
  },
  contentContainer: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    gap: 10,
  },
  contentContainerEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  stateText: {
    fontSize: 14,
    fontFamily: fonts.regular,
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
  card: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  patientName: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    textTransform: 'capitalize',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.regular,
  },
  detailGrid: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: fonts.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  detailValue: {
    fontSize: 13,
    fontFamily: fonts.regular,
    marginBottom: 4,
  },
});
