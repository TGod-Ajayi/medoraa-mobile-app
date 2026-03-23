import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

export type AppointmentListStatus = 'upcoming' | 'completed' | 'cancelled';

type Props = {
  doctorName: string;
  specialty: string;
  qualifications: string;
  dateTimeLabel: string;
  photoUri: string;
  status: AppointmentListStatus;
  onCancel?: () => void;
  onReschedule?: () => void;
  onSecondaryAction?: () => void;
  /** Override default secondary label (e.g. "View details") */
  secondaryLabel?: string;
};

const BADGE: Record<
  AppointmentListStatus,
  { label: string; border: string; text: string }
> = {
  upcoming: { label: 'Upcoming', border: '#2563EB', text: '#2563EB' },
  completed: { label: 'Completed', border: '#16A34A', text: '#16A34A' },
  cancelled: { label: 'Cancelled', border: '#94A3B8', text: '#64748B' },
};

/**
 * Appointment row card: doctor info, status badge, date/time, Cancel + Reschedule (upcoming).
 */
export function AppointmentListCard({
  doctorName,
  specialty,
  qualifications,
  dateTimeLabel,
  photoUri,
  status,
  onCancel,
  onReschedule,
  onSecondaryAction,
  secondaryLabel,
}: Props) {
  const theme = useTheme();
  const badge = BADGE[status];
  const showDualActions = status === 'upcoming' && (onCancel || onReschedule);

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.divider }]}>
      <View style={styles.topRow}>
        <Image source={{ uri: photoUri }} style={styles.avatar} />
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <View style={styles.nameBlock}>
              <Text
                style={[styles.name, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}
                numberOfLines={1}>
                {doctorName}
              </Text>
              <Text style={[styles.specialty, { color: theme.textPrimary }]} numberOfLines={1}>
                {specialty}
              </Text>
              <Text style={[styles.qual, { color: theme.textSecondary }]} numberOfLines={2}>
                {qualifications}
              </Text>
            </View>
            <View style={[styles.badge, { borderColor: badge.border }]}>
              <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
            </View>
          </View>
          <Text style={[styles.dateTime, { color: theme.textPrimary, fontFamily: fonts.medium }]}>
            {dateTimeLabel}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.divider }]} />

      {showDualActions ? (
        <View style={styles.actions}>
          <Pressable
            onPress={onCancel}
            style={[styles.btnOutline, { borderColor: theme.accent }]}
            accessibilityRole='button'
            accessibilityLabel='Cancel appointment'>
            <Text style={[styles.btnOutlineText, { color: theme.accent, fontFamily: fonts.semiBold }]}>
              Cancel
            </Text>
          </Pressable>
          <Pressable
            onPress={onReschedule}
            style={[styles.btnSolid, { backgroundColor: theme.accent }]}
            accessibilityRole='button'
            accessibilityLabel='Reschedule appointment'>
            <Text style={[styles.btnSolidText, { fontFamily: fonts.semiBold }]}>Reschedule</Text>
          </Pressable>
        </View>
      ) : onSecondaryAction ? (
        <Pressable
          onPress={onSecondaryAction}
          style={[styles.btnSolidFull, { backgroundColor: theme.accent }]}
          accessibilityRole='button'>
          <Text style={[styles.btnSolidText, { fontFamily: fonts.semiBold }]}>
            {secondaryLabel ?? 'View details'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  nameBlock: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
  },
  specialty: {
    fontSize: 14,
    marginTop: 2,
  },
  qual: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dateTime: {
    fontSize: 13,
    marginTop: 10,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  btnOutline: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutlineText: {
    fontSize: 14,
  },
  btnSolid: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSolidFull: {
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  btnSolidText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});
