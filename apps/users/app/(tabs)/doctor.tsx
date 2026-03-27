import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
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
import { allergy, bloodPressure, brain, child, cough, diabetics, dizziness, eyeProblem, fever, headache, heart, kidney, lungs, medical, pregnacy, psycho, stomach, stomachPain, teeth, throat } from '@/config/svg';





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
  const colorScheme = useColorScheme();
  const [chipIndex, setChipIndex] = useState(3);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    d1: false,
    d2: true,
    d3: false,
  });

  const DEPARTMENTS: { name: string; icon: string; bg: string }[] = [
    { name: 'Neurology', icon: brain, bg: colorScheme === "dark" ? "#30BE4533" :  "#30BE4533"}, 
    { name: 'Cardiology', icon: heart, bg: colorScheme === "dark" ? "#FF5B6E33" :  "#FF5B6E33" },
    { name: 'Gynecology', icon: pregnacy, bg: colorScheme === "dark" ? "#FFBDBC33" :  "#FFBDBC33"},
    { name: 'Pediatrics', icon: child, bg: colorScheme === "dark" ? "#FC939333" :  "#FC939333"},
    { name: 'Allergy', icon: allergy, bg: colorScheme === "dark" ? "#34459033" :  "#34459033"},
    { name: 'Dentist', icon: teeth, bg: colorScheme === "dark" ? "#50BE9F33" :  "#50BE9F33"},
    { name: 'Urology', icon: kidney, bg: colorScheme === "dark" ? "#842F3B33" :  "#842F3B33"},
    { name: 'Gastrology', icon: stomach, bg: colorScheme === "dark" ? "#18989133" :  "#18989133"},
    { name: 'Psychology', icon: psycho, bg: colorScheme === "dark" ? "#34459033" :  "#34459033" },
    { name: 'Medicine', icon: medical , bg: colorScheme === "dark" ? "#50BE9F33" :  "#50BE9F33" },
    { name: 'Oncology', icon: lungs, bg: colorScheme === "dark" ? "#842F3B33" :  "#842F3B33" },
    { name: 'ENT', icon: throat, bg: colorScheme === "dark" ? "#18989133" :  "#18989133" },
  ];

  const SYMPTOMS: { label: string; icon: string, bg: string}[] = [
    { label: 'Fever', icon: fever, bg: colorScheme === "dark" ? "#D0EED833" :  "#D0EED833" },
    { label: 'Cough', icon: cough, bg: colorScheme === "dark" ? "#D0D6E733" :  "#D0D6E733" },
    { label: 'Blood pressure', icon: bloodPressure, bg: colorScheme === "dark" ? "#E9F0FF33" : "#9EBAE833" },
    { label: 'Diabetics', icon: diabetics, bg: colorScheme === "dark" ? "#D6EEEA33" :  "#D6EEEA33" },
    { label: 'Headache', icon: headache , bg: colorScheme === "dark" ? "#E9F0FF33" :  "#E9F0FF33" },
    { label: 'Stomach pain', icon: stomachPain, bg: colorScheme === "dark" ? "#D0EED833" :  "#D0EED833" },
    { label: 'Dizziness', icon: dizziness , bg: colorScheme === "dark" ? "#D0D6E733" :  "#D0D6E733" },
    { label: 'Eye problem', icon: eyeProblem, bg: colorScheme === "dark" ? "#81818133" :  "#D0EED833" },
  ];

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colorScheme === "dark" ? "#1E293B" : "#F8FAFC" }]}
      edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        <ScreenHeader title='Departments'/>

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
              backgroundColor={s.bg}
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
