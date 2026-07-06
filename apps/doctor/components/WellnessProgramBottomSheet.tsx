import { fonts } from '@/config/fonts';
import { useTheme } from '@/config/theme';
import { WellnessProgramCoverImage } from '@/components/WellnessProgramCoverImage';
import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useBottomSheetInsets } from '@repo/ui/hooks';
import { useWellnessProgramLazy, type WellnessProgramDetail } from '@repo/ui/graphql';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  visible: boolean;
  programId: string | null;
  onClose: () => void;
};

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getDoctorName(program: WellnessProgramDetail) {
  const fullName = [program.doctor.user.firstName, program.doctor.user.lastName]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(' ');

  return fullName ? `Dr. ${fullName}` : 'Doctor';
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const theme = useTheme();

  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: theme.textPrimary, fontFamily: fonts.medium }]}>
        {value}
      </Text>
    </View>
  );
}

function ProgramDaySection({
  day,
}: {
  day: NonNullable<WellnessProgramDetail['days']>[number];
}) {
  const theme = useTheme();
  const tasks = [...(day.tasks ?? [])].sort((left, right) => left.sortOrder - right.sortOrder);

  return (
    <View
      style={[styles.dayCard, { backgroundColor: theme.background, borderColor: theme.divider }]}>
      <View style={styles.dayHeader}>
        <View style={[styles.dayBadge, { backgroundColor: theme.surfaceMuted }]}>
          <Text style={[styles.dayBadgeText, { color: theme.accent, fontFamily: fonts.semiBold }]}>
            {day.dayNumber}
          </Text>
        </View>
        <View style={styles.dayHeaderText}>
          <Text style={[styles.dayTitle, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
            {day.title ?? `Day ${day.dayNumber}`}
          </Text>
          {day.description ? (
            <Text style={[styles.dayDescription, { color: theme.textSecondary }]}>
              {day.description}
            </Text>
          ) : null}
        </View>
      </View>

      {tasks.length > 0 ? (
        <View style={styles.taskList}>
          {tasks.map((task) => (
            <View key={task.id} style={[styles.taskRow, { borderTopColor: theme.divider }]}>
              <Ionicons name="checkmark-circle-outline" size={18} color={theme.accent} />
              <View style={styles.taskText}>
                <Text
                  style={[styles.taskTitle, { color: theme.textPrimary, fontFamily: fonts.medium }]}>
                  {task.title}
                </Text>
                {task.description ? (
                  <Text style={[styles.taskDescription, { color: theme.textSecondary }]}>
                    {task.description}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export function WellnessProgramBottomSheet({ visible, programId, onClose }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const { bottomInset, contentPaddingBottom } = useBottomSheetInsets();
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['70%', '92%'], []);
  const { fetchWellnessProgram, wellnessProgram, loading, error } = useWellnessProgramLazy();
  const sortedDays = useMemo(
    () => [...(wellnessProgram?.days ?? [])].sort((left, right) => left.dayNumber - right.dayNumber),
    [wellnessProgram?.days],
  );

  const handleBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.45}
        pressBehavior="close"
      />
    ),
    [],
  );

  const handleDismiss = useCallback(() => {
    if (visible) {
      onClose();
    }
  }, [onClose, visible]);

  const handleEdit = useCallback(() => {
    if (!programId) return;
    onClose();
    router.push({
      pathname: '/create-wellness-program',
      params: { id: programId },
    });
  }, [onClose, programId, router]);

  useEffect(() => {
    if (visible && programId) {
      sheetRef.current?.present();
      void fetchWellnessProgram({ variables: { id: programId } }).then(({ data }) => {
        console.log('getWellnessProgram response', JSON.stringify(data, null, 2));
      });
      return;
    }

    sheetRef.current?.dismiss();
  }, [fetchWellnessProgram, programId, visible]);

  if (!programId) return null;

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose
      enableDynamicSizing={false}
      backdropComponent={handleBackdrop}
      onDismiss={handleDismiss}
      handleIndicatorStyle={[styles.handle, { backgroundColor: theme.divider }]}
      backgroundStyle={[styles.sheet, { backgroundColor: theme.card }]}
      bottomInset={bottomInset}>
      <View style={styles.sheetBody}>
        <BottomSheetScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: contentPaddingBottom + 72 },
          ]}>
          <Text
            style={[styles.title, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}
            accessibilityRole="header">
            Wellness Program
          </Text>

          {loading ? (
          <View style={styles.statusWrap}>
            <ActivityIndicator size="small" color={theme.accent} />
          </View>
        ) : error ? (
          <View style={styles.statusWrap}>
            <Text style={[styles.statusText, { color: theme.textSecondary }]}>
              Unable to load this wellness program right now.
            </Text>
          </View>
        ) : wellnessProgram ? (
          <>
            <WellnessProgramCoverImage
              coverKey={wellnessProgram.coverImage?.key}
              fallbackSource={
                wellnessProgram.category?.iconUrl
                  ? { uri: wellnessProgram.category.iconUrl }
                  : require('../assets/images/icon.png')
              }
              containerStyle={[
                styles.coverWrap,
                { backgroundColor: theme.surfaceMuted },
              ]}
              coverImageStyle={styles.coverImage}
              fallbackImageStyle={styles.coverFallback}
              loaderColor={theme.accent}
            />

            <Text
              style={[styles.programTitle, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
              {wellnessProgram.title}
            </Text>

            {wellnessProgram.description ? (
              <Text style={[styles.description, { color: theme.textSecondary }]}>
                {wellnessProgram.description}
              </Text>
            ) : null}

            <View style={[styles.detailsCard, { backgroundColor: theme.background, borderColor: theme.divider }]}>
              <DetailRow label="Difficulty" value={formatEnum(wellnessProgram.difficulty)} />
              <DetailRow label="Duration" value={`${wellnessProgram.durationWeeks} weeks`} />
              <DetailRow label="Access" value={formatEnum(wellnessProgram.accessLevel)} />
              <DetailRow label="Status" value={formatEnum(wellnessProgram.publishStatus)} />
              {wellnessProgram.targetAudience ? (
                <DetailRow label="Audience" value={wellnessProgram.targetAudience} />
              ) : null}
              {wellnessProgram.category?.name ? (
                <DetailRow label="Category" value={wellnessProgram.category.name} />
              ) : null}
              <DetailRow label="Doctor" value={getDoctorName(wellnessProgram)} />
            </View>

            {sortedDays.length > 0 ? (
              <View style={styles.daysSection}>
                <Text
                  style={[
                    styles.sectionHeading,
                    { color: theme.textPrimary, fontFamily: fonts.semiBold },
                  ]}>
                  Program Schedule ({sortedDays.length} days)
                </Text>
                {sortedDays.map((day) => (
                  <ProgramDaySection key={day.id} day={day} />
                ))}
              </View>
            ) : null}
          </>
        ) : (
          <View style={styles.statusWrap}>
            <Text style={[styles.statusText, { color: theme.textSecondary }]}>
              No program details found.
            </Text>
          </View>
        )}
        </BottomSheetScrollView>

        {wellnessProgram ? (
          <View
            style={[
              styles.footer,
              {
                backgroundColor: theme.card,
                borderTopColor: theme.divider,
                paddingBottom: contentPaddingBottom,
              },
            ]}>
            <Pressable
              onPress={handleEdit}
              accessibilityRole="button"
              accessibilityLabel="Edit wellness program"
              style={({ pressed }) => [
                styles.editFooterButton,
                { backgroundColor: theme.accent },
                pressed && styles.editFooterButtonPressed,
              ]}>
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              <Text style={[styles.editFooterButtonText, { fontFamily: fonts.semiBold }]}>
                Edit program
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  sheetBody: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  footer: {
    marginBottom: Platform.OS === "android" ? 42: 0,
    paddingHorizontal: 20,
    
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  editFooterButton: {
    minHeight: 48,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  editFooterButtonPressed: {
    opacity: 0.85,
  },
  editFooterButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  coverWrap: {
    height: 160,
    borderRadius: 14,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverImage: {
    borderRadius: 14,
  },
  coverFallback: {
    width: 56,
    height: 56,
  },
  programTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  detailsCard: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 12,
  },
  detailRow: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
  },
  detailValue: {
    fontSize: 15,
  },
  daysSection: {
    marginTop: 20,
    gap: 12,
  },
  sectionHeading: {
    fontSize: 16,
    marginBottom: 4,
  },
  dayCard: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  dayBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBadgeText: {
    fontSize: 14,
  },
  dayHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  dayTitle: {
    fontSize: 15,
  },
  dayDescription: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  taskList: {
    marginTop: 12,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  taskText: {
    flex: 1,
    minWidth: 0,
  },
  taskTitle: {
    fontSize: 14,
  },
  taskDescription: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 17,
  },
  statusWrap: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  statusText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
