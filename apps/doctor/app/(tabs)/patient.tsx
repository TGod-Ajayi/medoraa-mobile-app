import { fonts } from '@/config/fonts';
import { calendarDoctor } from '@/config/svg';
import { useTheme } from '@/config/theme';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import {
  usePatientLazy,
  usePatients,
  type DoctorPatient,
  type PatientDetail,
} from '@repo/ui/graphql';
import { useBottomSheetInsets } from '@repo/ui/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  type ImageSourcePropType,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

const DEFAULT_AVATAR = require('../../assets/images/medical1.png');
const EMPTY_PATIENTS_IMAGE = require('../../assets/images/emptyDept.png');

type PatientListItem = {
  id: string;
  name: string;
  meta: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  avatar: ImageSourcePropType;
};

const TABS = ['All patients', 'Pending', 'Past'] as const;

function formatPatientDate(iso: string): string {
  try {
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return '—';
  }
}

function getPatientDisplayName(user: DoctorPatient['user']) {
  return [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || 'Patient';
}

function getPatientMeta(user: DoctorPatient['user']) {
  const parts: string[] = [];

  if (user.dateOfBirth) {
    const dob = new Date(user.dateOfBirth);
    if (!Number.isNaN(dob.getTime())) {
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDelta = today.getMonth() - dob.getMonth();
      if (
        monthDelta < 0 ||
        (monthDelta === 0 && today.getDate() < dob.getDate())
      ) {
        age -= 1;
      }
      if (age >= 0) parts.push(`${age} yrs`);
    }
  }

  if (user.gender === 'MALE') parts.push('Male');
  if (user.gender === 'FEMALE') parts.push('Female');

  return parts.length > 0 ? parts.join(' · ') : 'Patient';
}

function getPatientAvatar(profilePhoto?: string | null): ImageSourcePropType {
  return profilePhoto ? { uri: profilePhoto } : DEFAULT_AVATAR;
}

function mapApiPatient(patient: DoctorPatient): PatientListItem {
  const { user } = patient;

  return {
    id: patient.id,
    name: getPatientDisplayName(user),
    meta: getPatientMeta(user),
    email: user.email,
    phone: user.phoneNumber?.trim() || '—',
    createdAt: patient.createdAt,
    updatedAt: patient.updatedAt,
    avatar: getPatientAvatar(user.profilePhoto),
  };
}

function formatEnumLabel(value?: string | null): string {
  if (!value) return '—';
  return value.replace(/_/g, ' ');
}

function calculateBmi(
  weightKg?: number | null,
  heightCm?: number | null,
): string {
  if (!weightKg || !heightCm || heightCm <= 0) return '—';
  const heightM = heightCm / 100;
  return (weightKg / (heightM * heightM)).toFixed(1);
}

function buildPatientVitals(patient: PatientDetail | null) {
  if (!patient) return [];

  const items: { label: string; value: string }[] = [];

  if (patient.heightCm != null) {
    items.push({ label: 'Height', value: `${patient.heightCm} cm` });
  }
  if (patient.weightKg != null) {
    items.push({ label: 'Weight', value: `${patient.weightKg} kg` });
  }

  const bmi = calculateBmi(patient.weightKg, patient.heightCm);
  if (bmi !== '—') {
    items.push({ label: 'BMI', value: bmi });
  }
  if (patient.bloodGroup) {
    items.push({
      label: 'Blood group',
      value: formatEnumLabel(patient.bloodGroup),
    });
  }
  if (patient.genotype) {
    items.push({ label: 'Genotype', value: patient.genotype });
  }

  return items;
}

function formatPatientAddress(patient: PatientDetail | null): string {
  if (!patient) return '—';

  const parts = [
    patient.address,
    patient.city,
    patient.state,
    patient.country,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : '—';
}

export default function PatientsScreen() {
  const theme = useTheme();
  const { bottomInset, contentPaddingBottom } = useBottomSheetInsets();
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]>('All patients');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(
    null,
  );
  const [selectedPatient, setSelectedPatient] = useState<PatientListItem | null>(
    null,
  );
  const notesSheetRef = useRef<BottomSheetModal>(null);
  const profileSheetRef = useRef<BottomSheetModal>(null);
  const notesSnapPoints = useMemo(() => ['55%'], []);
  const profileSnapPoints = useMemo(() => ['90%'], []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [query]);

  const { patients: apiPatients, loading, error, refetch } = usePatients({
    limit: 50,
    page: 1,
    filter: debouncedQuery ? { query: debouncedQuery } : undefined,
  });

  const {
    fetchPatient,
    patient: patientDetail,
    loading: patientDetailLoading,
    error: patientDetailError,
  } = usePatientLazy();

  const patients = useMemo(
    () => apiPatients.map(mapApiPatient),
    [apiPatients],
  );

  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const openNotesSheet = useCallback((patient: PatientListItem) => {
    setSelectedPatient(patient);
    notesSheetRef.current?.present();
  }, []);

  const openProfileSheet = useCallback(
    (patient: PatientListItem) => {
      setSelectedPatient(patient);
      profileSheetRef.current?.present();
      void fetchPatient({ variables: { id: patient.id } });
    },
    [fetchPatient],
  );

  const profileVitals = useMemo(
    () => buildPatientVitals(patientDetail),
    [patientDetail],
  );

  const profileUser = patientDetail?.user;
  const profileName = profileUser
    ? getPatientDisplayName(profileUser)
    : (selectedPatient?.name ?? 'Patient');
  const profileMeta = profileUser
    ? getPatientMeta(profileUser)
    : (selectedPatient?.meta ?? '—');
  const profileAvatar = profileUser
    ? getPatientAvatar(profileUser.profilePhoto)
    : (selectedPatient?.avatar ?? DEFAULT_AVATAR);
  const profileEmail =
    profileUser?.email ?? selectedPatient?.email ?? '—';
  const profilePhone =
    profileUser?.phoneNumber?.trim() ||
    selectedPatient?.phone ||
    '—';
  const profileCreatedAt =
    patientDetail?.createdAt ?? selectedPatient?.createdAt;
  const profileUpdatedAt =
    patientDetail?.updatedAt ?? selectedPatient?.updatedAt;

  const renderBackdrop = (
    props: React.ComponentProps<typeof BottomSheetBackdrop>,
  ) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.35}
    />
  );

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}>
      <View style={styles.root}>
        {/* Title */}
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Patients
        </Text>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {TABS.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <Pressable
                key={tab}
                style={styles.tabItem}
                onPress={() => setActiveTab(tab)}>
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isActive ? theme.accent : theme.textMuted,
                    },
                  ]}>
                  {tab}
                </Text>
                {isActive ? (
                  <View
                    style={[
                      styles.tabUnderline,
                      { backgroundColor: theme.accent },
                    ]}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {/* Search bar */}
        <View
          style={[
            styles.searchContainer,
            {
              borderColor: theme.divider,
              backgroundColor: theme.card,
            },
          ]}>
          <Ionicons
            name="search-outline"
            size={20}
            color={theme.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search by patient"
            placeholderTextColor={theme.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            underlineColorAndroid="transparent"
            textAlignVertical="center"
            style={[styles.searchInput, { color: theme.textPrimary }]}
          />
        </View>

        {/* List */}
        {loading && patients.length === 0 ? (
          <View style={styles.centeredState}>
            <ActivityIndicator size="large" color={theme.accent} />
          </View>
        ) : error ? (
          <View style={styles.centeredState}>
            <Text style={[styles.stateText, { color: theme.textSecondary }]}>
              Could not load patients.
            </Text>
            <Pressable
              onPress={() => refetch()}
              style={[styles.retryBtn, { borderColor: theme.accent }]}>
              <Text style={[styles.retryBtnText, { color: theme.accent }]}>
                Try again
              </Text>
            </Pressable>
          </View>
        ) : patients.length === 0 ? (
          <View style={styles.centeredState}>
            <Image
              source={EMPTY_PATIENTS_IMAGE}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
              {debouncedQuery ? 'No patients found' : 'No patient found for doctor'}
            </Text>
            <Text style={[styles.stateText, { color: theme.textSecondary }]}>
              {debouncedQuery
                ? 'Try a different name, email, or phone number.'
                : 'Patients linked to your practice will appear here.'}
            </Text>
          </View>
        ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isExpanded = expandedPatientId === item.id;

            return (
              <View
                style={[
                  styles.cardWrapper,
                  isExpanded && styles.cardWrapperExpanded,
                ]}>
                <Pressable
                  style={[styles.card, { backgroundColor: theme.card }]}
                  onPress={() => {
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut,
                    );
                    setExpandedPatientId((prev) =>
                      prev === item.id ? null : item.id,
                    );
                  }}>
                  <View style={styles.cardLeft}>
                    <Image source={item.avatar} style={styles.avatar} />
                    <View style={styles.cardTextWrap}>
                      <Text
                        style={[styles.cardName, { color: theme.textPrimary }]}>
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          styles.cardMeta,
                          { color: theme.textSecondary },
                        ]}>
                        {item.meta}
                      </Text>
                    </View>
                  </View>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-forward'}
                    size={20}
                    color={theme.textMuted}
                  />
                </Pressable>

                {isExpanded ? (
                  <View
                    style={[
                      styles.detailCard,
                      { backgroundColor: theme.card },
                    ]}>
                    <View style={styles.detailRow}>
                      <View style={styles.detailBox}>
                        <View style={styles.detailBoxHeader}>
                          <SvgXml xml={calendarDoctor} />
                          <Text
                            style={[
                              styles.detailLabel,
                              { color: theme.textSecondary },
                            ]}>
                            Last appointment
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.detailDate,
                            { color: theme.textPrimary },
                          ]}>
                          {formatPatientDate(item.updatedAt)}
                        </Text>
                      </View>

                      <View style={styles.detailBox}>
                        <View style={styles.detailBoxHeader}>
                          <Ionicons
                            name="time-outline"
                            size={18}
                            color="#22C55E"
                          />
                          <Text
                            style={[
                              styles.detailLabel,
                              { color: theme.textSecondary },
                            ]}>
                            Registered
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.detailDate,
                            { color: theme.textPrimary },
                          ]}>
                          {formatPatientDate(item.createdAt)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.contactSection}>
                      <Text
                        style={[
                          styles.contactTitle,
                          { color: theme.textPrimary },
                        ]}>
                        Contact Information
                      </Text>

                      <View style={styles.contactRow}>
                        <Ionicons
                          name="call-outline"
                          size={18}
                          color={theme.textSecondary}
                        />
                        <Text
                          style={[
                            styles.contactValue,
                            { color: theme.textSecondary },
                          ]}>
                          {item.phone}
                        </Text>
                      </View>

                      <View style={styles.contactRow}>
                        <Ionicons
                          name="mail-outline"
                          size={18}
                          color={theme.textSecondary}
                        />
                        <Text
                          style={[
                            styles.contactValue,
                            { color: theme.textSecondary },
                          ]}>
                          {item.email}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailButtonsRow}>
                      <Pressable
                        style={[
                          styles.outlineButton,
                          { borderColor: "#4CCBC6" },
                        ]}
                        onPress={() => openProfileSheet(item)}>
                        <Text
                          style={[
                            styles.outlineButtonText,
                            { color: theme.accent },
                          ]}>
                          View profile
                        </Text>
                      </Pressable>
                      <Pressable
                        style={[
                          styles.filledButton,
                          { backgroundColor: "#20BEB8" },
                        ]}
                        onPress={() => openNotesSheet(item)}>
                        <Text
                          style={[styles.filledButtonText, { color: '#fff' }]}>
                          Consultation Notes
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ) : null}
              </View>
            );
          }}
        />
        )}
      </View>
      <BottomSheetModal
        ref={notesSheetRef}
        index={0}
        snapPoints={notesSnapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        bottomInset={bottomInset}
        handleIndicatorStyle={styles.sheetHandle}
        backgroundStyle={[styles.sheetContainer, { backgroundColor: theme.card }]}>
        <BottomSheetView
          style={[styles.sheetContent, { paddingBottom: contentPaddingBottom }]}>
          <Text style={[styles.sheetTitle, { color: theme.textPrimary }]}>
            Consultation notes
          </Text>

          <View style={styles.noteCard}>
            <Text style={[styles.noteTitle, { color: theme.textPrimary }]}>
              Getting better
            </Text>
            <Text style={[styles.noteBody, { color: theme.textSecondary }]}>
              Patient reports improved glucose control. A1C decreased from 7.2 to 6.8.
              Maintaining current medication regimen. Encouraged continued dietary
              compliance and regular exercise.
            </Text>
            <View style={styles.noteFooter}>
              <View style={styles.noteDateRow}>
              <SvgXml xml={calendarDoctor} />
                <Text
                  style={[styles.noteDate, { color: theme.textSecondary }]}>
                  26-11-2024
                </Text>
              </View>
              <Pressable style={styles.notePrimaryButton}>
                <Text style={styles.notePrimaryButtonText}>View Full Note</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.noteCard}>
            <Text style={[styles.noteTitle, { color: theme.textPrimary }]}>
              Getting better
            </Text>
            <Text style={[styles.noteBody, { color: theme.textSecondary }]}>
              Patient reports improved glucose control. A1C decreased from 7.2 to 6.8.
              Maintaining current medication regimen. Encouraged continued dietary
              compliance and regular exercise.
            </Text>
            <View style={styles.noteFooter}>
              <View style={styles.noteDateRow}>
                <SvgXml xml={calendarDoctor} />
                <Text
                  style={[styles.noteDate, { color: theme.textSecondary }]}>
                  26-5-2024
                </Text>
              </View>
              <Pressable style={styles.notePrimaryButton}>
                <Text style={styles.notePrimaryButtonText}>View Full Note</Text>
              </Pressable>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
      <BottomSheetModal
        ref={profileSheetRef}
        index={0}
        snapPoints={profileSnapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        bottomInset={bottomInset}
        handleIndicatorStyle={styles.sheetHandle}
        backgroundStyle={[
          styles.sheetContainer,
          { backgroundColor: theme.background },
        ]}>
        <BottomSheetScrollView
          contentContainerStyle={[
            styles.profileSheetContent,
            { paddingBottom: contentPaddingBottom },
          ]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.profileTop}>
            <Text style={[styles.profileHeaderTitle, { color: theme.textPrimary }]}>
              Patient profile
            </Text>
            <Image source={profileAvatar} style={styles.profileAvatar} />
            <Text style={[styles.profileName, { color: theme.textPrimary }]}>
              {profileName}
            </Text>
            <Text style={[styles.profileMeta, { color: theme.textSecondary }]}>
              {profileMeta}
            </Text>
          </View>

          {patientDetailLoading && !patientDetail ? (
            <ActivityIndicator color={theme.accent} style={styles.profileLoader} />
          ) : null}

          {patientDetailError ? (
            <Text style={[styles.profileError, { color: theme.textSecondary }]}>
              Could not load full profile. Showing basic details.
            </Text>
          ) : null}

          <View style={[styles.profileStatsCard, { backgroundColor: theme.card }]}>
            <View style={styles.detailRow}>
              <View style={styles.detailBox}>
                <View style={styles.detailBoxHeader}>
                  <SvgXml xml={calendarDoctor} />
                  <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                    Last appointment
                  </Text>
                </View>
                <Text style={[styles.detailDate, { color: theme.textPrimary }]}>
                  {profileUpdatedAt
                    ? formatPatientDate(profileUpdatedAt)
                    : '—'}
                </Text>
              </View>
              <View style={styles.detailBox}>
                <View style={styles.detailBoxHeader}>
                  <Ionicons name="time-outline" size={18} color="#22C55E" />
                  <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                    Registered
                  </Text>
                </View>
                <Text style={[styles.detailDate, { color: theme.textPrimary }]}>
                  {profileCreatedAt
                    ? formatPatientDate(profileCreatedAt)
                    : '—'}
                </Text>
              </View>
            </View>

            <View style={styles.profileActions}>
              <Pressable style={[styles.fullPrimaryBtn, { backgroundColor: '#20BEB8' }]}>
                <Text style={styles.fullPrimaryBtnText}>Schedule consultation</Text>
              </Pressable>
              <Pressable style={[styles.fullOutlineBtn, { borderColor: '#20BEB8' }]}>
                <Text style={[styles.fullOutlineBtnText, { color: '#20BEB8' }]}>Message patient</Text>
              </Pressable>
            </View>
          </View>

          {profileVitals.length > 0 ? (
            <View style={[styles.profileSectionCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.profileSectionTitle, { color: theme.textPrimary }]}>
                Vital signs
              </Text>
              <View style={styles.vitalsGrid}>
                {profileVitals.map((vital) => (
                  <View key={vital.label} style={styles.vitalItem}>
                    <Text style={[styles.vitalValue, { color: theme.textPrimary }]}>
                      {vital.value}
                    </Text>
                    <Text style={[styles.vitalLabel, { color: theme.textSecondary }]}>
                      {vital.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {patientDetail?.allergies && patientDetail.allergies.length > 0 ? (
            <View style={[styles.profileSectionCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.profileSectionTitle, { color: theme.textPrimary }]}>
                Allergies
              </Text>
              {patientDetail.allergies.map((allergy) => (
                <Text
                  key={allergy}
                  style={[styles.profileListItem, { color: theme.textSecondary }]}>
                  • {allergy}
                </Text>
              ))}
            </View>
          ) : null}

          {patientDetail?.currentMedications &&
          patientDetail.currentMedications.length > 0 ? (
            <View style={[styles.profileSectionCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.profileSectionTitle, { color: theme.textPrimary }]}>
                Current medications
              </Text>
              {patientDetail.currentMedications.map((medication) => (
                <Text
                  key={medication}
                  style={[styles.profileListItem, { color: theme.textSecondary }]}>
                  • {medication}
                </Text>
              ))}
            </View>
          ) : null}

          {patientDetail?.chronicConditions &&
          patientDetail.chronicConditions.length > 0 ? (
            <View style={[styles.profileSectionCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.profileSectionTitle, { color: theme.textPrimary }]}>
                Chronic conditions
              </Text>
              {patientDetail.chronicConditions.map((condition) => (
                <Text
                  key={condition}
                  style={[styles.profileListItem, { color: theme.textSecondary }]}>
                  • {condition}
                </Text>
              ))}
            </View>
          ) : null}

          <View style={[styles.profileSectionCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.profileSectionTitle, { color: theme.textPrimary }]}>
              Contact Information
            </Text>
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={18} color={theme.textSecondary} />
              <Text style={[styles.contactValue, { color: theme.textSecondary }]}>
                {profilePhone}
              </Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="mail-outline" size={18} color={theme.textSecondary} />
              <Text style={[styles.contactValue, { color: theme.textSecondary }]}>
                {profileEmail}
              </Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="location-outline" size={18} color={theme.textSecondary} />
              <Text style={[styles.contactValue, { color: theme.textSecondary }]}>
                {formatPatientAddress(patientDetail)}
              </Text>
            </View>
          </View>

          {patientDetail?.emergencyContactName ||
          patientDetail?.emergencyContactPhone ? (
            <View style={[styles.profileSectionCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.profileSectionTitle, { color: theme.textPrimary }]}>
                Emergency contact
              </Text>
              {patientDetail.emergencyContactName ? (
                <Text style={[styles.emergencyText, { color: theme.textPrimary }]}>
                  {patientDetail.emergencyContactName}
                  {patientDetail.emergencyContactRelationship
                    ? ` (${patientDetail.emergencyContactRelationship})`
                    : ''}
                </Text>
              ) : null}
              {patientDetail.emergencyContactPhone ? (
                <View style={styles.contactRow}>
                  <Ionicons name="call-outline" size={18} color={theme.textSecondary} />
                  <Text style={[styles.contactValue, { color: theme.textSecondary }]}>
                    {patientDetail.emergencyContactPhone}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  root: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  tabItem: {
    paddingBottom: 8,
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  tabUnderline: {
    marginTop: 4,
    height: 3,
    borderRadius: 999,
    alignSelf: 'stretch',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 48,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: Platform.select({ android: 22, ios: 20, default: 20 }),
    paddingVertical: Platform.select({ android: 10, ios: 12, default: 10 }),
    paddingHorizontal: 0,
    minHeight: Platform.select({ android: 40, ios: 36, default: 40 }),
  },
  listContent: {
    paddingBottom: 24,
    gap: 12,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyImage: {
    width: 160,
    height: 160,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
  },
  stateText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: 'center',
  },
  retryBtn: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  retryBtnText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
  },
  cardWrapper: {
    borderRadius: 16,
  },
  cardWrapperExpanded: {
    overflow: 'hidden',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  cardTextWrap: {
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    marginBottom: 2,
  },
  cardMeta: {
    fontSize: 13,
    fontFamily: fonts.regular,
  },
  detailCard: {
    marginTop: 8,
    borderRadius: 16,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  detailBox: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    padding: 12,
  },
  detailBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
  },
  detailDate: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },
  contactSection: {
    marginBottom: 16,
    gap: 8,
  },
  contactTitle: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactValue: {
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  detailButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
  },
  filledButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filledButtonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    lineHeight: 20,
    fontWeight:"500",
  },
  sheetContainer: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 99,
    backgroundColor: '#CBD5E1',
  },
  sheetContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
    marginBottom: 8,
  },
  noteCard: {
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    padding: 14,
    gap: 8,
  },
  noteTitle: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
  },
  noteBody: {
    fontSize: 13,
    fontFamily: fonts.regular,
    lineHeight: 20,
  },
  noteFooter: {
    marginTop: 8,
    gap: 10,
  },
  noteDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  noteDate: {
    fontSize: 13,
    fontFamily: fonts.regular,
  },
  notePrimaryButton: {
    marginTop: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#20BEB8',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notePrimaryButtonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: '#20BEB8',
  },
  profileSheetContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 12,
  },
  profileTop: {
    alignItems: 'center',
    gap: 4,
  },
  profileHeaderTitle: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    marginBottom: 8,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileName: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
  },
  profileMeta: {
    fontSize: 13,
    fontFamily: fonts.regular,
  },
  profileStatsCard: {
    borderRadius: 12,
    padding: 12,
  },
  profileActions: {
    gap: 10,
  },
  fullPrimaryBtn: {
    borderRadius: 999,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullPrimaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },
  fullOutlineBtn: {
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullOutlineBtnText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },
  profileSectionCard: {
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  profileSectionTitle: {
    fontSize: 22,
    lineHeight: 30,
    fontFamily: fonts.semiBold,
  },
  vitalsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  vitalItem: {
    width: '48%',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    padding: 10,
  },
  vitalValue: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },
  vitalLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  profileListItem: {
    fontSize: 14,
    fontFamily: fonts.regular,
    lineHeight: 22,
  },
  profileLoader: {
    marginVertical: 8,
  },
  profileError: {
    fontSize: 13,
    fontFamily: fonts.regular,
    textAlign: 'center',
  },
  emergencyText: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: fonts.semiBold,
  },
})