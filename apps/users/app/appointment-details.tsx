import { Ionicons } from '@expo/vector-icons';
import {
  Types,
  useBookAppointment,
  useDoctorAvailableTimeSlots,
  useDoctorDetails,
} from '@repo/ui/graphql';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  BookingContextCard,
  BookingStepIndicator,
  formatAppointmentDateTime,
  PaymentDetailsSection,
  PrimaryCtaButton,
  resolveRouteParam,
  safeDecodeParam,
} from '../components/appointment';
import { ScreenHeader } from '../components/doctor';
import { fonts } from '../config/fonts';
import type { AppTheme } from '../config/theme';
import { useTheme } from '../config/theme';

const DEFAULT_DOCTOR_IMAGE = require('../assets/images/user.png');

const INSTRUCTIONS = [
  'Join from a quiet place with a stable internet connection',
  'Allow camera and microphone access when prompted',
  'Describe symptoms clearly so your doctor can help',
];

function getErrorMessage(error: unknown) {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = String((error as { message: string }).message);
    if (message.trim()) return message;
  }
  return 'Unable to book the appointment right now. Please try again.';
}

export default function AppointmentDetailsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams<{
    patientName?: string;
    age?: string;
    gender?: string;
    notes?: string;
    type?: string;
    doctorId?: string | string[];
    doctorTimeSlotId?: string | string[];
  }>();

  const { bookAppointment, loading: booking } = useBookAppointment();

  const doctorId = resolveRouteParam(params.doctorId);
  const doctorTimeSlotId = resolveRouteParam(params.doctorTimeSlotId);
  const patientName = safeDecodeParam(resolveRouteParam(params.patientName), 'Patient');
  const age = resolveRouteParam(params.age) ?? '—';
  const gender = safeDecodeParam(resolveRouteParam(params.gender), '—');
  const notes = safeDecodeParam(resolveRouteParam(params.notes), '').trim();

  const initialType =
    resolveRouteParam(params.type) === Types.AppointmentType.Instant
      ? Types.AppointmentType.Instant
      : Types.AppointmentType.Scheduled;
  const [appointmentType, setAppointmentType] =
    useState<Types.AppointmentType>(initialType);

  const { doctor, loading: doctorLoading } = useDoctorDetails(doctorId, {
    skip: !doctorId,
  });
  const { slots } = useDoctorAvailableTimeSlots({
    doctorId,
    skip: !doctorId,
  });

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === doctorTimeSlotId) ?? null,
    [doctorTimeSlotId, slots],
  );

  const scheduleLabel = selectedSlot
    ? formatAppointmentDateTime(
        selectedSlot.startDateTime,
        selectedSlot.endDateTime,
      )
    : null;

  const specialtyLabel =
    doctor?.doctorsSpecialties
      ?.map((entry) => entry.specialty.name)
      .filter(Boolean)
      .join(', ') || 'General practice';

  const doctorName = doctor
    ? (() => {
        const fullName = [doctor.user.firstName, doctor.user.lastName]
          .filter((value): value is string => Boolean(value?.trim()))
          .join(' ');
        return fullName ? `Dr. ${fullName}` : 'Doctor';
      })()
    : 'Doctor';

  const doctorPhoto = doctor?.user.profilePhoto
    ? { uri: doctor.user.profilePhoto }
    : DEFAULT_DOCTOR_IMAGE;

  const instantEnabled = Boolean(doctor?.instantConsultationEnabled);
  const consultationFee =
    appointmentType === Types.AppointmentType.Instant &&
    doctor?.instantConsultationFee
      ? doctor.instantConsultationFee
      : doctor?.consultationFee;

  const paymentLines = useMemo(
    () => [
      {
        label: 'Consultation fee',
        value:
          typeof consultationFee === 'number' && consultationFee > 0
            ? `$${Math.round(consultationFee)}`
            : '—',
      },
      {
        label: 'Appointment type',
        value:
          appointmentType === Types.AppointmentType.Instant
            ? 'Instant'
            : 'Scheduled',
      },
    ],
    [appointmentType, consultationFee],
  );

  const handleBook = useCallback(async () => {
    if (!doctorId || !doctorTimeSlotId) {
      Alert.alert(
        'Missing details',
        'Doctor and time slot are required. Go back and choose a time.',
        [
          {
            text: 'Choose time',
            onPress: () =>
              router.replace({
                pathname: '/select-appointment-slot',
                params: { doctorId: doctorId ?? '' },
              }),
          },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
      return;
    }

    const input = {
      doctorId,
      doctorTimeSlotId,
      notes: notes || undefined,
      type: appointmentType,
    };

    try {
      const appointment = await bookAppointment(input);

      if (!appointment) {
        Alert.alert('Booking failed', 'No appointment was returned. Please try again.');
        return;
      }

      router.replace({
        pathname: '/consultation-complete',
        params: {
          appointmentId: appointment.id,
          dateTimeLabel: encodeURIComponent(
            scheduleLabel ?? formatAppointmentDateTime(appointment.startDate),
          ),
          doctorName: encodeURIComponent(doctorName),
        },
      });
    } catch (error) {
      Alert.alert('Booking failed', getErrorMessage(error));
    }
  }, [
    appointmentType,
    bookAppointment,
    doctorId,
    doctorName,
    doctorTimeSlotId,
    notes,
    router,
    scheduleLabel,
  ]);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top']}>
      <View style={styles.flex}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          <ScreenHeader title='Confirm booking' />
          <BookingStepIndicator current='confirm' />

          <BookingContextCard
            doctorName={doctorName}
            specialty={specialtyLabel}
            photoSource={doctorPhoto}
            dateTimeLabel={scheduleLabel}
            loading={doctorLoading}
          />

          {instantEnabled ? (
            <View
              style={[
                styles.card,
                { backgroundColor: theme.card, borderColor: theme.divider },
              ]}>
              <Text
                style={[
                  styles.cardTitle,
                  { color: theme.textPrimary, fontFamily: fonts.semiBold },
                ]}>
                Appointment type
              </Text>
              <View style={styles.typeRow}>
                <TypeChip
                  label='Scheduled'
                  selected={appointmentType === Types.AppointmentType.Scheduled}
                  onPress={() => setAppointmentType(Types.AppointmentType.Scheduled)}
                  theme={theme}
                />
                <TypeChip
                  label='Instant'
                  selected={appointmentType === Types.AppointmentType.Instant}
                  onPress={() => setAppointmentType(Types.AppointmentType.Instant)}
                  theme={theme}
                />
              </View>
            </View>
          ) : null}

          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.divider,
              },
            ]}>
            <Text
              style={[
                styles.cardTitle,
                { color: theme.textPrimary, fontFamily: fonts.semiBold },
              ]}>
              Patient details
            </Text>
            <DetailRow label='Name' value={patientName} theme={theme} />
            <DetailRow label='Age' value={`${age} years`} theme={theme} />
            <DetailRow label='Gender' value={gender} theme={theme} />
            <View style={styles.problemBlock}>
              <View style={styles.detailRow}>
                <Text style={[styles.labelCol, { color: theme.textSecondary }]}>
                  Notes
                </Text>
                <Text style={[styles.colon, { color: theme.textSecondary }]}>:</Text>
                <Text style={[styles.valueCol, { color: theme.textPrimary, flex: 1 }]}>
                  {notes || 'No notes provided'}
                </Text>
              </View>
            </View>
          </View>

          <PaymentDetailsSection lines={paymentLines} />

          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.divider,
              },
            ]}>
            <Text
              style={[
                styles.cardTitle,
                { color: theme.textPrimary, fontFamily: fonts.semiBold },
              ]}>
              Before you connect
            </Text>
            {INSTRUCTIONS.map((line) => (
              <View key={line} style={styles.instructionRow}>
                <Ionicons name='checkmark-circle' size={22} color='#22C55E' />
                <Text style={[styles.instructionText, { color: theme.textPrimary }]}>
                  {line}
                </Text>
              </View>
            ))}
          </View>

          <View style={{ height: 8 }} />
        </ScrollView>

        <SafeAreaView
          edges={['bottom']}
          style={[styles.footer, { backgroundColor: theme.background }]}>
          <PrimaryCtaButton
            label={booking ? 'Booking appointment…' : 'Confirm & book'}
            disabled={booking || doctorLoading}
            onPress={booking ? undefined : handleBook}
          />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}

function TypeChip({
  label,
  selected,
  onPress,
  theme,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  theme: AppTheme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.typeChip,
        {
          backgroundColor: selected ? theme.accent : theme.surfaceMuted,
        },
      ]}
      accessibilityRole='radio'
      accessibilityState={{ selected }}>
      <Text
        style={[
          styles.typeChipText,
          {
            color: selected ? '#FFFFFF' : theme.textPrimary,
            fontFamily: selected ? fonts.semiBold : fonts.regular,
          },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

function DetailRow({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: AppTheme;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.labelCol, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.colon, { color: theme.textSecondary }]}>:</Text>
      <Text style={[styles.valueCol, { color: theme.textPrimary, flex: 1 }]}>{value}</Text>
    </View>
  );
}

const LABEL_WIDTH = 72;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 4,
  },
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 14,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  typeChip: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  typeChipText: {
    fontSize: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  labelCol: {
    width: LABEL_WIDTH,
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  colon: {
    width: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  valueCol: {
    fontSize: 14,
    lineHeight: 20,
  },
  problemBlock: {
    marginTop: 2,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
