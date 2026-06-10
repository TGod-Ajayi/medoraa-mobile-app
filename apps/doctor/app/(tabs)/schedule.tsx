import { Button } from '@/components';
import { fonts } from '@/config/fonts';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Hooks } from '@repo/ui/graphql';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from 'react-native-wheel-pick';

const SCREEN_W = Dimensions.get('window').width;
const PAGE_WIDTH = SCREEN_W - 32;
const WEEKS_RADIUS = 26;
const WEEK_COUNT = WEEKS_RADIUS * 2 + 1;
const WEEK_INDEXES = Array.from({ length: WEEK_COUNT }, (_, i) => i);

function stripTime(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Week starts Sunday (matches S M T W T F S strip). */
function startOfWeekSunday(date: Date): Date {
  const d = stripTime(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return stripTime(d);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatMonthYearForWeek(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6);
  const y1 = weekStart.getFullYear();
  const y2 = weekEnd.getFullYear();
  const m1 = weekStart.toLocaleString('default', { month: 'long' });
  const m2 = weekEnd.toLocaleString('default', { month: 'long' });
  if (m1 === m2 && y1 === y2) return `${m1} ${y1}`;
  return `${m1} – ${m2} ${y2}`;
}

const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

const ACCENT = '#20BEB8';
const MUTED_LETTER = '#D0D5DD';

type DayCellProps = {
  selected: boolean;
  letter: string;
  dayNum: string;
  themeTextPrimary: string;
  onSelect: () => void;
};

function DayCell({
  selected,
  letter,
  dayNum,
  themeTextPrimary,
  onSelect,
}: DayCellProps) {
  const selectProgress = useSharedValue(selected ? 1 : 0);
  const scale = useSharedValue(1);

  useEffect(() => {
    selectProgress.value = withSpring(selected ? 1 : 0, {
      damping: 17,
      stiffness: 200,
      mass: 0.75,
    });
    if (selected) {
      scale.value = withSequence(
        withSpring(1.07, { damping: 11, stiffness: 420 }),
        withSpring(1, { damping: 14, stiffness: 280 })
      );
    } else {
      scale.value = withSpring(1, { damping: 16, stiffness: 260 });
    }
  }, [selected]);

  const wrapStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      selectProgress.value,
      [0, 1],
      ['rgba(32,190,184,0)', ACCENT]
    ),
  }));

  const weekLetterStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      selectProgress.value,
      [0, 1],
      [MUTED_LETTER, '#FFFFFF']
    ),
  }));

  const dayNumStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      selectProgress.value,
      [0, 1],
      [themeTextPrimary, '#FFFFFF']
    ),
  }));

  return (
    <Pressable
      onPress={onSelect}
      onPressIn={() => {
        scale.value = withSpring(0.94, { damping: 14, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 13, stiffness: 320 });
      }}>
      <Animated.View style={[styles.dayCell, wrapStyle]}>
        <Animated.View
          pointerEvents='none'
          style={[StyleSheet.absoluteFillObject, styles.dayCellFill, fillStyle]}
        />
        <Animated.Text style={[styles.weekText, weekLetterStyle]}>
          {letter}
        </Animated.Text>
        <Animated.Text style={[styles.dayText, dayNumStyle]}>
          {dayNum}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

type FilterTab = 'all' | 'upcoming' | 'pending';
type Status = 'Upcoming' | 'Pending';
type TagTone = 'blue' | 'orange' | 'green';

type Appointment = {
  id: string;
  patient: string;
  time: string;
  tag: string;
  tagTone: TagTone;
  condition: string;
  status: Status;
  description?: string;
  documentName?: string;
  documentSize?: string;
};

const APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    patient: 'Alice Smith',
    time: '09:15 AM',
    tag: 'Follow-up',
    tagTone: 'blue',
    condition: 'Hypertension',
    status: 'Upcoming',
    description:
      "I've been feeling dizzy lately and my blood pressure has been inconsistent even with medication.",
    documentName: 'Lab-Results.pdf',
    documentSize: '3MB',
  },
  {
    id: 'a2',
    patient: 'John Doe',
    time: '10:30 AM',
    tag: 'Video consultation',
    tagTone: 'orange',
    condition: 'Frequent migranes',
    status: 'Upcoming',
    description:
      "I'm having very bad migraines from past few days. It's now killing. I'm willing to get some dietary recommendation along with medicines.",
    documentName: 'Prescription.docx',
    documentSize: '5MB',
  },
  {
    id: 'a3',
    patient: 'Jane Doe',
    time: '10:30 AM',
    tag: 'New patient',
    tagTone: 'green',
    condition: 'Dysentery',
    status: 'Pending',
    description:
      'Experiencing abdominal discomfort and stool frequency issues for 3 days. Need urgent evaluation.',
    documentName: 'Referral-Letter.pdf',
    documentSize: '2MB',
  },
];

type AddSheetMode = 'menu' | 'availability';

const AVAILABILITY_DAY_OPTIONS = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
] as const;

const TIME_24H_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const HOUR_12_PICKER_DATA = Array.from({ length: 12 }, (_, i) => {
  const value = String(i + 1).padStart(2, '0');
  return { value, label: String(i + 1) };
});

const MINUTE_PICKER_DATA = Array.from({ length: 60 }, (_, i) => {
  const value = String(i).padStart(2, '0');
  return { value, label: value };
});

const PERIOD_PICKER_DATA = [
  { value: 'AM', label: 'AM' },
  { value: 'PM', label: 'PM' },
] as const;

function getDeviceTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

function parseTime24(time24: string): {
  hour: string;
  minute: string;
  period: string;
} {
  const match = time24.match(/^(\d{2}):(\d{2})$/);
  if (!match) {
    return { hour: '09', minute: '00', period: 'AM' };
  }
  const hours24 = Number(match[1]);
  const minute = match[2];
  const period = hours24 >= 12 ? 'PM' : 'AM';
  let hour12 = hours24 % 12;
  if (hour12 === 0) hour12 = 12;
  return {
    hour: String(hour12).padStart(2, '0'),
    minute,
    period,
  };
}

function toTime24(hour12: string, minute: string, period: string): string {
  let h = Number(hour12);
  if (period === 'AM') {
    if (h === 12) h = 0;
  } else if (h !== 12) {
    h += 12;
  }
  return `${String(h).padStart(2, '0')}:${minute}`;
}

function formatTimeLabel(time24: string): string {
  const { hour, minute, period } = parseTime24(time24);
  return `${Number(hour)}:${minute} ${period}`;
}

type TimeWheelPickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  accent: string;
  textColor: string;
  labelColor: string;
  cardColor: string;
};

const WHEEL_HEIGHT = 168;
const ITEM_HEIGHT = 48;

function TimeWheelPicker({
  label,
  value,
  onChange,
  accent,
  textColor,
  labelColor,
  cardColor,
}: TimeWheelPickerProps) {
  const { hour, minute, period } = parseTime24(value);
  const preview = formatTimeLabel(value);

  return (
    <View style={styles.timePickerBlock}>
      {/* Header row: label + preview badge */}
      <View style={styles.timePickerHeader}>
        <Text style={[styles.timePickerLabel, { color: labelColor }]}>
          {label}
        </Text>
        <View
          style={[styles.timePickerBadge, { backgroundColor: `${accent}18` }]}>
          <Text style={[styles.timePickerBadgeText, { color: accent }]}>
            {preview}
          </Text>
        </View>
      </View>

      {/* Wheel container */}
      <View style={[styles.timeWheelCard, { backgroundColor: cardColor }]}>
        {/* Column headers */}
        <View style={styles.timeWheelColumnHeaders}>
          <Text
            style={[styles.timeWheelColHeader, { color: labelColor, flex: 1 }]}>
            Hour
          </Text>
          <Text
            style={[styles.timeWheelColHeader, { color: labelColor, flex: 1 }]}>
            Min
          </Text>
          <Text
            style={[
              styles.timeWheelColHeader,
              { color: labelColor, width: 64, flex: 0 },
            ]}>
            AM/PM
          </Text>
        </View>

        {/* Wheels */}
        <View style={styles.timeWheelRow}>
          <Picker
            style={[styles.timeWheel, { height: WHEEL_HEIGHT }]}
            pickerData={HOUR_12_PICKER_DATA}
            selectedValue={hour}
            onValueChange={(nextHour: string) => {
              onChange(toTime24(nextHour, minute, period));
            }}
            textColor={textColor}
            textSize={22}
            selectTextColor={accent}
            selectBackgroundColor={`${accent}18`}
          />

          {/* Colon separator */}
          <Text style={[styles.timeWheelColon, { color: accent }]}>:</Text>

          <Picker
            style={[styles.timeWheel, { height: WHEEL_HEIGHT }]}
            pickerData={MINUTE_PICKER_DATA}
            selectedValue={minute}
            onValueChange={(nextMinute: string) => {
              onChange(toTime24(hour, nextMinute, period));
            }}
            textColor={textColor}
            textSize={22}
            selectTextColor={accent}
            selectBackgroundColor={`${accent}18`}
          />

          {/* Divider */}
          <View
            style={[
              styles.timeWheelDivider,
              { backgroundColor: `${labelColor}25` },
            ]}
          />

          <Picker
            style={[styles.timeWheelPeriod, { height: WHEEL_HEIGHT }]}
            pickerData={[...PERIOD_PICKER_DATA]}
            selectedValue={period}
            onValueChange={(nextPeriod: string) => {
              onChange(toTime24(hour, minute, nextPeriod));
            }}
            textColor={textColor}
            textSize={18}
            selectTextColor={accent}
            selectBackgroundColor={`${accent}18`}
          />
        </View>

        {/* Selection highlight lines */}
        <View
          pointerEvents='none'
          style={[
            styles.timeWheelSelectionHighlight,
            {
              top: (WHEEL_HEIGHT - ITEM_HEIGHT) / 2,
              height: ITEM_HEIGHT,
              borderColor: `${accent}40`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const ADD_SHEET_ACTIONS = [
  {
    id: 'availability',
    label: 'Set availability',
    subtitle: 'Manage your weekly hours',
    icon: 'calendar-outline' as const,
  },
  {
    id: 'block-time',
    label: 'Block time off',
    subtitle: 'Mark unavailable slots',
    icon: 'time-outline' as const,
  },
  {
    id: 'appointment',
    label: 'Add appointment',
    subtitle: 'Schedule a new visit',
    icon: 'person-add-outline' as const,
  },
] as const;

export default function ScheduleScreen() {
  const theme = useTheme();
  const detailsSheetRef = useRef<BottomSheet>(null);
  const addSheetRef = useRef<BottomSheet>(null);
  const detailsSnapPoints = useMemo(() => ['72%'], []);
  const [addSheetMode, setAddSheetMode] = useState<AddSheetMode>('menu');
  const addSnapPoints = useMemo(
    () => (addSheetMode === 'menu' ? ['42%'] : ['85%']),
    [addSheetMode]
  );
  const [availabilityDay, setAvailabilityDay] = useState(1);
  const [availabilityStart, setAvailabilityStart] = useState('09:00');
  const [availabilityEnd, setAvailabilityEnd] = useState('17:00');
  const [availabilityTimezone] = useState(getDeviceTimezone);
  const [createDoctorAvailability, { loading: creatingAvailability }] =
    Hooks.useCreateDoctorAvailabilityMutation();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const today = useMemo(() => stripTime(new Date()), []);
  const todayWeekStart = useMemo(() => startOfWeekSunday(today), [today]);

  const [selectedDate, setSelectedDate] = useState<Date>(() => today);
  const [weekListIndex, setWeekListIndex] = useState(WEEKS_RADIUS);
  const weekListRef = useRef<FlatList<number>>(null);

  const visibleWeekStart = useMemo(
    () => addDays(todayWeekStart, (weekListIndex - WEEKS_RADIUS) * 7),
    [todayWeekStart, weekListIndex]
  );

  const monthLabel = useMemo(
    () => formatMonthYearForWeek(visibleWeekStart),
    [visibleWeekStart]
  );

  /** When the visible week changes (swipe or chevron), keep the same weekday in the new week. */
  useEffect(() => {
    setSelectedDate((prev) => {
      const dow = prev.getDay();
      return addDays(visibleWeekStart, dow);
    });
  }, [visibleWeekStart]);

  const scrollToWeekIndex = useCallback((index: number, animated: boolean) => {
    const clamped = Math.max(0, Math.min(WEEK_COUNT - 1, index));
    weekListRef.current?.scrollToIndex({
      index: clamped,
      animated,
      viewPosition: 0,
    });
    setWeekListIndex(clamped);
  }, []);

  const onWeekScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const next = Math.round(x / PAGE_WIDTH);
      const clamped = Math.max(0, Math.min(WEEK_COUNT - 1, next));
      setWeekListIndex(clamped);
    },
    []
  );

  const renderWeekPage = useCallback(
    ({ index }: { index: number }) => {
      const weekStart = addDays(todayWeekStart, (index - WEEKS_RADIUS) * 7);
      return (
        <View style={[styles.weekPage, { width: PAGE_WIDTH }]}>
          {Array.from({ length: 7 }, (_, i) => {
            const dayDate = addDays(weekStart, i);
            const selected = isSameDay(dayDate, selectedDate);
            const letter = WEEKDAY_LETTERS[dayDate.getDay()];
            return (
              <DayCell
                key={dayDate.toISOString()}
                selected={selected}
                letter={letter}
                dayNum={String(dayDate.getDate())}
                themeTextPrimary={theme.textPrimary}
                onSelect={() => setSelectedDate(dayDate)}
              />
            );
          })}
        </View>
      );
    },
    [selectedDate, theme.textPrimary, todayWeekStart]
  );

  const visibleAppointments = useMemo(() => {
    if (activeFilter === 'all') return APPOINTMENTS;
    if (activeFilter === 'upcoming') {
      return APPOINTMENTS.filter((item) => item.status === 'Upcoming');
    }
    return APPOINTMENTS.filter((item) => item.status === 'Pending');
  }, [activeFilter]);

  const allCount = APPOINTMENTS.length;

  const tagToneStyles: Record<TagTone, { bg: string; text: string }> = {
    blue: { bg: '#E8F4FF', text: '#2A8DFF' },
    orange: { bg: '#FFF4E7', text: '#D38B27' },
    green: { bg: '#EBFAEE', text: '#61C074' },
  };

  const openAppointmentDetails = useCallback((item: Appointment) => {
    setSelectedAppointment(item);
    detailsSheetRef.current?.snapToIndex(0);
  }, []);

  const closeAppointmentDetails = useCallback(() => {
    detailsSheetRef.current?.close();
  }, []);

  const resetAvailabilityForm = useCallback((dayOfWeek: number) => {
    setAvailabilityDay(dayOfWeek);
    setAvailabilityStart('09:00');
    setAvailabilityEnd('17:00');
  }, []);

  const closeAddSheet = useCallback(() => {
    addSheetRef.current?.close();
  }, []);

  const openAvailabilityForm = useCallback(() => {
    resetAvailabilityForm(selectedDate.getDay());
    setAddSheetMode('availability');
    requestAnimationFrame(() => {
      addSheetRef.current?.snapToIndex(0);
    });
  }, [resetAvailabilityForm, selectedDate]);

  const backToAddMenu = useCallback(() => {
    setAddSheetMode('menu');
    requestAnimationFrame(() => {
      addSheetRef.current?.snapToIndex(0);
    });
  }, []);

  const onAddSheetChange = useCallback((index: number) => {
    if (index === -1) {
      setAddSheetMode('menu');
    }
  }, []);

  const onAddSheetAction = useCallback(
    (actionId: (typeof ADD_SHEET_ACTIONS)[number]['id']) => {
      if (actionId === 'availability') {
        openAvailabilityForm();
        return;
      }
      closeAddSheet();
    },
    [closeAddSheet, openAvailabilityForm]
  );

  const submitAvailability = useCallback(async () => {
    const startTime = availabilityStart.trim();
    const endTime = availabilityEnd.trim();

    if (!TIME_24H_PATTERN.test(startTime) || !TIME_24H_PATTERN.test(endTime)) {
      showMessage({
        message: 'Invalid time',
        description: 'Use 24-hour format, e.g. 09:00 or 17:30.',
        type: 'warning',
      });
      return;
    }

    if (startTime >= endTime) {
      showMessage({
        message: 'Invalid range',
        description: 'End time must be after start time.',
        type: 'warning',
      });
      return;
    }

    try {
      await createDoctorAvailability({
        variables: {
          createDoctorAvailabilityInput: {
            dayOfWeek: availabilityDay,
            startTime,
            endTime,
            timezone: availabilityTimezone,
          },
        },
      });
      showMessage({
        message: 'Availability saved',
        description: 'Your weekly hours have been updated.',
        type: 'success',
      });
      closeAddSheet();
      setAddSheetMode('menu');
    } catch {
      showMessage({
        message: 'Could not save availability',
        description: 'Please try again in a moment.',
        type: 'danger',
      });
    }
  }, [
    availabilityDay,
    availabilityEnd,
    availabilityStart,
    availabilityTimezone,
    closeAddSheet,
    createDoctorAvailability,
  ]);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior='close'
      />
    ),
    []
  );

  return (
    <>
      <SafeAreaView
        style={[styles.safe, { backgroundColor: theme.background }]}
        edges={['top', 'left', 'right']}>
        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Schedule
          </Text>

          <View style={styles.monthRow}>
            <Pressable
              style={[styles.arrowBtn, { backgroundColor: theme.card }]}
              onPress={() => scrollToWeekIndex(weekListIndex - 1, true)}>
              <Ionicons
                name='chevron-back'
                size={22}
                color={theme.textSecondary}
              />
            </Pressable>
            <Text style={[styles.monthLabel, { color: '#667085' }]}>
              {monthLabel}
            </Text>
            <Pressable
              style={[styles.arrowBtn, { backgroundColor: theme.card }]}
              onPress={() => scrollToWeekIndex(weekListIndex + 1, true)}>
              <Ionicons
                name='chevron-forward'
                size={22}
                color={theme.textSecondary}
              />
            </Pressable>
          </View>

          <FlatList
            ref={weekListRef}
            data={WEEK_INDEXES}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => String(item)}
            renderItem={renderWeekPage}
            getItemLayout={(_, index) => ({
              length: PAGE_WIDTH,
              offset: PAGE_WIDTH * index,
              index,
            })}
            initialScrollIndex={WEEKS_RADIUS}
            onMomentumScrollEnd={onWeekScrollEnd}
            extraData={selectedDate}
            style={styles.weekList}
            contentContainerStyle={styles.weekListContent}
          />

          <View style={styles.filters}>
            <Pressable
              onPress={() => setActiveFilter('all')}
              style={styles.filterBtn}>
              <View style={styles.filterRow}>
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: activeFilter === 'all' ? theme.accent : '#98A2B3',
                    },
                  ]}>
                  All
                </Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{allCount}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.filterUnderline,
                  {
                    backgroundColor:
                      activeFilter === 'all' ? theme.accent : 'transparent',
                  },
                ]}
              />
            </Pressable>

            <Pressable
              onPress={() => setActiveFilter('upcoming')}
              style={styles.filterBtn}>
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      activeFilter === 'upcoming' ? theme.accent : '#98A2B3',
                  },
                ]}>
                Upcoming
              </Text>
              <View
                style={[
                  styles.filterUnderline,
                  {
                    backgroundColor:
                      activeFilter === 'upcoming'
                        ? theme.accent
                        : 'transparent',
                  },
                ]}
              />
            </Pressable>

            <Pressable
              onPress={() => setActiveFilter('pending')}
              style={styles.filterBtn}>
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      activeFilter === 'pending' ? theme.accent : '#98A2B3',
                  },
                ]}>
                Pending
              </Text>
              <View
                style={[
                  styles.filterUnderline,
                  {
                    backgroundColor:
                      activeFilter === 'pending' ? theme.accent : 'transparent',
                  },
                ]}
              />
            </Pressable>
          </View>

          <View style={styles.cardsWrap}>
            {visibleAppointments.map((item) => (
              <View
                key={item.id}
                style={[styles.card, { backgroundColor: theme.card }]}>
                <View style={styles.cardHeader}>
                  <Text
                    style={[styles.patientName, { color: theme.textPrimary }]}>
                    {item.patient}
                  </Text>
                  <View
                    style={[
                      styles.statusPill,
                      item.status === 'Pending'
                        ? styles.pendingPill
                        : styles.upcomingPill,
                    ]}>
                    <Text
                      style={[
                        styles.statusPillText,
                        item.status === 'Pending'
                          ? styles.pendingPillText
                          : styles.upcomingPillText,
                      ]}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <Text style={[styles.timeText, { color: '#667085' }]}>
                    {item.time}
                  </Text>
                  <View
                    style={[
                      styles.tagPill,
                      { backgroundColor: tagToneStyles[item.tagTone].bg },
                    ]}>
                    <Text
                      style={[
                        styles.tagText,
                        { color: tagToneStyles[item.tagTone].text },
                      ]}>
                      {item.tag}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.conditionText, { color: '#98A2B3' }]}>
                  {item.condition}
                </Text>

                <Pressable
                  onPress={() => openAppointmentDetails(item)}
                  style={[styles.detailsBtn, { borderColor: theme.accent }]}>
                  <Text
                    style={[styles.detailsBtnText, { color: theme.accent }]}>
                    View Details
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomSheet
        ref={addSheetRef}
        index={-1}
        snapPoints={addSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetHandle}
        onChange={onAddSheetChange}>
        {addSheetMode === 'menu' ? (
          <BottomSheetView style={styles.addSheetContent}>
            <Text style={[styles.addSheetTitle, { color: theme.textPrimary }]}>
              Add to schedule
            </Text>
            {ADD_SHEET_ACTIONS.map((action) => (
              <Pressable
                key={action.id}
                onPress={() => onAddSheetAction(action.id)}
                style={[styles.addSheetRow, { backgroundColor: theme.card }]}>
                <View
                  style={[
                    styles.addSheetIconWrap,
                    { backgroundColor: `${theme.accent}22` },
                  ]}>
                  <Ionicons name={action.icon} size={22} color={theme.accent} />
                </View>
                <View style={styles.addSheetRowText}>
                  <Text
                    style={[
                      styles.addSheetRowLabel,
                      { color: theme.textPrimary },
                    ]}>
                    {action.label}
                  </Text>
                  <Text
                    style={[
                      styles.addSheetRowSub,
                      { color: theme.textSecondary },
                    ]}>
                    {action.subtitle}
                  </Text>
                </View>
                <Ionicons
                  name='chevron-forward'
                  size={20}
                  color={theme.textMuted}
                />
              </Pressable>
            ))}
          </BottomSheetView>
        ) : (
          <BottomSheetScrollView
            contentContainerStyle={styles.availabilitySheetContent}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}>
            <View style={styles.availabilityHeader}>
              <Pressable
                onPress={backToAddMenu}
                style={[
                  styles.availabilityBackBtn,
                  { backgroundColor: theme.card },
                ]}
                accessibilityRole='button'
                accessibilityLabel='Back'>
                <Ionicons
                  name='chevron-back'
                  size={22}
                  color={theme.textSecondary}
                />
              </Pressable>
              <Text
                style={[styles.addSheetTitle, { color: theme.textPrimary }]}>
                Set availability
              </Text>
              <View style={styles.availabilityHeaderSpacer} />
            </View>

            <Text
              style={[
                styles.availabilitySectionLabel,
                { color: theme.textSecondary },
              ]}>
              Day of week
            </Text>
            <View style={styles.dayChipRow}>
              {AVAILABILITY_DAY_OPTIONS.map((day) => {
                const selected = availabilityDay === day.value;
                return (
                  <Pressable
                    key={day.value}
                    onPress={() => setAvailabilityDay(day.value)}
                    style={[
                      styles.dayChip,
                      {
                        backgroundColor: selected ? theme.accent : theme.card,
                        borderColor: selected ? theme.accent : '#D0D5DD',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.dayChipText,
                        { color: selected ? '#FFFFFF' : theme.textPrimary },
                      ]}>
                      {day.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <TimeWheelPicker
              label='Start time'
              value={availabilityStart}
              onChange={setAvailabilityStart}
              accent={theme.accent}
              textColor={theme.textPrimary}
              labelColor={theme.textSecondary}
              cardColor={theme.card}
            />
            <TimeWheelPicker
              label='End time'
              value={availabilityEnd}
              onChange={setAvailabilityEnd}
              accent={theme.accent}
              textColor={theme.textPrimary}
              labelColor={theme.textSecondary}
              cardColor={theme.card}
            />

            <Text
              style={[
                styles.availabilitySectionLabel,
                { color: theme.textSecondary },
              ]}>
              Timezone
            </Text>
            <View
              style={[
                styles.timezoneField,
                { backgroundColor: theme.card, borderColor: '#C3CEDB' },
              ]}>
              <Ionicons
                name='globe-outline'
                size={18}
                color={theme.textMuted}
              />
              <Text style={[styles.timezoneText, { color: theme.textPrimary }]}>
                {availabilityTimezone}
              </Text>
            </View>

            <Button
              theme={theme}
              label={creatingAvailability ? 'Saving…' : 'Save availability'}
              onPress={submitAvailability}
              disabled={creatingAvailability}
              style={styles.saveAvailabilityBtn}
              leftIcon={
                creatingAvailability ? (
                  <ActivityIndicator size='small' color='#FFFFFF' />
                ) : undefined
              }
            />
          </BottomSheetScrollView>
        )}
      </BottomSheet>

      <BottomSheet
        ref={detailsSheetRef}
        index={-1}
        snapPoints={detailsSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetHandle}
        onClose={() => setSelectedAppointment(null)}>
        <ScrollView
          style={styles.sheetScroll}
          contentContainerStyle={styles.sheetContent}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.sheetTitle}>Appointment Details</Text>

          <View style={styles.sheetPatientRow}>
            <View style={styles.sheetAvatar}>
              <Ionicons name='person' size={18} color='#64748B' />
            </View>
            <View style={styles.sheetPatientInfo}>
              <Text style={styles.sheetPatientName}>
                {selectedAppointment?.patient ?? 'Patient'}
              </Text>
              <Text style={styles.sheetConditionText}>
                {selectedAppointment?.condition ?? 'Condition'}
              </Text>
              <View style={styles.sheetPendingPill}>
                <Text style={styles.sheetPendingPillText}>
                  {selectedAppointment?.status ?? 'Pending'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.sheetDateRow}>
            <View style={styles.sheetDateTimeCell}>
              <Ionicons name='calendar-outline' size={16} color='#1492FF' />
              <Text style={styles.sheetDateTimeText}>Monday Dec 2</Text>
            </View>
            <View style={styles.sheetDateTimeCell}>
              <Ionicons name='time-outline' size={16} color='#22C55E' />
              <Text style={styles.sheetDateTimeText}>
                {selectedAppointment?.time ?? '10:30 AM'}
              </Text>
            </View>
          </View>

          <Text style={styles.sheetSectionTitle}>Description</Text>
          <Text style={styles.sheetDescription}>
            {selectedAppointment?.description ?? 'No description provided.'}
          </Text>

          <Text style={styles.sheetSectionTitle}>Documents</Text>
          <View style={styles.sheetDocumentCard}>
            <Ionicons name='document-text-outline' size={30} color='#94A3B8' />
            <View>
              <Text style={styles.sheetDocumentName}>
                {selectedAppointment?.documentName ?? 'Document.pdf'}
              </Text>
              <Text style={styles.sheetDocumentMeta}>
                {selectedAppointment?.documentSize ?? '5MB'}
              </Text>
            </View>
          </View>

          <Pressable style={styles.acceptBtn}>
            <Text style={styles.acceptBtnText}>Accept Appointment</Text>
          </Pressable>
          <Pressable
            onPress={closeAppointmentDetails}
            style={styles.declineBtn}>
            <Text style={styles.declineBtnText}>Decline Appointment</Text>
          </Pressable>
        </ScrollView>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screen: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  addSheetContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
    gap: 10,
  },
  addSheetTitle: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
    marginBottom: 8,
  },
  addSheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  addSheetIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSheetRowText: {
    flex: 1,
    gap: 2,
  },
  addSheetRowLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.semiBold,
  },
  addSheetRowSub: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.regular,
  },
  availabilitySheetContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  availabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  availabilityBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availabilityHeaderSpacer: {
    width: 40,
  },
  availabilitySectionLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.medium,
    marginBottom: 8,
  },
  dayChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  dayChip: {
    minWidth: 44,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  dayChipText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.semiBold,
  },
  timePickerBlock: {
    marginBottom: 16,
  },
  timePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timePickerLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.medium,
  },
  timePickerBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  timePickerBadgeText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.semiBold,
  },
  timeWheelCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C3CEDB',
    overflow: 'hidden',
  },
  timeWheelColumnHeaders: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 4,
  },
  timeWheelColHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts.medium,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  timeWheelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  timeWheel: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  timeWheelColon: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: fonts.semiBold,
    marginHorizontal: 2,
    marginBottom: 2,
  },
  timeWheelDivider: {
    width: 1,
    height: 80,
    marginHorizontal: 4,
  },
  timeWheelPeriod: {
    width: 64,
    backgroundColor: 'transparent',
  },
  timeWheelSelectionHighlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
  },
  timezoneField: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  timezoneText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.medium,
  },
  saveAvailabilityBtn: {
    borderRadius: 24,
    minHeight: 48,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
    fontFamily: fonts.semiBold,
    marginTop: 6,
    marginBottom: 18,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  arrowBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontSize: 16,
    lineHeight: 30,
    fontFamily: fonts.semiBold,
  },
  weekList: {
    width: PAGE_WIDTH,
    alignSelf: 'center',
    marginBottom: 18,
  },
  weekListContent: {},
  weekPage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: 48,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    overflow: 'hidden',
  },
  dayCellFill: {},
  weekText: {
    fontSize: 12,
    paddingTop: 6,
    lineHeight: 18,
    fontFamily: fonts.medium,
  },
  dayText: {
    fontSize: 16,
    lineHeight: 40,
    fontFamily: fonts.semiBold,
    fontWeight: '500',
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D0D5DD',
    marginBottom: 16,
  },
  filterBtn: {
    alignItems: 'center',
    paddingBottom: 8,
    minWidth: 86,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.semiBold,
  },
  countBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 20,
    fontFamily: fonts.semiBold,
  },
  filterUnderline: {
    marginTop: 8,
    height: 3,
    width: 58,
    borderRadius: 10,
  },
  cardsWrap: {
    gap: 14,
  },
  card: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 40,
    fontFamily: fonts.semiBold,
    color: '#0F172A',
  },
  statusPill: {
    borderWidth: 0.6,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  upcomingPill: {
    borderColor: '#20BEB8',
    backgroundColor: '#FFFFFF',
  },
  pendingPill: {
    borderColor: '#F0B429',
    backgroundColor: '#FFF9E8',
  },
  statusPillText: {
    fontSize: 10,
    lineHeight: 18,
    fontFamily: fonts.medium,
    color: '#20BEB8',
  },
  upcomingPillText: { color: '#20BEB8' },
  pendingPillText: { color: '#D99700' },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.medium,
    fontWeight: '400',
  },
  tagPill: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.medium,
  },
  conditionText: {
    fontSize: 14,
    lineHeight: 40,
    fontWeight: '400',
    fontFamily: fonts.regular,
    marginBottom: 14,
  },
  detailsBtn: {
    height: 40,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#4CCBC6',
  },
  detailsBtnText: {
    fontSize: 14,
    lineHeight: 38,
    fontFamily: fonts.semiBold,
  },
  sheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  sheetHandle: {
    backgroundColor: '#CBD5E1',
    width: 44,
  },
  sheetScroll: {
    flex: 1,
  },
  sheetContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  sheetTitle: {
    textAlign: 'center',
    color: '#0F172A',
    fontSize: 30,
    lineHeight: 38,
    fontFamily: fonts.semiBold,
    marginBottom: 18,
  },
  sheetPatientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  sheetAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetPatientInfo: {
    flex: 1,
  },
  sheetPatientName: {
    color: '#0F172A',
    fontSize: 20,
    lineHeight: 28,
    fontFamily: fonts.semiBold,
  },
  sheetConditionText: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  sheetPendingPill: {
    alignSelf: 'flex-start',
    borderColor: '#F0B429',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 6,
    backgroundColor: '#FFF9E8',
  },
  sheetPendingPillText: {
    color: '#D99700',
    fontSize: 11,
    lineHeight: 16,
    fontFamily: fonts.medium,
  },
  sheetDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    backgroundColor: '#EEF2F6',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 14,
  },
  sheetDateTimeCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sheetDateTimeText: {
    color: '#475467',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.medium,
  },
  sheetSectionTitle: {
    color: '#334155',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.semiBold,
    marginBottom: 8,
  },
  sheetDescription: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },
  sheetDocumentCard: {
    borderRadius: 10,
    backgroundColor: '#DDE3EB',
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  sheetDocumentName: {
    color: '#1E293B',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.medium,
  },
  sheetDocumentMeta: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
  },
  acceptBtn: {
    backgroundColor: '#20BEB8',
    height: 46,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.semiBold,
  },
  declineBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F04438',
    borderWidth: 1,
    height: 46,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtnText: {
    color: '#F04438',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.semiBold,
  },
});
