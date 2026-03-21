import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ConsultationHero,
  type PatientChoice,
  PatientInfoSection,
  PaymentDetailsSection,
  PayWithRow,
  PrimaryCtaButton,
} from '../components/appointment';
import { DoctorHorizontalCard, ScreenHeader } from '../components/doctor';
import { useTheme } from '../config/theme';

const CAROUSEL_DOCTORS: {
  id: string;
  name: string;
  specialty: string;
  rating: string;
  uri: string;
}[] = [
  {
    id: 'd1',
    name: 'Dr. Jenny Watson',
    specialty: 'MBBS Doctor',
    rating: '4.9 (150)',
    uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
  },
  {
    id: 'd2',
    name: 'Dr. Alex Zender',
    specialty: 'Medicine Specialist',
    rating: '5.0 (150)',
    uri: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
  },
  {
    id: 'd3',
    name: 'Dr. Sarah Chen',
    specialty: 'Cardiology Specialist',
    rating: '5.0 (150)',
    uri: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
  },
];

const PATIENT_AVATAR = {
  uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
};

export default function MakeAppointmentScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [patient, setPatient] = useState<PatientChoice>('self');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top']}>
      <View style={styles.flex}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          nestedScrollEnabled>
          <ScreenHeader title='Make Appointment' />

          <ConsultationHero
            title='Instant Consultation for Dengue Fever'
            description='We will connect you one of the top rated doctor currently online.'
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            contentContainerStyle={styles.doctorRow}
            style={styles.doctorScroll}>
            {CAROUSEL_DOCTORS.map((d) => (
              <DoctorHorizontalCard
                key={d.id}
                name={d.name}
                specialty={d.specialty}
                rating={d.rating}
                image={{ uri: d.uri }}
                online
                favorited={!!favorites[d.id]}
                onToggleFavorite={() =>
                  setFavorites((prev) => ({ ...prev, [d.id]: !prev[d.id] }))
                }
              />
            ))}
          </ScrollView>

          <PatientInfoSection
            selected={patient}
            onSelect={setPatient}
            patientName='Zenifer Aniston'
            patientMeta='25yrs | 65 kg'
            avatar={PATIENT_AVATAR}
          />

          <PaymentDetailsSection
            lines={[
              { label: 'Consultation fee', value: '$100' },
              { label: 'VAT (5%)', value: '$5' },
            ]}
          />

          <PayWithRow
            maskedNumber='**** **** **** 3254'
            onPress={() => {
              /* open payment method picker */
            }}
          />

          <View style={{ height: 8 }} />
        </ScrollView>

        <SafeAreaView edges={['bottom']} style={[styles.footer, { backgroundColor: theme.background }]}>
          <PrimaryCtaButton label='Make Appointment' onPress={() => router.push('/payments')} />
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
  },
  doctorScroll: {
    marginHorizontal: -20,
    marginBottom: 8,
  },
  doctorRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingRight: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
