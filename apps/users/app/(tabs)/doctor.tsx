import { Hooks, useCommonSymptoms, useDepartments, useDoctors } from '@repo/ui/graphql';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
import {
  allergy,
  bloodPressure,
  brain,
  child,
  cough,
  diabetics,
  dizziness,
  eyeProblem,
  fever,
  headache,
  heart,
  kidney,
  lungs,
  medical,
  pregnacy,
  psycho,
  stomach,
  stomachPain,
  teeth,
  throat,
} from '@/config/svg';

const DEFAULT_DOCTOR_FILTERS = ['All', 'Neurology', 'Orthopedic', 'Cardiology'];
const DEFAULT_DOCTOR_IMAGE = require('../../assets/images/user.png');

type DoctorListItem = {
  averageRating: number;
  doctorsSpecialties?: { specialty: { name: string } }[] | null;
  id: string;
  isOnline: boolean;
  totalReviews: number;
  user: {
    firstName: string;
    lastName: string;
    profilePhoto?: string | null;
  };
};

type SpecialtyOption = {
  id: string;
  name: string;
};

type DepartmentListItem = {
  code: string;
  id: string;
  name: string;
  sortOrder?: number | null;
  specialties?: SpecialtyOption[] | null;
};

type DepartmentCardData = {
  bg: string;
  filterLabel: string;
  icon: string;
  id: string;
  name: string;
};

type SymptomCardData = {
  bg: string;
  icon: string;
  id: string;
  label: string;
};

const SYMPTOM_BG_PALETTE = [
  '#D0EED833',
  '#D0D6E733',
  '#9EBAE833',
  '#D6EEEA33',
  '#E9F0FF33',
  '#81818133',
];

function normalizeLabel(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ');
}

function resolveSpecialtyId(
  specialties: SpecialtyOption[],
  selectedLabel: string
) {
  if (selectedLabel === 'All') return undefined;

  const normalizedLabel = normalizeLabel(selectedLabel);
  const match = specialties.find((specialty) => {
    const normalizedName = normalizeLabel(specialty.name);
    return (
      normalizedName === normalizedLabel ||
      normalizedName.includes(normalizedLabel) ||
      normalizedLabel.includes(normalizedName)
    );
  });

  return match?.id;
}

function getDoctorName(doctor: DoctorListItem) {
  const fullName = [doctor.user.firstName, doctor.user.lastName]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(' ');

  return fullName || 'Doctor';
}

function getDoctorSpecialty(doctor: DoctorListItem) {
  const names =
    doctor.doctorsSpecialties
      ?.map((entry) => entry.specialty.name)
      .filter(Boolean) ?? [];

  return names.length > 0 ? names.join(', ') : 'General practice';
}

function getDoctorRating(doctor: DoctorListItem) {
  return `${doctor.averageRating.toFixed(1)} (${Math.round(doctor.totalReviews)})`;
}

function getDoctorImage(doctor: DoctorListItem) {
  return doctor.user.profilePhoto
    ? { uri: doctor.user.profilePhoto }
    : DEFAULT_DOCTOR_IMAGE;
}

function getDepartmentUi(department: DepartmentListItem) {
  const keys = [
    normalizeLabel(department.code),
    normalizeLabel(department.name),
  ];

  if (keys.some((key) => key.includes('neuro'))) {
    return { icon: brain, bg: '#30BE4533' };
  }
  if (keys.some((key) => key.includes('cardio'))) {
    return { icon: heart, bg: '#FF5B6E33' };
  }
  if (keys.some((key) => key.includes('gyn') || key.includes('obstet'))) {
    return { icon: pregnacy, bg: '#FFBDBC33' };
  }
  if (keys.some((key) => key.includes('pedia') || key.includes('child'))) {
    return { icon: child, bg: '#FC939333' };
  }
  if (keys.some((key) => key.includes('allerg'))) {
    return { icon: allergy, bg: '#34459033' };
  }
  if (keys.some((key) => key.includes('dent'))) {
    return { icon: teeth, bg: '#50BE9F33' };
  }
  if (keys.some((key) => key.includes('uro'))) {
    return { icon: kidney, bg: '#842F3B33' };
  }
  if (keys.some((key) => key.includes('gastro') || key.includes('stomach'))) {
    return { icon: stomach, bg: '#18989133' };
  }
  if (keys.some((key) => key.includes('psych'))) {
    return { icon: psycho, bg: '#34459033' };
  }
  if (keys.some((key) => key.includes('onco') || key.includes('pulm'))) {
    return { icon: lungs, bg: '#842F3B33' };
  }
  if (
    keys.some(
      (key) =>
        key === 'ent' ||
        key.includes('ear nose throat') ||
        key.includes('otolaryng')
    )
  ) {
    return { icon: throat, bg: '#18989133' };
  }

  return { icon: medical, bg: '#50BE9F33' };
}

function getSymptomUi(name: string, index: number) {
  const key = normalizeLabel(name);

  if (key.includes('fever')) {
    return { icon: fever, bg: SYMPTOM_BG_PALETTE[0] };
  }
  if (key.includes('cough')) {
    return { icon: cough, bg: SYMPTOM_BG_PALETTE[1] };
  }
  if (key.includes('blood') || key.includes('pressure')) {
    return { icon: bloodPressure, bg: SYMPTOM_BG_PALETTE[2] };
  }
  if (key.includes('diabet')) {
    return { icon: diabetics, bg: SYMPTOM_BG_PALETTE[3] };
  }
  if (key.includes('headache') || key.includes('head ache')) {
    return { icon: headache, bg: SYMPTOM_BG_PALETTE[4] };
  }
  if (key.includes('stomach') || key.includes('abdominal')) {
    return { icon: stomachPain, bg: SYMPTOM_BG_PALETTE[0] };
  }
  if (key.includes('dizz')) {
    return { icon: dizziness, bg: SYMPTOM_BG_PALETTE[1] };
  }
  if (key.includes('eye') || key.includes('vision')) {
    return { icon: eyeProblem, bg: SYMPTOM_BG_PALETTE[5] };
  }
  if (key.includes('throat')) {
    return { icon: throat, bg: SYMPTOM_BG_PALETTE[3] };
  }
  if (key.includes('heart') || key.includes('chest')) {
    return { icon: heart, bg: SYMPTOM_BG_PALETTE[2] };
  }

  return {
    icon: medical,
    bg: SYMPTOM_BG_PALETTE[index % SYMPTOM_BG_PALETTE.length],
  };
}

function getDepartmentFilterLabel(department: DepartmentListItem) {
  const specialties = department.specialties ?? [];
  const exactMatch = specialties.find(
    (specialty) =>
      normalizeLabel(specialty.name) === normalizeLabel(department.name)
  );

  return exactMatch?.name ?? specialties[0]?.name ?? department.name;
}

export default function DoctorTabScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [selectedSpecialtyLabel, setSelectedSpecialtyLabel] =
    useState<string>('All');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const {
    departments,
    loading: departmentsLoading,
    error: departmentsError,
  } = useDepartments();
  const {
    symptoms,
    loading: symptomsLoading,
    error: symptomsError,
  } = useCommonSymptoms();
  const { data: specialtiesData, loading: specialtiesLoading } =
    Hooks.useGetSpecialtiesQuery({
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    });
  const selectedSpecialtyId = useMemo(
    () =>
      resolveSpecialtyId(
        specialtiesData?.getSpecialties ?? [],
        selectedSpecialtyLabel
      ),
    [selectedSpecialtyLabel, specialtiesData]
  );
  const waitForSpecialtyMatch =
    selectedSpecialtyLabel !== 'All' &&
    specialtiesLoading &&
    !selectedSpecialtyId;
  const { doctors, loading, error } = useDoctors({
    limit: 10,
    page: 1,
    skip: waitForSpecialtyMatch,
    filter: selectedSpecialtyId
      ? {
          specialtyId: selectedSpecialtyId,
        }
      : undefined,
  });

  useEffect(() => {
    console.log(
      'getDoctors response\n' +
        JSON.stringify(
          {
            doctors,
            loading,
            error,
            selectedSpecialtyId,
            selectedSpecialtyLabel,
          },
          null,
          2
        )
    );
  }, [doctors, loading, error, selectedSpecialtyId, selectedSpecialtyLabel]);

  useEffect(() => {
    console.log(
      'getDepartments response\n' +
        JSON.stringify(
          {
            departments,
            loading: departmentsLoading,
            error: departmentsError,
          },
          null,
          2
        )
    );
  }, [departments, departmentsLoading, departmentsError]);

  useEffect(() => {
    console.log(
      'getCommonSymptoms response\n' +
        JSON.stringify(
          {
            symptoms,
            loading: symptomsLoading,
            error: symptomsError,
          },
          null,
          2,
        ),
    );
  }, [symptoms, symptomsLoading, symptomsError]);

  const symptomCards = useMemo((): SymptomCardData[] => {
    return symptoms.map((symptom, index) => {
      const ui = getSymptomUi(symptom.name, index);
      return {
        id: symptom.id,
        label: symptom.name,
        icon: ui.icon,
        bg: ui.bg,
      };
    });
  }, [symptoms]);

  const rankedDoctors = useMemo(() => {
    if (selectedSpecialtyLabel !== 'All' && !selectedSpecialtyId) {
      return [];
    }

    return [...doctors].sort((left, right) => right.averageRating - left.averageRating);
  }, [doctors, selectedSpecialtyId, selectedSpecialtyLabel]);
  const departmentCards = useMemo((): DepartmentCardData[] => {
    return [...departments]
      .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0))
      .map((department) => ({
      ...getDepartmentUi(department),
      filterLabel: getDepartmentFilterLabel(department),
      id: department.id,
      name: department.name,
      }));
  }, [departments]);
  const doctorFilters = useMemo(() => {
    if (
      selectedSpecialtyLabel === 'All' ||
      DEFAULT_DOCTOR_FILTERS.includes(selectedSpecialtyLabel)
    ) {
      return DEFAULT_DOCTOR_FILTERS;
    }

    return [...DEFAULT_DOCTOR_FILTERS, selectedSpecialtyLabel];
  }, [selectedSpecialtyLabel]);
  const selectedChipIndex = doctorFilters.indexOf(selectedSpecialtyLabel);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        <ScreenHeader title='Departments'/>

        <SectionTitle>Departments</SectionTitle>
        {departmentsLoading ? (
          <View style={styles.departmentStatusContainer}>
            <ActivityIndicator size='small' color={theme.accent} />
          </View>
        ) : departmentsError ? (
          <View style={styles.departmentStatusContainer}>
            <Text style={[styles.statusText, { color: theme.textSecondary }]}>
              Unable to load departments right now.
            </Text>
          </View>
        ) : departmentCards.length === 0 ? (
          <View style={styles.departmentStatusContainer}>
            <Image
              source={require('../../assets/images/emptyDept.png')}
              style={styles.departmentEmptyImage}
              resizeMode='contain'
            />
            <Text style={[styles.statusText, { color: theme.textSecondary }]}>
              No departments available yet.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {departmentCards.map((department) => (
              <DepartmentIconItem
                key={department.id}
                name={department.name}
                icon={department.icon}
                backgroundColor={department.bg}
                onPress={() => setSelectedSpecialtyLabel(department.filterLabel)}
              />
            ))}
          </View>
        )}

        <SectionTitle>Common Symptoms</SectionTitle>
        {symptomsLoading ? (
          <View style={styles.departmentStatusContainer}>
            <ActivityIndicator size='small' color={theme.accent} />
          </View>
        ) : symptomsError ? (
          <View style={styles.departmentStatusContainer}>
            <Text style={[styles.statusText, { color: theme.textSecondary }]}>
              Unable to load symptoms right now.
            </Text>
          </View>
        ) : symptomCards.length === 0 ? (
          <View style={styles.departmentStatusContainer}>
            <Text style={[styles.statusText, { color: theme.textSecondary }]}>
              No symptoms available yet.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {symptomCards.map((symptom) => (
              <SymptomIconItem
                key={symptom.id}
                label={symptom.label}
                icon={symptom.icon}
                backgroundColor={symptom.bg}
                onPress={() =>
                  router.push({
                    pathname: '/doctors-list',
                    params: {
                      symptomId: symptom.id,
                      symptomName: symptom.label,
                    },
                  })
                }
              />
            ))}
          </View>
        )}

        <SectionHeader
          title='Top rated Doctors'
          onPressSeeAll={() =>
            router.push({
              pathname: '/doctors-list',
              params:
                selectedSpecialtyLabel !== 'All'
                  ? { specialty: selectedSpecialtyLabel }
                  : undefined,
            })
          }
        />
        <FilterChipRow
          labels={doctorFilters}
          selectedIndex={selectedChipIndex}
          onSelect={(index) => setSelectedSpecialtyLabel(doctorFilters[index])}
        />

        {loading || waitForSpecialtyMatch ? (
          <View style={styles.statusContainer}>
            <ActivityIndicator size='large' color={theme.accent} />
          </View>
        ) : error ? (
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: theme.textSecondary }]}>
              Unable to load doctors right now.
            </Text>
          </View>
        ) : rankedDoctors.length === 0 ? (
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: theme.textSecondary }]}>
              No doctors available for {selectedSpecialtyLabel.toLowerCase()} yet.
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.doctorRow}
            style={styles.doctorScroll}>
            {rankedDoctors.map((doctor) => (
              <DoctorHorizontalCard
                key={doctor.id}
                name={getDoctorName(doctor)}
                specialty={getDoctorSpecialty(doctor)}
                rating={getDoctorRating(doctor)}
                image={getDoctorImage(doctor)}
                online={doctor.isOnline}
                favorited={!!favorites[doctor.id]}
                onPress={() =>
                  router.push({
                    pathname: '/doctor-details',
                    params: { doctorId: doctor.id },
                  })
                }
                onToggleFavorite={() =>
                  setFavorites((prev) => ({
                    ...prev,
                    [doctor.id]: !prev[doctor.id],
                  }))
                }
              />
            ))}
          </ScrollView>
        )}

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
  departmentStatusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 88,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  departmentEmptyImage: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 192,
    paddingHorizontal: 16,
  },
  statusText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
