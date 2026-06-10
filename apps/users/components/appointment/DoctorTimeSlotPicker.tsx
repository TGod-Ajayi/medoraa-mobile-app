import { Ionicons } from '@expo/vector-icons';
import { useDoctorAvailableTimeSlots } from '@repo/ui/graphql';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  MONTH_NAMES,
  formatTimeLabel,
  getDateKey,
} from './appointment-scheduling';
import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

type Props = {
  doctorId: string;
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string | null) => void;
};

export function DoctorTimeSlotPicker({
  doctorId,
  selectedSlotId,
  onSelectSlot,
}: Props) {
  const theme = useTheme();
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const { slots, loading, error } = useDoctorAvailableTimeSlots({ doctorId });

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
      .filter((dateKey) => {
        const date = new Date(`${dateKey}T12:00:00`);
        return date.getMonth() === viewMonth && date.getFullYear() === viewYear;
      })
      .sort();
  }, [slotsByDate, viewMonth, viewYear]);

  const timeSlotsForSelectedDate = useMemo(() => {
    if (!selectedDateKey) return [];
    return (slotsByDate.get(selectedDateKey) ?? []).sort(
      (a, b) =>
        new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime(),
    );
  }, [selectedDateKey, slotsByDate]);

  useEffect(() => {
    if (loading || datesInViewMonth.length === 0) return;
    if (selectedDateKey && datesInViewMonth.includes(selectedDateKey)) return;
    setSelectedDateKey(datesInViewMonth[0]);
  }, [datesInViewMonth, loading, selectedDateKey]);

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewMonth(next.getMonth());
    setViewYear(next.getFullYear());
    setSelectedDateKey(null);
  };

  return (
    <View>
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
          <Pressable
            onPress={() => shiftMonth(-1)}
            hitSlop={8}
            accessibilityLabel='Previous month'>
            <Ionicons name='chevron-back' size={18} color={theme.textSecondary} />
          </Pressable>
          <Text
            style={[
              styles.monthLabel,
              { color: theme.textPrimary, fontFamily: fonts.medium },
            ]}>
            {MONTH_NAMES[viewMonth]} {viewYear}
          </Text>
          <Pressable
            onPress={() => shiftMonth(1)}
            hitSlop={8}
            accessibilityLabel='Next month'>
            <Ionicons name='chevron-forward' size={18} color={theme.textSecondary} />
          </Pressable>
        </View>
      </View>

      {loading ? (
        <View style={styles.statusBlock}>
          <ActivityIndicator size='small' color={theme.accent} />
        </View>
      ) : error ? (
        <Text style={[styles.helperText, { color: theme.textSecondary }]}>
          Unable to load available slots right now. Pull to refresh or try again later.
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
                  onSelectSlot(null);
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
                onPress={() => onSelectSlot(slot.id)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionTitleCompact: {
    marginBottom: 0,
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
  statusBlock: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  helperText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
