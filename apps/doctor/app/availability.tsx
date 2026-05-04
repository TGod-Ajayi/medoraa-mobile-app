import { fonts } from '@/config/fonts';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

type Day = (typeof DAYS)[number];
type TimeSlot = {
  id: string;
  from: string;
  to: string;
};

const DEFAULT_SLOTS: TimeSlot[] = [
  { id: 'slot-1', from: '8:00 AM', to: '12:00 PM' },
  { id: 'slot-2', from: '2:00PM', to: '5:30 PM' },
];

export default function AvailabilityScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [enabledByDay, setEnabledByDay] = useState<Record<Day, boolean>>({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });
  const [slotsByDay, setSlotsByDay] = useState<Record<Day, TimeSlot[]>>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  const toggleDay = (day: Day) => {
    setEnabledByDay((prev) => {
      const nextEnabled = !prev[day];
      if (nextEnabled) {
        setSlotsByDay((curr) => ({
          ...curr,
          [day]: curr[day].length > 0 ? curr[day] : DEFAULT_SLOTS,
        }));
      }
      return { ...prev, [day]: nextEnabled };
    });
  };

  const removeSlot = (day: Day, slotId: string) => {
    setSlotsByDay((prev) => ({
      ...prev,
      [day]: prev[day].filter((slot) => slot.id !== slotId),
    }));
  };

  const addSlot = (day: Day) => {
    setSlotsByDay((prev) => ({
      ...prev,
      [day]: [
        ...prev[day],
        {
          id: `slot-${Date.now()}-${prev[day].length}`,
          from: '9:00 AM',
          to: '1:00 PM',
        },
      ],
    }));
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.card }]}>
          <Ionicons name="chevron-back" size={22} color="#667085" />
        </Pressable>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Availability</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Text style={[styles.subtitle, { color: theme.textPrimary }]}>
        Add hours of your availability
      </Text>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {DAYS.map((day) => {
          const enabled = enabledByDay[day];
          return (
            <View key={day} style={styles.dayBlock}>
              <View style={[styles.dayRow, { backgroundColor: theme.card }]}>
                <Text style={[styles.dayLabel, { color: theme.textPrimary }]}>{day}</Text>
                <Pressable
                  onPress={() => toggleDay(day)}
                  style={[styles.toggleTrack, enabled && styles.toggleTrackOn]}
                  accessibilityRole="switch"
                  accessibilityState={{ checked: enabled }}>
                  <View style={[styles.toggleThumb, enabled && styles.toggleThumbOn]} />
                </Pressable>
              </View>

              {enabled ? (
                <View style={[styles.hoursPanel, { backgroundColor: theme.card }]}>
                  {slotsByDay[day].map((slot) => (
                    <View key={slot.id} style={styles.slotWrap}>
                      <View style={styles.slotFieldsRow}>
                        <View style={styles.timeFieldCol}>
                          <Text style={styles.timeLabel}>From</Text>
                          <Pressable style={styles.timeField}>
                            <Text style={styles.timeValue}>{slot.from}</Text>
                          </Pressable>
                        </View>
                        <View style={styles.timeFieldCol}>
                          <Text style={styles.timeLabel}>To</Text>
                          <Pressable style={styles.timeField}>
                            <Text style={styles.timeValue}>{slot.to}</Text>
                          </Pressable>
                        </View>
                        <Pressable
                          onPress={() => removeSlot(day, slot.id)}
                          style={styles.removeSlotBtn}
                          accessibilityRole="button"
                          accessibilityLabel="Remove time slot">
                          <Ionicons name="close" size={24} color="#64748B" />
                        </Pressable>
                      </View>
                    </View>
                  ))}

                  <Pressable
                    onPress={() => addSlot(day)}
                    style={styles.addHoursBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Add hours">
                    <Text style={styles.addHoursText}>Add Hours</Text>
                  </Pressable>
                </View>
              ) : null}
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
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: fonts.semiBold,
  },
  headerSpacer: {
    width: 40,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: fonts.semiBold,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 10,
  },
  dayBlock: {
    gap: 8,
  },
  dayRow: {
    minHeight: 76,
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayLabel: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: fonts.medium,
  },
  toggleTrack: {
    width: 74,
    height: 42,
    borderRadius: 21,
    borderWidth: 3,
    borderColor: '#475467',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleTrackOn: {
    borderColor: '#20BEB8',
  },
  toggleThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#475467',
  },
  toggleThumbOn: {
    backgroundColor: '#20BEB8',
    alignSelf: 'flex-end',
  },
  hoursPanel: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 10,
  },
  slotWrap: {
    gap: 8,
  },
  slotFieldsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  timeFieldCol: {
    flex: 1,
    gap: 6,
  },
  timeLabel: {
    color: '#475467',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.semiBold,
  },
  timeField: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#C3CEDB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  timeValue: {
    color: '#1E293B',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.medium,
  },
  removeSlotBtn: {
    width: 38,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addHoursBtn: {
    minHeight: 50,
    borderWidth: 1.5,
    borderColor: '#20BEB8',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  addHoursText: {
    color: '#20BEB8',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.semiBold,
  },
});
