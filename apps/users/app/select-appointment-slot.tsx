import { useDoctorDetails } from '@repo/ui/graphql';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  BookingContextCard,
  BookingStepIndicator,
  DoctorTimeSlotPicker,
  PrimaryCtaButton,
  resolveRouteParam,
} from '../components/appointment';
import { ScreenHeader } from '../components/doctor';
import { useTheme } from '../config/theme';

const DEFAULT_DOCTOR_IMAGE = require('../assets/images/user.png');

export default function SelectAppointmentSlotScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams<{ doctorId?: string | string[] }>();
  const doctorId = resolveRouteParam(params.doctorId);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const { doctor, loading } = useDoctorDetails(doctorId, { skip: !doctorId });

  const { doctorName, specialty, photoSource } = useMemo(() => {
    const specialtyLabel =
      doctor?.doctorsSpecialties
        ?.map((entry) => entry.specialty.name)
        .filter(Boolean)
        .join(', ') || 'General practice';

    const name = doctor
      ? (() => {
          const fullName = [doctor.user.firstName, doctor.user.lastName]
            .filter((value): value is string => Boolean(value?.trim()))
            .join(' ');
          return fullName ? `Dr. ${fullName}` : 'Doctor';
        })()
      : 'Doctor';

    const photo = doctor?.user.profilePhoto
      ? { uri: doctor.user.profilePhoto }
      : DEFAULT_DOCTOR_IMAGE;

    return {
      doctorName: name,
      specialty: specialtyLabel,
      photoSource: photo,
    };
  }, [doctor]);

  const handleContinue = () => {
    if (!doctorId) {
      Alert.alert('Doctor unavailable', 'Please go back and choose a doctor again.');
      return;
    }
    if (!selectedSlotId) {
      Alert.alert('Select a time', 'Pick a date and time slot to continue.');
      return;
    }

    router.push({
      pathname: '/patient-details',
      params: {
        doctorId,
        doctorTimeSlotId: selectedSlotId,
      },
    });
  };

  if (!doctorId) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: theme.background }]}
        edges={['top']}>
        <View style={styles.centered}>
          <ScreenHeader title='Select time' />
          <ActivityIndicator size='large' color={theme.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top']}>
      <View style={styles.flex}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          <ScreenHeader title='Select time' />
          <BookingStepIndicator current='schedule' />

          <BookingContextCard
            doctorName={doctorName}
            specialty={specialty}
            photoSource={photoSource}
            loading={loading}
          />

          <DoctorTimeSlotPicker
            doctorId={doctorId}
            selectedSlotId={selectedSlotId}
            onSelectSlot={setSelectedSlotId}
          />

          <View style={{ height: 8 }} />
        </ScrollView>

        <SafeAreaView
          edges={['bottom']}
          style={[styles.footer, { backgroundColor: theme.background }]}>
          <PrimaryCtaButton
            label='Continue'
            disabled={!selectedSlotId}
            onPress={handleContinue}
          />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  centered: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
