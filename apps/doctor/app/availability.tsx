import { Button } from '@/components';
import { fonts } from '@/config/fonts';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import { Hooks } from '@repo/ui/graphql';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const REMOVE_SLIDE_MS = 280;
const REMOVE_FADE_MS = 220;
const REMOVE_COLLAPSE_MS = 260;
const REMOVE_COLLAPSE_DELAY = 140;

type AnimatedRemoveWrapProps = {
  removing: boolean;
  onRemoved: () => void;
  children: ReactNode;
};

function AnimatedRemoveWrap({
  removing,
  onRemoved,
  children,
}: AnimatedRemoveWrapProps) {
  const measuredHeight = useRef(0);
  const hasMeasured = useRef(false);
  const completedRef = useRef(false);
  const removingRef = useRef(removing);
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const height = useSharedValue<number | null>(null);

  removingRef.current = removing;

  const completeRemoval = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onRemoved();
  }, [onRemoved]);

  const resetAnimation = useCallback(() => {
    opacity.value = withTiming(1, { duration: REMOVE_FADE_MS });
    translateX.value = withTiming(0, { duration: REMOVE_SLIDE_MS });
    scale.value = withTiming(1, { duration: REMOVE_SLIDE_MS });
    if (hasMeasured.current) {
      height.value = withTiming(measuredHeight.current, {
        duration: REMOVE_COLLAPSE_MS,
      });
    }
  }, [height, opacity, scale, translateX]);

  const startCollapse = useCallback(() => {
    if (!hasMeasured.current) return;

    height.value = withDelay(
      REMOVE_COLLAPSE_DELAY,
      withTiming(
        0,
        {
          duration: REMOVE_COLLAPSE_MS,
          easing: Easing.inOut(Easing.ease),
        },
        (finished) => {
          if (finished) {
            runOnJS(completeRemoval)();
          }
        },
      ),
    );
  }, [completeRemoval, height]);

  useEffect(() => {
    if (!removing) {
      completedRef.current = false;
      resetAnimation();
      return;
    }

    completedRef.current = false;

    opacity.value = withTiming(0, {
      duration: REMOVE_FADE_MS,
      easing: Easing.out(Easing.quad),
    });
    translateX.value = withTiming(-72, {
      duration: REMOVE_SLIDE_MS,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
    scale.value = withTiming(0.94, {
      duration: REMOVE_SLIDE_MS,
      easing: Easing.out(Easing.quad),
    });

    startCollapse();

    const fallback = setTimeout(() => {
      runOnJS(completeRemoval)();
    }, REMOVE_SLIDE_MS + REMOVE_COLLAPSE_DELAY + REMOVE_COLLAPSE_MS + 100);

    return () => clearTimeout(fallback);
  }, [
    completeRemoval,
    height,
    opacity,
    removing,
    resetAnimation,
    scale,
    startCollapse,
    translateX,
  ]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height;
    if (nextHeight <= 0) return;

    measuredHeight.current = nextHeight;
    if (!hasMeasured.current) {
      hasMeasured.current = true;
      height.value = nextHeight;
      if (removingRef.current) {
        startCollapse();
      }
      return;
    }

    if (!removingRef.current && height.value !== nextHeight) {
      height.value = nextHeight;
    }
  };

  const containerStyle = useAnimatedStyle(() => ({
    height: height.value ?? undefined,
    overflow: 'hidden',
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={containerStyle}>
      <Animated.View onLayout={handleLayout} style={contentStyle}>
        {children}
      </Animated.View>
    </Animated.View>
  );
}

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
  startTime: string;
  endTime: string;
};

const DAY_TO_API: Record<Day, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const API_TO_DAY: Record<number, Day> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

const TIME_24H_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const DEFAULT_SLOTS: Omit<TimeSlot, 'id'>[] = [
  { startTime: '08:00', endTime: '12:00' },
  { startTime: '14:00', endTime: '17:30' },
];

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

function formatTimeLabel(time24: string): string {
  const { hour, minute, period } = parseTime24(time24);
  return `${Number(hour)}:${minute} ${period}`;
}

function cloneDefaultSlots(): TimeSlot[] {
  return DEFAULT_SLOTS.map((slot, index) => ({
    ...slot,
    id: `slot-${Date.now()}-${index}`,
  }));
}

function createEmptySlotsByDay(): Record<Day, TimeSlot[]> {
  return {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };
}

function createEmptyEnabledByDay(): Record<Day, boolean> {
  return {
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  };
}

type SavedAvailability = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

function normalizeTime24(value: string): string {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return '09:00';
  const hours = Number(match[1]);
  if (Number.isNaN(hours) || hours < 0 || hours > 23) return '09:00';
  return `${String(hours).padStart(2, '0')}:${match[2]}`;
}

function buildStateFromAvailability(availability: SavedAvailability[]) {
  const enabled = createEmptyEnabledByDay();
  const slots = createEmptySlotsByDay();

  for (const item of availability) {
    if (!item.isActive) continue;

    const day = API_TO_DAY[item.dayOfWeek];
    if (!day) continue;

    enabled[day] = true;
    slots[day].push({
      id: item.id,
      startTime: normalizeTime24(item.startTime),
      endTime: normalizeTime24(item.endTime),
    });
  }

  for (const day of DAYS) {
    slots[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  return { enabled, slots };
}

function isPersistedAvailabilityId(id: string) {
  return !id.startsWith('slot-');
}

function countActiveAvailability(
  availability: SavedAvailability[] | null | undefined,
) {
  return (availability ?? []).filter((item) => item.isActive).length;
}

export default function AvailabilityScreen() {
  const theme = useTheme();
  const router = useRouter();
  const timezone = useMemo(getDeviceTimezone, []);
  const hasHydratedRef = useRef(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [enabledByDay, setEnabledByDay] = useState(createEmptyEnabledByDay);
  const [slotsByDay, setSlotsByDay] = useState(createEmptySlotsByDay);
  const { data: doctorData, loading: loadingAvailability, refetch: refetchDoctor } =
    Hooks.useGetDoctorQuery({
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    });
  const [createDoctorAvailability, { loading: saving }] =
    Hooks.useCreateDoctorAvailabilityMutation();
  const [removeDoctorAvailability] = Hooks.useRemoveDoctorAvailabilityMutation();
  const [removingSlotIds, setRemovingSlotIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [removingDayKeys, setRemovingDayKeys] = useState<Set<Day>>(
    () => new Set(),
  );
  const slotRemovalResolversRef = useRef<Map<string, () => void>>(new Map());
  const dayRemovalResolversRef = useRef<Map<Day, () => void>>(new Map());

  const waitForSlotRemovalAnimation = useCallback((slotId: string) => {
    return new Promise<void>((resolve) => {
      slotRemovalResolversRef.current.set(slotId, resolve);
    });
  }, []);

  const waitForDayRemovalAnimation = useCallback((day: Day) => {
    return new Promise<void>((resolve) => {
      dayRemovalResolversRef.current.set(day, resolve);
    });
  }, []);

  const handleSlotRemovalAnimationComplete = useCallback((slotId: string) => {
    slotRemovalResolversRef.current.get(slotId)?.();
    slotRemovalResolversRef.current.delete(slotId);
  }, []);

  const handleDayRemovalAnimationComplete = useCallback((day: Day) => {
    dayRemovalResolversRef.current.get(day)?.();
    dayRemovalResolversRef.current.delete(day);
  }, []);

  const markSlotRemoving = useCallback((slotId: string) => {
    setRemovingSlotIds((prev) => new Set(prev).add(slotId));
  }, []);

  const unmarkSlotRemoving = useCallback((slotId: string) => {
    setRemovingSlotIds((prev) => {
      const next = new Set(prev);
      next.delete(slotId);
      return next;
    });
    slotRemovalResolversRef.current.delete(slotId);
  }, []);

  const markDayRemoving = useCallback((day: Day) => {
    setRemovingDayKeys((prev) => new Set(prev).add(day));
  }, []);

  const unmarkDayRemoving = useCallback((day: Day) => {
    setRemovingDayKeys((prev) => {
      const next = new Set(prev);
      next.delete(day);
      return next;
    });
    dayRemovalResolversRef.current.delete(day);
  }, []);
  const notifyIfFullyRemoved = useCallback(
    async (hadActiveBefore: number) => {
      const result = await refetchDoctor();
      const remaining = countActiveAvailability(
        result.data?.getDoctor?.availability ?? [],
      );

      if (hadActiveBefore > 0 && remaining === 0) {
        showMessage({
          message: 'Availability removed',
          description: 'Your availability has been completely removed.',
          type: 'success',
          duration: 4000,
        });
        hasHydratedRef.current = false;
        setHasHydrated(false);
        setEnabledByDay(createEmptyEnabledByDay());
        setSlotsByDay(createEmptySlotsByDay());
        setRemovingSlotIds(new Set());
        setRemovingDayKeys(new Set());
      }
    },
    [refetchDoctor],
  );

  const removePersistedAvailability = useCallback(
    async (ids: string[]) => {
      const persistedIds = ids.filter(isPersistedAvailabilityId);
      if (persistedIds.length === 0) return;

      const hadActiveBefore = countActiveAvailability(
        doctorData?.getDoctor?.availability,
      );

      try {
        await Promise.all(
          persistedIds.map((id) =>
            removeDoctorAvailability({ variables: { id } }),
          ),
        );
        await notifyIfFullyRemoved(hadActiveBefore);
      } catch (error) {
        console.log(
          'removeDoctorAvailability error\n' +
            JSON.stringify(
              {
                message:
                  error instanceof Error ? error.message : 'Unknown error',
              },
              null,
              2,
            ),
        );
        showMessage({
          message: 'Could not remove availability',
          description: 'Please try again in a moment.',
          type: 'danger',
          duration: 4000,
        });
        throw error;
      }
    },
    [
      doctorData?.getDoctor?.availability,
      notifyIfFullyRemoved,
      removeDoctorAvailability,
    ],
  );

  useEffect(() => {
    if (hasHydratedRef.current || loadingAvailability) return;
    if (!doctorData?.getDoctor) return;

    const availability = doctorData.getDoctor.availability ?? [];
    const { enabled, slots } = buildStateFromAvailability(availability);
    setEnabledByDay(enabled);
    setSlotsByDay(slots);
    hasHydratedRef.current = true;
    setHasHydrated(true);
  }, [doctorData?.getDoctor, loadingAvailability]);

  useEffect(() => {
    console.log(
      'doctor availability response\n' +
        JSON.stringify(
          {
            availability: doctorData?.getDoctor?.availability ?? [],
            loading: loadingAvailability,
            timezone,
          },
          null,
          2,
        ),
    );
  }, [doctorData?.getDoctor?.availability, loadingAvailability, timezone]);

  const toggleDay = async (day: Day) => {
    if (enabledByDay[day]) {
      if (removingDayKeys.has(day)) return;

      const persistedIds = slotsByDay[day].map((slot) => slot.id);
      const hasPersistedSlots = persistedIds.some(isPersistedAvailabilityId);

      markDayRemoving(day);

      try {
        const tasks: Promise<unknown>[] = [waitForDayRemovalAnimation(day)];
        if (hasPersistedSlots) {
          tasks.push(removePersistedAvailability(persistedIds));
        }
        await Promise.all(tasks);

        setEnabledByDay((prev) => ({ ...prev, [day]: false }));
        setSlotsByDay((prev) => ({ ...prev, [day]: [] }));
      } catch {
        unmarkDayRemoving(day);
        return;
      }

      unmarkDayRemoving(day);
      return;
    }

    setEnabledByDay((prev) => ({ ...prev, [day]: true }));
    setSlotsByDay((curr) => ({
      ...curr,
      [day]: curr[day].length > 0 ? curr[day] : cloneDefaultSlots(),
    }));
  };

  const updateSlot = (
    day: Day,
    slotId: string,
    field: 'startTime' | 'endTime',
    value: string,
  ) => {
    setSlotsByDay((prev) => ({
      ...prev,
      [day]: prev[day].map((slot) =>
        slot.id === slotId ? { ...slot, [field]: value } : slot,
      ),
    }));
  };

  const removeSlot = async (day: Day, slotId: string) => {
    if (removingSlotIds.has(slotId)) return;

    markSlotRemoving(slotId);

    try {
      const tasks: Promise<unknown>[] = [waitForSlotRemovalAnimation(slotId)];
      if (isPersistedAvailabilityId(slotId)) {
        tasks.push(removePersistedAvailability([slotId]));
      }
      await Promise.all(tasks);

      setSlotsByDay((prev) => ({
        ...prev,
        [day]: prev[day].filter((slot) => slot.id !== slotId),
      }));
    } catch {
      unmarkSlotRemoving(slotId);
      return;
    }

    unmarkSlotRemoving(slotId);
  };

  const addSlot = (day: Day) => {
    setSlotsByDay((prev) => ({
      ...prev,
      [day]: [
        ...prev[day],
        {
          id: `slot-${Date.now()}-${prev[day].length}`,
          startTime: '09:00',
          endTime: '13:00',
        },
      ],
    }));
  };

  const handleSave = useCallback(async () => {
    const entries = DAYS.flatMap((day) => {
      if (!enabledByDay[day]) return [];
      return slotsByDay[day].map((slot) => ({ day, slot }));
    });

    if (entries.length === 0) {
      showMessage({
        message: 'No availability selected',
        description: 'Enable at least one day and add time slots.',
        type: 'warning',
      });
      return;
    }

    for (const { day, slot } of entries) {
      const startTime = slot.startTime.trim();
      const endTime = slot.endTime.trim();

      if (!TIME_24H_PATTERN.test(startTime) || !TIME_24H_PATTERN.test(endTime)) {
        showMessage({
          message: 'Invalid time',
          description: `${day}: use 24-hour format, e.g. 09:00 or 17:30.`,
          type: 'warning',
        });
        return;
      }

      if (startTime >= endTime) {
        showMessage({
          message: 'Invalid range',
          description: `${day}: end time must be after start time.`,
          type: 'warning',
        });
        return;
      }
    }

    try {
      const results = await Promise.all(
        entries.map(({ day, slot }) =>
          createDoctorAvailability({
            variables: {
              createDoctorAvailabilityInput: {
                dayOfWeek: DAY_TO_API[day],
                startTime: slot.startTime.trim(),
                endTime: slot.endTime.trim(),
                timezone,
              },
            },
          }),
        ),
      );

      console.log(
        'createDoctorAvailability response\n' +
          JSON.stringify(
            results.map((result) => result.data?.createDoctorAvailability),
            null,
            2,
          ),
      );

      showMessage({
        message: 'Availability saved',
        description: 'Your weekly hours have been updated.',
        type: 'success',
      });
      hasHydratedRef.current = false;
      setHasHydrated(false);
      await refetchDoctor();
      router.back();
    } catch (error) {
      console.log(
        'createDoctorAvailability error\n' +
          JSON.stringify(
            {
              message: error instanceof Error ? error.message : 'Unknown error',
            },
            null,
            2,
          ),
      );
      showMessage({
        message: 'Could not save availability',
        description: 'Please try again in a moment.',
        type: 'danger',
      });
    }
  }, [
    createDoctorAvailability,
    enabledByDay,
    refetchDoctor,
    router,
    slotsByDay,
    timezone,
  ]);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top', 'bottom']}>
      <View style={styles.flex}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: theme.card }]}>
            <Ionicons name="chevron-back" size={22} color="#667085" />
          </Pressable>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Availability
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={[styles.subtitle, { color: theme.textPrimary }]}>
          Add hours of your availability
        </Text>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {loadingAvailability && !hasHydrated ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color={theme.accent} />
              <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                Loading your availability…
              </Text>
            </View>
          ) : (
          <>
          {DAYS.map((day) => {
            const enabled = enabledByDay[day];
            const isDayRemoving = removingDayKeys.has(day);
            return (
              <View key={day} style={styles.dayBlock}>
                <View style={[styles.dayRow, { backgroundColor: theme.card }]}>
                  <Text style={[styles.dayLabel, { color: theme.textPrimary }]}>
                    {day}
                  </Text>
                  <Pressable
                    onPress={() => void toggleDay(day)}
                    style={[styles.toggleTrack, enabled && styles.toggleTrackOn]}
                    accessibilityRole="switch"
                    accessibilityState={{ checked: enabled }}>
                    <View
                      style={[styles.toggleThumb, enabled && styles.toggleThumbOn]}
                    />
                  </Pressable>
                </View>

                {enabled ? (
                  <AnimatedRemoveWrap
                    removing={isDayRemoving}
                    onRemoved={() => handleDayRemovalAnimationComplete(day)}>
                    <View style={[styles.hoursPanel, { backgroundColor: theme.card }]}>
                      {slotsByDay[day].map((slot) => {
                        const isSlotRemoving = removingSlotIds.has(slot.id);

                        return (
                          <AnimatedRemoveWrap
                            key={slot.id}
                            removing={isSlotRemoving}
                            onRemoved={() =>
                              handleSlotRemovalAnimationComplete(slot.id)
                            }>
                            <View style={styles.slotWrap}>
                              <View style={styles.slotFieldsRow}>
                                <View style={styles.timeFieldCol}>
                                  <Text style={styles.timeLabel}>From</Text>
                                  <View style={styles.timeField}>
                                    <TextInput
                                      value={slot.startTime}
                                      onChangeText={(value) =>
                                        updateSlot(day, slot.id, 'startTime', value)
                                      }
                                      placeholder="09:00"
                                      placeholderTextColor="#94A3B8"
                                      style={styles.timeInput}
                                      autoCapitalize="none"
                                      autoCorrect={false}
                                      editable={!isSlotRemoving}
                                    />
                                    <Text style={styles.timeHint}>
                                      {formatTimeLabel(slot.startTime)}
                                    </Text>
                                  </View>
                                </View>
                                <View style={styles.timeFieldCol}>
                                  <Text style={styles.timeLabel}>To</Text>
                                  <View style={styles.timeField}>
                                    <TextInput
                                      value={slot.endTime}
                                      onChangeText={(value) =>
                                        updateSlot(day, slot.id, 'endTime', value)
                                      }
                                      placeholder="17:00"
                                      placeholderTextColor="#94A3B8"
                                      style={styles.timeInput}
                                      autoCapitalize="none"
                                      autoCorrect={false}
                                      editable={!isSlotRemoving}
                                    />
                                    <Text style={styles.timeHint}>
                                      {formatTimeLabel(slot.endTime)}
                                    </Text>
                                  </View>
                                </View>
                                <Pressable
                                  onPress={() => void removeSlot(day, slot.id)}
                                  disabled={isSlotRemoving}
                                  style={[
                                    styles.removeSlotBtn,
                                    isSlotRemoving && styles.removeSlotBtnDisabled,
                                  ]}
                                  accessibilityRole="button"
                                  accessibilityLabel="Remove time slot"
                                  accessibilityState={{ disabled: isSlotRemoving }}>
                                  {isSlotRemoving ? (
                                    <ActivityIndicator size="small" color="#64748B" />
                                  ) : (
                                    <Ionicons name="close" size={24} color="#64748B" />
                                  )}
                                </Pressable>
                              </View>
                            </View>
                          </AnimatedRemoveWrap>
                        );
                      })}

                      <Pressable
                        onPress={() => addSlot(day)}
                        style={styles.addHoursBtn}
                        accessibilityRole="button"
                        accessibilityLabel="Add hours">
                        <Text style={styles.addHoursText}>Add Hours</Text>
                      </Pressable>
                    </View>
                  </AnimatedRemoveWrap>
                ) : null}
              </View>
            );
          })}

          <View
            style={[
              styles.timezoneRow,
              { backgroundColor: theme.card, borderColor: '#C3CEDB' },
            ]}>
            <Ionicons name="globe-outline" size={18} color={theme.textMuted} />
            <Text style={[styles.timezoneText, { color: theme.textSecondary }]}>
              Timezone: {timezone}
            </Text>
          </View>
          </>
          )}
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: theme.background }]}>
          <Button
            theme={theme}
            label={saving ? 'Saving…' : 'Save availability'}
            onPress={handleSave}
            disabled={saving}
            style={styles.saveBtn}
            leftIcon={
              saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : undefined
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
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
    paddingBottom: 16,
    gap: 10,
  },
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: 'center',
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
    paddingVertical: 8,
  },
  timeInput: {
    color: '#1E293B',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.medium,
    padding: 0,
  },
  timeHint: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: fonts.regular,
    marginTop: 4,
  },
  removeSlotBtn: {
    width: 38,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeSlotBtnDisabled: {
    opacity: 0.45,
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
  timezoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 4,
  },
  timezoneText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  saveBtn: {
    borderRadius: 999,
  },
});
