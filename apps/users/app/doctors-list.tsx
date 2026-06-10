import { useCommonSymptom, useDoctors, Types } from '@repo/ui/graphql';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  DoctorListCard,
  FilterChipRow,
  ScreenHeader,
} from '../components/doctor';
import { fonts } from '../config/fonts';
import { useTheme } from '../config/theme';

const DEFAULT_DOCTOR_FILTERS = ['All', 'Neurology', 'Orthopedic', 'Cardiology'];
const DEFAULT_DOCTOR_IMAGE = require('../assets/images/user.png');

type DoctorListItem = {
  averageRating: number;
  consultationFee: number;
  doctorsSpecialties?: { specialty: { name: string } }[] | null;
  id: string;
  level?: Types.DoctorLevel | null;
  medicalSchool?: string | null;
  totalReviews: number;
  user: {
    firstName: string;
    lastName: string;
    profilePhoto?: string | null;
  };
};

const LEVEL_LABELS: Record<Types.DoctorLevel, string> = {
  CONSULTANT: 'Consultant',
  JUNIOR_RESIDENT: 'Junior Resident',
  MEDICAL_OFFICER: 'Medical Officer',
  SENIOR_RESIDENT: 'Senior Resident',
};

function getDoctorName(doctor: DoctorListItem) {
  const fullName = [doctor.user.firstName, doctor.user.lastName]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(' ');

  return fullName ? `Dr. ${fullName}` : 'Doctor';
}

function getDoctorSpecialty(doctor: DoctorListItem) {
  const names =
    doctor.doctorsSpecialties
      ?.map((entry) => entry.specialty.name)
      .filter(Boolean) ?? [];

  return names.length > 0 ? names[0] : 'General practice';
}

function getDoctorQualifications(doctor: DoctorListItem) {
  const specialty = getDoctorSpecialty(doctor);
  const parts: string[] = [];

  if (doctor.medicalSchool?.trim()) {
    parts.push(doctor.medicalSchool.trim());
  } else if (doctor.level) {
    parts.push(LEVEL_LABELS[doctor.level] ?? doctor.level);
  }

  if (specialty && specialty !== 'General practice') {
    return parts.length > 0
      ? `${parts.join(', ')} (${specialty})`
      : specialty;
  }

  return parts.join(', ') || 'Medical professional';
}

function getDoctorRating(doctor: DoctorListItem) {
  return `${doctor.averageRating.toFixed(1)} (${Math.round(doctor.totalReviews)})`;
}

function getDoctorPrice(doctor: DoctorListItem) {
  return `$${Math.round(doctor.consultationFee)}`;
}

function getDoctorImage(doctor: DoctorListItem) {
  return doctor.user.profilePhoto
    ? { uri: doctor.user.profilePhoto }
    : DEFAULT_DOCTOR_IMAGE;
}

function resolveInitialFilter(specialty?: string | string[]) {
  const value = Array.isArray(specialty) ? specialty[0] : specialty;
  if (!value || value === 'All') return 'All';
  if (DEFAULT_DOCTOR_FILTERS.includes(value)) return value;
  return value;
}

export default function DoctorsListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { specialty: specialtyParam, symptomId, symptomName } =
    useLocalSearchParams<{
      specialty?: string;
      symptomId?: string;
      symptomName?: string;
    }>();
  const activeSymptomId = Array.isArray(symptomId) ? symptomId[0] : symptomId;
  const activeSymptomName = Array.isArray(symptomName)
    ? symptomName[0]
    : symptomName;
  const isSymptomView = Boolean(activeSymptomId);
  const initialFilter = resolveInitialFilter(specialtyParam);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const [showFilters, setShowFilters] = useState(initialFilter !== 'All');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const doctorFilters = useMemo(() => {
    if (
      selectedFilter === 'All' ||
      DEFAULT_DOCTOR_FILTERS.includes(selectedFilter)
    ) {
      return DEFAULT_DOCTOR_FILTERS;
    }

    return [...DEFAULT_DOCTOR_FILTERS, selectedFilter];
  }, [selectedFilter]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const {
    doctors: allDoctors,
    loading: doctorsLoading,
    error: doctorsError,
  } = useDoctors({
    limit: 50,
    page: 1,
    skip: isSymptomView,
    filter: debouncedQuery ? { query: debouncedQuery } : undefined,
  });
  const {
    symptom,
    doctors: symptomDoctors,
    loading: symptomLoading,
    error: symptomError,
  } = useCommonSymptom(activeSymptomId, { skip: !isSymptomView });

  const loading = isSymptomView ? symptomLoading : doctorsLoading;
  const error = isSymptomView ? symptomError : doctorsError;
  const doctors = isSymptomView ? symptomDoctors : allDoctors;

  useEffect(() => {
    if (!isSymptomView) return;
    console.log(
      'getCommonSymptom response\n' +
        JSON.stringify(
          {
            symptomId: activeSymptomId,
            symptom,
            doctors: symptomDoctors,
            loading: symptomLoading,
            error: symptomError,
          },
          null,
          2, 
        ),
    );
  }, [
    activeSymptomId,
    isSymptomView,
    symptom,
    symptomDoctors,
    symptomLoading,
    symptomError,
  ]);

  const filteredDoctors = useMemo(() => {
    const ranked = [...doctors].sort(
      (left, right) => right.averageRating - left.averageRating,
    );

    if (isSymptomView || selectedFilter === 'All') {
      return ranked;
    }

    const normalizedFilter = selectedFilter.toLowerCase();

    return ranked.filter((doctor) => {
      const specialties =
        doctor.doctorsSpecialties
          ?.map((entry) => entry.specialty.name.toLowerCase())
          .filter(Boolean) ?? [];

      return specialties.some(
        (name) =>
          name.includes(normalizedFilter) || normalizedFilter.includes(name),
      );
    });
  }, [doctors, isSymptomView, selectedFilter]);

  const selectedChipIndex = doctorFilters.indexOf(selectedFilter);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top', 'bottom']}>
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps='handled'
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <ScreenHeader
              title={
                isSymptomView
                  ? activeSymptomName || symptom?.name || 'Symptom doctors'
                  : 'Doctors list'
              }
            />

            <View
              style={[
                styles.searchRow,
                { backgroundColor: theme.card },
              ]}>
              <Ionicons name='search' size={20} color={theme.textMuted} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder='Search by Doctor here'
                placeholderTextColor={theme.textMuted}
                style={[styles.searchInput, { color: theme.textPrimary }]}
                autoCapitalize='none'
                autoCorrect={false}
                returnKeyType='search'
              />
              <Pressable
                onPress={() => setShowFilters((prev) => !prev)}
                hitSlop={8}
                accessibilityRole='button'
                accessibilityLabel='Filter doctors'
                style={styles.filterBtn}>
                <Ionicons
                  name='options-outline'
                  size={22}
                  color={showFilters ? theme.accent : theme.textSecondary}
                />
              </Pressable>
            </View>

            {showFilters && !isSymptomView ? (
              <FilterChipRow
                labels={doctorFilters}
                selectedIndex={selectedChipIndex >= 0 ? selectedChipIndex : 0}
                onSelect={(index) => setSelectedFilter(doctorFilters[index])}
              />
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <DoctorListCard
            name={getDoctorName(item)}
            specialty={getDoctorSpecialty(item)}
            qualifications={getDoctorQualifications(item)}
            price={getDoctorPrice(item)}
            rating={getDoctorRating(item)}
            image={getDoctorImage(item)}
            favorited={!!favorites[item.id]}
            onPress={() =>
              router.push({
                pathname: '/doctor-details',
                params: { doctorId: item.id },
              })
            }
            onToggleFavorite={() =>
              setFavorites((prev) => ({
                ...prev,
                [item.id]: !prev[item.id],
              }))
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          loading ? (
            <View style={styles.statusContainer}>
              <ActivityIndicator size='large' color={theme.accent} />
            </View>
          ) : error ? (
            <View style={styles.statusContainer}>
              <Text style={[styles.statusText, { color: theme.textSecondary }]}>
                Unable to load doctors right now.
              </Text>
            </View>
          ) : (
            <View style={styles.statusContainer}>
              <Image
                source={require('../assets/images/emptyDept.png')}
                style={styles.emptyImage}
                resizeMode='contain'
              />
              <Text style={[styles.statusText, { color: theme.textSecondary }]}>
                {isSymptomView
                  ? `No doctors available for ${activeSymptomName || symptom?.name || 'this symptom'} yet.`
                  : debouncedQuery || selectedFilter !== 'All'
                    ? 'No doctors match your search.'
                    : 'No doctors available yet.'}
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    flexGrow: 1,
  },
  headerBlock: {
    paddingBottom: 16,
    gap: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 16,
    minHeight: 54,
    gap: 10,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.regular,
    paddingVertical: 14,
  },
  filterBtn: {
    paddingLeft: 4,
  },
  separator: {
    height: 12,
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
    paddingHorizontal: 16,
    gap: 12,
  },
  emptyImage: {
    width: 140,
    height: 140,
  },
  statusText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: 'center',
  },
});
