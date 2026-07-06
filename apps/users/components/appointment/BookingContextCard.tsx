import { Ionicons } from '@expo/vector-icons';
import type { ImageSourcePropType } from 'react-native';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

import { formatAppointmentDateTime } from './appointment-scheduling';
import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

type Props = {
  doctorName: string;
  specialty: string;
  photoSource: ImageSourcePropType;
  dateTimeLabel?: string | null;
  slotStart?: string | null;
  slotEnd?: string | null;
  loading?: boolean;
};

export function BookingContextCard({
  doctorName,
  specialty,
  photoSource,
  dateTimeLabel,
  slotStart,
  slotEnd,
  loading,
}: Props) {
  const theme = useTheme();
  const scheduleLabel =
    dateTimeLabel ??
    (slotStart ? formatAppointmentDateTime(slotStart, slotEnd) : null);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.divider },
      ]}>
      <Text
        style={[
          styles.heading,
          { color: theme.textPrimary, fontFamily: fonts.semiBold },
        ]}>
        Your appointment
      </Text>

      <View style={styles.doctorRow}>
        {loading ? (
          <View style={[styles.photo, styles.photoLoading]}>
            <ActivityIndicator size='small' color={theme.accent} />
          </View>
        ) : (
          <Image source={photoSource} style={[styles.photo, { backgroundColor: theme.accent }]} />
        )}
        <View style={styles.textCol}>
          <Text
            style={[
              styles.doctorName,
              { color: theme.textPrimary, fontFamily: fonts.semiBold },
            ]}
            numberOfLines={1}>
            {doctorName}
          </Text>
          <Text style={[styles.specialty, { color: theme.textSecondary }]} numberOfLines={1}>
            {specialty}
          </Text>
        </View>
      </View>

      {scheduleLabel ? (
        <View style={[styles.scheduleRow, { borderTopColor: theme.divider }]}>
          <Ionicons name='calendar-outline' size={18} color={theme.accent} />
          <Text style={[styles.scheduleText, { color: theme.textPrimary }]}>
            {scheduleLabel}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 16,
  },
  heading: {
    fontSize: 15,
    marginBottom: 12,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  photoLoading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  doctorName: {
    fontSize: 16,
  },
  specialty: {
    fontSize: 14,
    marginTop: 2,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  scheduleText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.medium,
  },
});
