import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  DepartmentIconItem,
  DoctorHorizontalCard,
  FilterChipRow,
  ScreenHeader,
  SectionTitle,
  SymptomIconItem,
} from '../../components/doctor';
import { SectionHeader } from '../../components/home';
import { useTheme } from '../../config/theme';

const DEPARTMENTS: { name: string; icon: string; bg: string }[] = [
  { name: 'Neurology', icon: 'brain', bg: '#86EFAC' },
  { name: 'Cardiology', icon: 'heart-pulse', bg: '#FDA4AF' },
  { name: 'Gynecology', icon: 'human-pregnant', bg: '#93C5FD' },
  { name: 'Pediatrics', icon: 'baby-face-outline', bg: '#C4B5FD' },
  { name: 'Allergy', icon: 'allergy', bg: '#7DD3FC' },
  { name: 'Dentist', icon: 'tooth-outline', bg: '#5EEAD4' },
  { name: 'Urology', icon: 'pill', bg: '#FCA5A5' },
  { name: 'Gastrology', icon: 'food-apple', bg: '#6EE7B7' },
  { name: 'Psychology', icon: 'head-cog-outline', bg: '#A5B4FC' },
  { name: 'Medicine', icon: 'pill-multiple', bg: '#F9A8D4' },
  { name: 'Oncology', icon: 'ribbon', bg: '#FBBF24' },
  { name: 'ENT', icon: 'ear-hearing', bg: '#67E8F9' },
];

const SYMPTOMS: { label: string; icon: string }[] = [
  { label: 'Fever', icon: 'thermometer' },
  { label: 'Cough', icon: 'weather-windy' },
  { label: 'Blood pressure', icon: 'heart-pulse' },
  { label: 'Diabetics', icon: 'water-outline' },
  { label: 'Headache', icon: 'lightning-bolt' },
  { label: 'Stomach pain', icon: 'bandage' },
  { label: 'Dizziness', icon: 'weather-windy' },
  { label: 'Eye problem', icon: 'eye-outline' },
];

const DOCTOR_FILTERS = ['All', 'Neurology', 'Orthopedic', 'Cardiology'];

const DOCTORS: {
  id: string;
  name: string;
  specialty: string;
  rating: string;
  uri: string;
}[] = [
  {
    id: 'd1',
    name: 'Dr. Sarah Chen',
    specialty: 'Cardiology Specialist',
    rating: '5.0 (150)',
    uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
  },
  {
    id: 'd2',
    name: 'Dr. James Wilson',
    specialty: 'Neurology Specialist',
    rating: '4.9 (89)',
    uri: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
  },
  {
    id: 'd3',
    name: 'Dr. Maria Garcia',
    specialty: 'Orthopedic Specialist',
    rating: '5.0 (210)',
    uri: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
  },
];

export default function DoctorTabScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [chipIndex, setChipIndex] = useState(3);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    d1: false,
    d2: true,
    d3: false,
  });

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        <ScreenHeader title='Departments' />

        <SectionTitle>Departments</SectionTitle>
        <View style={styles.grid}>
          {DEPARTMENTS.map((d) => (
            <DepartmentIconItem
              key={d.name}
              name={d.name}
              icon={d.icon}
              backgroundColor={d.bg}
              onPress={() => {}}
            />
          ))}
        </View>

        <SectionTitle>Common Symptoms</SectionTitle>
        <View style={styles.grid}>
          {SYMPTOMS.map((s) => (
            <SymptomIconItem
              key={s.label}
              label={s.label}
              icon={s.icon}
              backgroundColor={theme.surfaceMuted}
              onPress={() => {}}
            />
          ))}
        </View>

        <SectionHeader
          title='Top rated Doctors'
          onPressSeeAll={() => router.push('/make-appointment')}
        />
        <FilterChipRow
          labels={DOCTOR_FILTERS}
          selectedIndex={chipIndex}
          onSelect={setChipIndex}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.doctorRow}
          style={styles.doctorScroll}>
          {DOCTORS.map((d) => (
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

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  doctorScroll: {
    marginTop: 4,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  doctorRow: {
    flexDirection: 'row',
    paddingRight: 20,
  },
});
