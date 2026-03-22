import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

type CalView = 'days' | 'months' | 'years';

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1924;
const YEARS_LIST = Array.from(
  { length: CURRENT_YEAR - MIN_YEAR + 1 },
  (_, i) => MIN_YEAR + i,
);

const SHEET_HEIGHT = 540;
const SPRING_CFG = { damping: 22, stiffness: 200, mass: 0.8 };
const YEAR_ITEM_H = 52;
const YEARS_PER_ROW = 4;

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstWeekday(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function buildCalendarGrid(year: number, month: number) {
  const total = daysInMonth(year, month);
  const offset = firstWeekday(year, month);
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

type Props = {
  visible: boolean;
  selected: Date;
  onConfirm: (date: Date) => void;
  onClose: () => void;
};

export function DatePickerBottomSheet({ visible, selected, onConfirm, onClose }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const translateY = useSharedValue(SHEET_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  const [calView, setCalView] = useState<CalView>('days');
  const [viewYear, setViewYear] = useState(selected.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected.getMonth());
  const [pickedDay, setPickedDay] = useState(selected.getDate());
  const [internalVisible, setInternalVisible] = useState(false);

  const yearScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible) {
      setCalView('days');
      setViewYear(selected.getFullYear());
      setViewMonth(selected.getMonth());
      setPickedDay(selected.getDate());
      setInternalVisible(true);
      translateY.value = withSpring(0, SPRING_CFG);
      backdropOpacity.value = withTiming(1, { duration: 250 });
    } else {
      dismiss();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (calView === 'years') {
      const idx = YEARS_LIST.indexOf(viewYear);
      const row = Math.floor(idx / YEARS_PER_ROW);
      const offset = Math.max(0, row * YEAR_ITEM_H - YEAR_ITEM_H);
      setTimeout(() => {
        yearScrollRef.current?.scrollTo({ y: offset, animated: false });
      }, 80);
    }
  }, [calView, viewYear]);

  function dismiss() {
    translateY.value = withSpring(SHEET_HEIGHT, SPRING_CFG);
    backdropOpacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) runOnJS(setInternalVisible)(false);
    });
  }

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationY > 120 || e.velocityY > 600) {
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, SPRING_CFG);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const grid = useMemo(() => buildCalendarGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  function handleConfirm() {
    const maxDay = daysInMonth(viewYear, viewMonth);
    onConfirm(new Date(viewYear, viewMonth, Math.min(pickedDay, maxDay)));
    onClose();
  }

  function selectMonth(m: number) {
    setViewMonth(m);
    setCalView('days');
  }

  function selectYear(y: number) {
    setViewYear(y);
    setCalView('months');
  }

  const today = new Date();
  const isCurrentViewSelection =
    viewYear === selected.getFullYear() && viewMonth === selected.getMonth();

  // True when the currently viewed month is already the current calendar month
  const isAtMaxMonth =
    viewYear === today.getFullYear() && viewMonth === today.getMonth();
  const isAtMaxYear = viewYear >= today.getFullYear();

  if (!internalVisible) return null;

  /* ── header chips ── */
  const renderHeader = () => {
    if (calView === 'days') {
      return (
        <View style={styles.calHeader}>
          <Pressable onPress={prevMonth} style={styles.navBtn} hitSlop={12}>
            <Ionicons name='chevron-back' size={22} color={theme.textPrimary} />
          </Pressable>

          <View style={styles.headerChips}>
            <Pressable
              style={[styles.chip, { backgroundColor: theme.surfaceMuted }]}
              onPress={() => setCalView('months')}>
              <Text style={[styles.chipText, { color: theme.accent, fontFamily: fonts.semiBold }]}>
                {MONTHS_LONG[viewMonth]}
              </Text>
              <Ionicons name='chevron-down' size={14} color={theme.accent} style={styles.chipIcon} />
            </Pressable>

            <Pressable
              style={[styles.chip, { backgroundColor: theme.surfaceMuted }]}
              onPress={() => setCalView('years')}>
              <Text style={[styles.chipText, { color: theme.accent, fontFamily: fonts.semiBold }]}>
                {viewYear}
              </Text>
              <Ionicons name='chevron-down' size={14} color={theme.accent} style={styles.chipIcon} />
            </Pressable>
          </View>

          <Pressable
            onPress={isAtMaxMonth ? undefined : nextMonth}
            style={[styles.navBtn, isAtMaxMonth && styles.navBtnDisabled]}
            disabled={isAtMaxMonth}
            hitSlop={12}>
            <Ionicons
              name='chevron-forward'
              size={22}
              color={isAtMaxMonth ? theme.textMuted : theme.textPrimary}
            />
          </Pressable>
        </View>
      );
    }

    if (calView === 'months') {
      return (
        <View style={styles.calHeader}>
          <Pressable onPress={() => setCalView('days')} style={styles.navBtn} hitSlop={12}>
            <Ionicons name='chevron-back' size={22} color={theme.textPrimary} />
          </Pressable>
          <View style={styles.headerChips}>
            <Pressable
              style={[styles.chip, { backgroundColor: theme.surfaceMuted }]}
              onPress={() => setCalView('years')}>
              <Text style={[styles.chipText, { color: theme.accent, fontFamily: fonts.semiBold }]}>
                {viewYear}
              </Text>
              <Ionicons name='chevron-down' size={14} color={theme.accent} style={styles.chipIcon} />
            </Pressable>
          </View>
          <View style={styles.navBtn} />
        </View>
      );
    }

    /* years */
    return (
      <View style={styles.calHeader}>
        <Pressable onPress={() => setCalView('months')} style={styles.navBtn} hitSlop={12}>
          <Ionicons name='chevron-back' size={22} color={theme.textPrimary} />
        </Pressable>
        <Text style={[styles.selectTitle, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
          Select Year
        </Text>
        <View style={styles.navBtn} />
      </View>
    );
  };

  /* ── body content ── */
  const renderBody = () => {
    /* ---- MONTHS grid ---- */
    if (calView === 'months') {
      return (
        <View style={styles.monthGrid}>
          {MONTHS_SHORT.map((m, i) => {
            const isSelected = i === viewMonth;
            const isCurrentMonth =
              i === today.getMonth() && viewYear === today.getFullYear();
            // Future month: same year and month index > today's month, or year is future
            const isFutureMonth =
              viewYear > today.getFullYear() ||
              (viewYear === today.getFullYear() && i > today.getMonth());
            return (
              <Pressable
                key={m}
                style={styles.monthCell}
                onPress={() => !isFutureMonth && selectMonth(i)}
                disabled={isFutureMonth}
                accessibilityRole='button'
                accessibilityState={{ selected: isSelected, disabled: isFutureMonth }}>
                <View
                  style={[
                    styles.monthPill,
                    isSelected && { backgroundColor: theme.accent },
                    !isSelected && isCurrentMonth && {
                      borderWidth: 1.5,
                      borderColor: theme.accent,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.monthText,
                      {
                        color: isFutureMonth
                          ? theme.textMuted
                          : isSelected
                          ? '#FFFFFF'
                          : isCurrentMonth
                          ? theme.accent
                          : theme.textPrimary,
                        fontFamily: isSelected ? fonts.semiBold : fonts.medium,
                      },
                    ]}>
                    {m}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      );
    }

    /* ---- YEARS scrollable grid ---- */
    if (calView === 'years') {
      const rows: number[][] = [];
      for (let i = 0; i < YEARS_LIST.length; i += YEARS_PER_ROW) {
        rows.push(YEARS_LIST.slice(i, i + YEARS_PER_ROW));
      }
      return (
        <ScrollView
          ref={yearScrollRef}
          showsVerticalScrollIndicator={false}
          style={styles.yearScroll}
          contentContainerStyle={styles.yearGrid}>
          {rows.map((row) => (
            <View key={row[0]} style={styles.yearRow}>
              {row.map((y) => {
                const isSelected = y === viewYear;
                const isCurrentYear = y === today.getFullYear();
                const isFutureYear = y > today.getFullYear();
                return (
                  <Pressable
                    key={y}
                    style={styles.yearCell}
                    onPress={() => !isFutureYear && selectYear(y)}
                    disabled={isFutureYear}
                    accessibilityRole='button'
                    accessibilityState={{ selected: isSelected, disabled: isFutureYear }}>
                    <View
                      style={[
                        styles.yearPill,
                        isSelected && { backgroundColor: theme.accent },
                        !isSelected && isCurrentYear && {
                          borderWidth: 1.5,
                          borderColor: theme.accent,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.yearText,
                          {
                            color: isFutureYear
                              ? theme.textMuted
                              : isSelected
                              ? '#FFFFFF'
                              : isCurrentYear
                              ? theme.accent
                              : theme.textPrimary,
                            fontFamily: isSelected ? fonts.semiBold : fonts.regular,
                          },
                        ]}>
                        {y}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </ScrollView>
      );
    }

    /* ---- DAYS grid ---- */
    // Chunk the flat array into explicit rows of 7 so each cell uses flex:1,
    // matching the header row — eliminates any Yoga % rounding drift.
    const weeks: (number | null)[][] = [];
    for (let i = 0; i < grid.length; i += 7) weeks.push(grid.slice(i, i + 7));

    // A viewed month is in the future if its year > today's year,
    // or same year but its month index > today's month.
    const viewedMonthIsFuture =
      viewYear > today.getFullYear() ||
      (viewYear === today.getFullYear() && viewMonth > today.getMonth());

    return (
      <>
        {/* day-name header row */}
        <View style={styles.calRow}>
          {DAYS_SHORT.map((d) => (
            <Text
              key={d}
              style={[styles.dayName, { color: theme.textSecondary, fontFamily: fonts.medium }]}>
              {d}
            </Text>
          ))}
        </View>
        <View style={[styles.divider, { backgroundColor: theme.divider }]} />

        {/* one View per week row */}
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.calRow}>
            {week.map((day, ci) => {
              if (day === null) {
                return <View key={`e-${wi}-${ci}`} style={styles.cell} />;
              }

              const isToday =
                day === today.getDate() &&
                viewMonth === today.getMonth() &&
                viewYear === today.getFullYear();

              // Disable if the whole viewed month is in the future,
              // or if it's the current month and this day is after today.
              const isViewingCurrentMonth =
                viewYear === today.getFullYear() && viewMonth === today.getMonth();
              const isFuture =
                viewedMonthIsFuture ||
                (isViewingCurrentMonth && day > today.getDate());

              const isPicked = isCurrentViewSelection && day === pickedDay;

              return (
                <Pressable
                  key={`d-${wi}-${ci}`}
                  style={styles.cell}
                  onPress={() => !isFuture && setPickedDay(day)}
                  disabled={isFuture}
                  accessibilityRole='button'
                  accessibilityLabel={`${day} ${MONTHS_LONG[viewMonth]} ${viewYear}`}
                  accessibilityState={{ selected: isPicked, disabled: isFuture }}>
                  <View
                    style={[
                      styles.dayCircle,
                      isPicked && { backgroundColor: theme.accent },
                      !isPicked && isToday && {
                        borderWidth: 1.5,
                        borderColor: theme.accent,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.dayNumber,
                        {
                          color: isFuture
                            ? theme.textMuted
                            : isPicked
                            ? '#FFFFFF'
                            : isToday
                            ? theme.accent
                            : theme.textPrimary,
                          fontFamily: isPicked ? fonts.semiBold : fonts.regular,
                        },
                      ]}>
                      {day}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </>
    );
  };

  return (
    <Modal transparent animationType='none' visible={internalVisible} onRequestClose={onClose}>
      <GestureHandlerRootView style={StyleSheet.absoluteFill}>
        {/* backdrop */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        {/* sheet */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.sheet,
              { backgroundColor: theme.card, paddingBottom: insets.bottom + 16 },
              sheetStyle,
            ]}>
            {/* drag handle */}
            <View style={styles.handleWrap}>
              <View style={[styles.handle, { backgroundColor: theme.divider }]} />
            </View>

            {renderHeader()}

            <View style={[styles.divider, { backgroundColor: theme.divider }]} />

            <View style={styles.body}>{renderBody()}</View>

            {/* footer buttons — only show in days view */}
            {calView === 'days' && (
              <View style={styles.footer}>
                <Pressable
                  onPress={onClose}
                  style={[styles.footerBtn, { borderColor: theme.divider }]}>
                  <Text
                    style={[styles.cancelText, { color: theme.textSecondary, fontFamily: fonts.medium }]}>
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirm}
                  style={[styles.footerBtn, styles.confirmBtn, { backgroundColor: theme.accent }]}>
                  <Text style={[styles.confirmText, { fontFamily: fonts.semiBold }]}>
                    Confirm
                  </Text>
                </Pressable>
              </View>
            )}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}

const CELL_SIZE = 42;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
    minHeight: SHEET_HEIGHT,
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  calHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnDisabled: {
    opacity: 0.35,
  },
  headerChips: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipText: {
    fontSize: 15,
  },
  chipIcon: {
    marginLeft: 4,
  },
  selectTitle: {
    fontSize: 17,
    flex: 1,
    textAlign: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
    marginBottom: 4,
  },
  body: {
    paddingTop: 4,
    flex: 1,
  },
  /* days — both header and grid rows share the same flex row */
  calRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  dayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    paddingTop: 8,
    paddingBottom: 6,
  },
  cell: {
    flex: 1,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    fontSize: 14,
  },
  /* months */
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 0,
  },
  monthCell: {
    width: '25%',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  monthText: {
    fontSize: 14,
  },
  /* years */
  yearScroll: {
    maxHeight: 340,
  },
  yearGrid: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  yearRow: {
    flexDirection: 'row',
    height: YEAR_ITEM_H,
  },
  yearCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearPill: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 58,
  },
  yearText: {
    fontSize: 14,
  },
  /* footer */
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 12,
  },
  footerBtn: {
    flex: 1,
    height: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  confirmBtn: {
    borderWidth: 0,
  },
  cancelText: {
    fontSize: 15,
  },
  confirmText: {
    fontSize: 15,
    color: '#FFFFFF',
  },
});
