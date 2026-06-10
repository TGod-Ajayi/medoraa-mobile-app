import { Ionicons } from '@expo/vector-icons';
import {
  useDoctorAvailableTimeSlots,
  useRescheduleAppointment,
} from '@repo/ui/graphql';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  type ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';

import { PrimaryCtaButton } from './PrimaryCtaButton';
import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

export type RescheduleAppointmentTarget = {
  appointmentId: string;
  currentDateTimeLabel: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  qualifications: string;
  photoSource: ImageSourcePropType;
};

type Props = {
  target: RescheduleAppointmentTarget | null;
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

type Step = 'reason' | 'datetime';

const RESCHEDULE_REASONS = [
  { id: 'not_available', label: "I'm not available on schedule" },
  { id: 'clash', label: 'I have a schedule clash' },
  { id: 'no_tell', label: "I don't want to tell" },
  { id: 'activity', label: "I have a activity that can't be left behind" },
  { id: 'others', label: 'Others' },
] as const;

type ReasonId = (typeof RESCHEDULE_REASONS)[number]['id'];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function getDateKey(dateStr: string) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatTimeLabel(startDateTime: string) {
  const start = new Date(startDateTime);
  if (Number.isNaN(start.getTime())) return 'Invalid time';
  return start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function FlowHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  const theme = useTheme();

  return (
    <View style={styles.headerRow}>
      <Pressable
        onPress={onBack}
        style={[styles.backBtn, { backgroundColor: theme.card }]}
        accessibilityRole='button'
        accessibilityLabel='Go back'>
        <Ionicons name='chevron-back' size={22} color={theme.textSecondary} />
      </Pressable>
      <Text
        style={[
          styles.headerTitle,
          { color: theme.textPrimary, fontFamily: fonts.semiBold },
        ]}
        numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.headerSide} />
    </View>
  );
}

function RadioOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={styles.radioRow}
      accessibilityRole='radio'
      accessibilityState={{ selected }}>
      <View
        style={[
          styles.radioOuter,
          { borderColor: selected ? theme.accent : theme.divider },
        ]}>
        {selected ? (
          <View style={[styles.radioInner, { backgroundColor: theme.accent }]} />
        ) : null}
      </View>
      <Text style={[styles.radioLabel, { color: theme.textPrimary }]}>{label}</Text>
    </Pressable>
  );
}

export function RescheduleAppointmentBottomSheet({
  target,
  visible,
  onClose,
  onSuccess,
}: Props) {
  const theme = useTheme();

  const [step, setStep] = useState<Step>('reason');
  const [selectedReasonId, setSelectedReasonId] = useState<ReasonId | null>(null);
  const [otherReasonText, setOtherReasonText] = useState('');
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const {
    slots,
    loading: slotsLoading,
    error: slotsError,
  } = useDoctorAvailableTimeSlots({
    doctorId: target?.doctorId,
    skip: !visible || !target?.doctorId || step !== 'datetime',
  });

  const { rescheduleAppointment, loading: submitting } = useRescheduleAppointment();

  const slotsByDate = useMemo(() => {
    const map = new Map<string, typeof slots>();
    for (const slot of slots) {
      const key = getDateKey(slot.startDateTime);
      if (!key) continue;
      const existing = map.get(key) ?? [];
      existing.push(slot);
      map.set(key, existing);
    }
    return map;
  }, [slots]);

  const datesInViewMonth = useMemo(() => {
    return Array.from(slotsByDate.keys())
      .filter((key) => {
        const [y, m] = key.split('-').map(Number);
        return y === viewYear && m === viewMonth + 1;
      })
      .sort();
  }, [slotsByDate, viewMonth, viewYear]);

  const timeSlotsForSelectedDate = useMemo(() => {
    if (!selectedDateKey) return [];
    return (slotsByDate.get(selectedDateKey) ?? []).sort(
      (a, b) =>
        new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
    );
  }, [selectedDateKey, slotsByDate]);

  const resetState = useCallback(() => {
    setStep('reason');
    setSelectedReasonId(null);
    setOtherReasonText('');
    setViewYear(new Date().getFullYear());
    setViewMonth(new Date().getMonth());
    setSelectedDateKey(null);
    setSelectedSlotId(null);
  }, []);

  useEffect(() => {
    if (!visible) resetState();
  }, [resetState, visible]);

  useEffect(() => {
    if (step !== 'datetime' || slotsLoading || datesInViewMonth.length === 0) return;

    if (!selectedDateKey || !datesInViewMonth.includes(selectedDateKey)) {
      setSelectedDateKey(datesInViewMonth[0] ?? null);
      setSelectedSlotId(null);
    }
  }, [datesInViewMonth, selectedDateKey, slotsLoading, step]);

  useEffect(() => {
    if (!selectedDateKey || timeSlotsForSelectedDate.length === 0) {
      setSelectedSlotId(null);
      return;
    }

    const stillValid = timeSlotsForSelectedDate.some((slot) => slot.id === selectedSlotId);
    if (!stillValid) {
      setSelectedSlotId(timeSlotsForSelectedDate[0]?.id ?? null);
    }
  }, [selectedDateKey, selectedSlotId, timeSlotsForSelectedDate]);

  const handleBack = () => {
    if (step === 'datetime') {
      setStep('reason');
      return;
    }
    onClose();
  };

  const getReasonText = () => {
    if (!selectedReasonId) return '';
    if (selectedReasonId === 'others') return otherReasonText.trim();
    return RESCHEDULE_REASONS.find((r) => r.id === selectedReasonId)?.label ?? '';
  };

  const handleNext = () => {
    if (!selectedReasonId) {
      showMessage({
        message: 'Please select a reason for rescheduling.',
        type: 'warning',
        duration: 3500,
      });
      return;
    }

    if (selectedReasonId === 'others' && !otherReasonText.trim()) {
      showMessage({
        message: 'Please describe your reason.',
        type: 'warning',
        duration: 3500,
      });
      return;
    }

    setStep('datetime');
  };

  const handleConfirm = async () => {
    if (!target || !selectedSlotId) {
      showMessage({
        message: 'Please select a new date and time.',
        type: 'warning',
        duration: 3500,
      });
      return;
    }

    const reason = getReasonText();
    if (!reason) return;

    try {
      await rescheduleAppointment({
        appointmentId: target.appointmentId,
        newDoctorTimeSlotId: selectedSlotId,
        rescheduleReason: reason,
      });

      showMessage({
        message: 'Appointment rescheduled successfully.',
        type: 'success',
        duration: 4000,
      });

      onSuccess?.();
      onClose();
    } catch {
      showMessage({
        message: 'Could not reschedule appointment. Try again.',
        type: 'danger',
        duration: 4000,
      });
    }
  };

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
    setSelectedDateKey(null);
    setSelectedSlotId(null);
  };

  const renderReasonStep = () => (
    <>
      <Text
        style={[
          styles.sectionTitle,
          { color: theme.textPrimary, fontFamily: fonts.semiBold },
        ]}>
        Reason for reschedule
      </Text>

      <View style={styles.reasonList}>
        {RESCHEDULE_REASONS.map((reason) => (
          <View key={reason.id}>
            <RadioOption
              label={reason.label}
              selected={selectedReasonId === reason.id}
              onPress={() => setSelectedReasonId(reason.id)}
            />
            {reason.id === 'others' && selectedReasonId === 'others' ? (
              <TextInput
                value={otherReasonText}
                onChangeText={setOtherReasonText}
                placeholder='Tell us more about your reason'
                placeholderTextColor={theme.textMuted}
                multiline
                textAlignVertical='top'
                style={[
                  styles.otherInput,
                  {
                    color: theme.textPrimary,
                    borderColor: theme.divider,
                    backgroundColor: theme.card,
                  },
                ]}
              />
            ) : null}
          </View>
        ))}
      </View>
    </>
  );

  const renderDateTimeStep = () => {
    if (!target) return null;

    return (
      <>
        <View
          style={[
            styles.doctorCard,
            { backgroundColor: theme.card, borderColor: theme.divider },
          ]}>
          <Image source={target.photoSource} style={styles.doctorAvatar} />
          <View style={styles.doctorInfo}>
            <Text
              style={[
                styles.doctorName,
                { color: theme.textPrimary, fontFamily: fonts.semiBold },
              ]}
              numberOfLines={1}>
              {target.doctorName}
            </Text>
            <Text style={[styles.doctorMeta, { color: theme.textPrimary }]} numberOfLines={1}>
              {target.specialty}
            </Text>
            <Text style={[styles.doctorQual, { color: theme.textSecondary }]} numberOfLines={2}>
              {target.qualifications}
            </Text>
          </View>
        </View>

        <View style={styles.scheduleHeader}>
          <Text
            style={[
              styles.sectionTitle,
              styles.sectionTitleCompact,
              { color: theme.textPrimary, fontFamily: fonts.semiBold },
            ]}>
            Schedule
          </Text>
          <View style={styles.monthPicker}>
            <Pressable onPress={() => shiftMonth(-1)} hitSlop={8} accessibilityLabel='Previous month'>
              <Ionicons name='chevron-back' size={18} color={theme.textSecondary} />
            </Pressable>
            <Text style={[styles.monthLabel, { color: theme.textPrimary, fontFamily: fonts.medium }]}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </Text>
            <Pressable onPress={() => shiftMonth(1)} hitSlop={8} accessibilityLabel='Next month'>
              <Ionicons name='chevron-forward' size={18} color={theme.textSecondary} />
            </Pressable>
          </View>
        </View>

        {slotsLoading ? (
          <View style={styles.statusBlock}>
            <ActivityIndicator size='small' color={theme.accent} />
          </View>
        ) : slotsError ? (
          <Text style={[styles.helperText, { color: theme.textSecondary }]}>
            Unable to load available slots right now.
          </Text>
        ) : datesInViewMonth.length === 0 ? (
          <Text style={[styles.helperText, { color: theme.textSecondary }]}>
            No available slots for {MONTH_NAMES[viewMonth]} {viewYear}. Try another month.
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateRow}>
            {datesInViewMonth.map((dateKey) => {
              const date = new Date(`${dateKey}T12:00:00`);
              const selected = selectedDateKey === dateKey;
              const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNum = date.getDate();

              return (
                <Pressable
                  key={dateKey}
                  onPress={() => {
                    setSelectedDateKey(dateKey);
                    setSelectedSlotId(null);
                  }}
                  style={[
                    styles.dateChip,
                    {
                      backgroundColor: selected ? theme.accent : theme.surfaceMuted,
                    },
                  ]}
                  accessibilityRole='button'
                  accessibilityState={{ selected }}>
                  <Text
                    style={[
                      styles.dateChipDay,
                      {
                        color: selected ? '#FFFFFF' : theme.textSecondary,
                        fontFamily: fonts.medium,
                      },
                    ]}>
                    {dayLabel}
                  </Text>
                  <Text
                    style={[
                      styles.dateChipNum,
                      {
                        color: selected ? '#FFFFFF' : theme.textPrimary,
                        fontFamily: fonts.semiBold,
                      },
                    ]}>
                    {dayNum}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        <Text
          style={[
            styles.sectionTitle,
            styles.timeSectionTitle,
            { color: theme.textPrimary, fontFamily: fonts.semiBold },
          ]}>
          Time
        </Text>

        {timeSlotsForSelectedDate.length === 0 ? (
          <Text style={[styles.helperText, { color: theme.textSecondary }]}>
            Select a date to see available times.
          </Text>
        ) : (
          <View style={styles.timeGrid}>
            {timeSlotsForSelectedDate.map((slot) => {
              const selected = selectedSlotId === slot.id;
              return (
                <Pressable
                  key={slot.id}
                  onPress={() => setSelectedSlotId(slot.id)}
                  style={[
                    styles.timeChip,
                    {
                      backgroundColor: selected ? theme.accent : theme.surfaceMuted,
                    },
                  ]}
                  accessibilityRole='radio'
                  accessibilityState={{ selected }}>
                  <Text
                    style={[
                      styles.timeChipText,
                      {
                        color: selected ? '#FFFFFF' : theme.textPrimary,
                        fontFamily: selected ? fonts.semiBold : fonts.regular,
                      },
                    ]}>
                    {formatTimeLabel(slot.startDateTime)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <View
          style={[
            styles.warningCard,
            { backgroundColor: theme.card, borderColor: theme.divider },
          ]}>
          <Text style={[styles.warningTitle, { fontFamily: fonts.semiBold }]}>Warning:</Text>
          <Text style={[styles.warningBody, { color: theme.textSecondary }]}>
            You can reschedule your appointment for once!
          </Text>
        </View>
      </>
    );
  };

  return (
    <Modal visible={visible} animationType='slide' presentationStyle='fullScreen' onRequestClose={handleBack}>
      <SafeAreaView
        style={[styles.safe, { backgroundColor: theme.background }]}
        edges={['top', 'bottom']}>
        <View style={styles.flex}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps='handled'>
            <FlowHeader
              title={step === 'reason' ? 'Reschedule Appointments' : 'Select Date Time'}
              onBack={handleBack}
            />

            {step === 'reason' ? renderReasonStep() : renderDateTimeStep()}
          </ScrollView>

          <View style={[styles.footer, { backgroundColor: theme.background }]}>
            <PrimaryCtaButton
              label={
                step === 'reason'
                  ? 'Next'
                  : submitting
                    ? 'Confirming…'
                    : 'Confirm'
              }
              onPress={
                step === 'reason'
                  ? handleNext
                  : submitting
                    ? undefined
                    : handleConfirm
              }
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    minHeight: 48,
  },
  headerSide: {
    width: 40,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionTitleCompact: {
    marginBottom: 0,
  },
  reasonList: {
    gap: 4,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  radioLabel: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
  },
  otherInput: {
    minHeight: 96,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginLeft: 34,
    marginBottom: 8,
  },
  doctorCard: {
    flexDirection: 'row',
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
  },
  doctorAvatar: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  doctorInfo: {
    flex: 1,
    minWidth: 0,
  },
  doctorName: {
    fontSize: 16,
  },
  doctorMeta: {
    fontSize: 14,
    marginTop: 2,
  },
  doctorQual: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  monthPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  monthLabel: {
    fontSize: 14,
    minWidth: 110,
    textAlign: 'center',
  },
  dateRow: {
    gap: 10,
    paddingBottom: 4,
  },
  dateChip: {
    width: 56,
    height: 72,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateChipDay: {
    fontSize: 13,
    marginBottom: 6,
  },
  dateChipNum: {
    fontSize: 18,
  },
  timeSectionTitle: {
    marginTop: 24,
    marginBottom: 14,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeChip: {
    width: '31%',
    minWidth: 100,
    flexGrow: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeChipText: {
    fontSize: 14,
  },
  warningCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    padding: 14,
    marginTop: 24,
  },
  warningTitle: {
    color: '#D97706',
    fontSize: 14,
    marginBottom: 4,
  },
  warningBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  statusBlock: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  helperText: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
});
