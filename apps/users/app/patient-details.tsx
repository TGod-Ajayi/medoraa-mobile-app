import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import {
  Types,
  useDoctorAvailableTimeSlots,
  useDoctorDetails,
  useUser,
} from '@repo/ui/graphql';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Input } from '../components';
import {
  BookingContextCard,
  BookingStepIndicator,
  DatePickerBottomSheet,
  FileUploadCard,
  PatientInfoSection,
  PrimaryCtaButton,
  resolveRouteParam,
  type PatientChoice,
  type UploadFile,
} from '../components/appointment';
import { ScreenHeader } from '../components/doctor';
import { fonts } from '../config/fonts';
import { useTheme } from '../config/theme';

type Gender = 'male' | 'female' | 'other';

const GENDERS: { id: Gender; label: string }[] = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'other', label: 'Other' },
];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DEFAULT_AVATAR = require('../assets/images/user.png');

function formatDate(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function ageFromDob(d: Date) {
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
}

function mapApiGender(gender?: Types.GenderTypes | null): Gender {
  if (gender === Types.GenderTypes.Male) return 'male';
  if (gender === Types.GenderTypes.Female) return 'female';
  return 'other';
}

function parseDateOfBirth(value?: string | null) {
  if (!value) return new Date(1990, 0, 1);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date(1990, 0, 1) : parsed;
}

const MAX_FILE_BYTES = 10 * 1024 * 1024;

export default function PatientDetailsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams<{
    doctorId?: string | string[];
    doctorTimeSlotId?: string | string[];
  }>();
  const doctorId = resolveRouteParam(params.doctorId);
  const doctorTimeSlotId = resolveRouteParam(params.doctorTimeSlotId);

  const { user, loading: userLoading } = useUser();
  const { doctor, loading: doctorLoading } = useDoctorDetails(doctorId, {
    skip: !doctorId,
  });
  const { slots } = useDoctorAvailableTimeSlots({ doctorId, skip: !doctorId });

  const [patientChoice, setPatientChoice] = useState<PatientChoice>('self');
  const [name, setName] = useState('');
  const [dob, setDob] = useState(new Date(1990, 0, 1));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [gender, setGender] = useState<Gender>('male');
  const [problem, setProblem] = useState('');
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [prefilled, setPrefilled] = useState(false);
  const intervalsRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  useEffect(() => {
    if (!doctorId) {
      router.replace('/doctors-list');
      return;
    }
    if (!doctorTimeSlotId) {
      router.replace({
        pathname: '/select-appointment-slot',
        params: { doctorId },
      });
    }
  }, [doctorId, doctorTimeSlotId, router]);

  useEffect(() => {
    if (!user || prefilled) return;

    const fullName = [user.firstName, user.lastName]
      .filter((part) => part?.trim())
      .join(' ');

    setName(fullName);
    setDob(parseDateOfBirth(user.dateOfBirth));
    setGender(mapApiGender(user.gender));
    setPrefilled(true);
  }, [prefilled, user]);

  const { doctorName, specialty, photoSource } = useMemo(() => {
    const specialtyLabel =
      doctor?.doctorsSpecialties
        ?.map((entry) => entry.specialty.name)
        .filter(Boolean)
        .join(', ') || 'General practice';

    const label = doctor
      ? (() => {
          const fullName = [doctor.user.firstName, doctor.user.lastName]
            .filter((value): value is string => Boolean(value?.trim()))
            .join(' ');
          return fullName ? `Dr. ${fullName}` : 'Doctor';
        })()
      : 'Doctor';

    const photo = doctor?.user.profilePhoto
      ? { uri: doctor.user.profilePhoto }
      : DEFAULT_AVATAR;

    return {
      doctorName: label,
      specialty: specialtyLabel,
      photoSource: photo,
    };
  }, [doctor]);

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === doctorTimeSlotId) ?? null,
    [doctorTimeSlotId, slots],
  );

  const patientAvatar = useMemo(() => {
    if (user?.profilePhoto) return { uri: user.profilePhoto };
    return DEFAULT_AVATAR;
  }, [user?.profilePhoto]);

  const patientMeta = `${ageFromDob(dob)} years · ${
    GENDERS.find((g) => g.id === gender)?.label ?? '—'
  }`;

  const simulateUpload = useCallback((id: string, totalBytes: number) => {
    const tick = 400;
    const increment = tick / ((totalBytes / (100 * 1024)) * 1000);

    intervalsRef.current[id] = setInterval(() => {
      setUploadFiles((prev) =>
        prev.map((f) => {
          if (f.id !== id) return f;
          const next = Math.min(f.progress + increment, 1);
          if (next >= 1) {
            clearInterval(intervalsRef.current[id]);
            delete intervalsRef.current[id];
            return { ...f, progress: 1, status: 'done' };
          }
          return { ...f, progress: next };
        }),
      );
    }, tick);
  }, []);

  const handlePickFiles = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
        copyToCacheDirectory: false,
      });
      if (result.canceled) return;

      for (const asset of result.assets) {
        const size = asset.size ?? 512 * 1024;
        if (size > MAX_FILE_BYTES) continue;
        const id = `${Date.now()}-${Math.random()}`;
        const newFile: UploadFile = {
          id,
          name: asset.name,
          size,
          progress: 0,
          status: 'uploading',
        };
        setUploadFiles((prev) => [...prev, newFile]);
        simulateUpload(id, size);
      }
    } catch {
      // dismissed
    }
  }, [simulateUpload]);

  const handleRemoveFile = useCallback((id: string) => {
    clearInterval(intervalsRef.current[id]);
    delete intervalsRef.current[id];
    setUploadFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleNext = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Name required', 'Enter the patient name to continue.');
      return;
    }

    const genderLabel = GENDERS.find((g) => g.id === gender)?.label ?? gender;
    const notes = problem.trim();

    router.push({
      pathname: '/appointment-details',
      params: {
        patientName: encodeURIComponent(trimmedName),
        age: String(ageFromDob(dob)),
        gender: encodeURIComponent(genderLabel),
        notes: encodeURIComponent(notes),
        type: Types.AppointmentType.Scheduled,
        doctorId: doctorId!,
        doctorTimeSlotId: doctorTimeSlotId!,
      },
    });
  };

  if (!doctorId || !doctorTimeSlotId) {
    return null;
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.flex}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={styles.scroll}>
            <ScreenHeader title='Patient Details' />
            <BookingStepIndicator current='patient' />

            <BookingContextCard
              doctorName={doctorName}
              specialty={specialty}
              photoSource={photoSource}
              slotStart={selectedSlot?.startDateTime}
              slotEnd={selectedSlot?.endDateTime}
              loading={doctorLoading}
            />

            <PatientInfoSection
              selected={patientChoice}
              onSelect={setPatientChoice}
              patientName={name.trim() || 'Your profile'}
              patientMeta={patientMeta}
              avatar={patientAvatar}
            />

            {patientChoice === 'other' ? (
              <Text
                style={[
                  styles.helper,
                  { color: theme.textSecondary, fontFamily: fonts.regular },
                ]}>
                Fill in details for the person receiving care.
              </Text>
            ) : null}

            <Input
              theme={theme}
              label='Name'
              value={name}
              onChangeText={setName}
              placeholder='Enter patient name'
              autoCapitalize='words'
              editable={patientChoice === 'other' || !userLoading}
            />

            <View style={styles.field}>
              <Text
                style={[
                  styles.label,
                  { color: theme.inputLabel, fontFamily: fonts.medium },
                ]}>
                Date of Birth
              </Text>
              <Pressable
                onPress={() => setCalendarOpen(true)}
                accessibilityRole='button'
                accessibilityLabel='Select date of birth'>
                <View
                  style={[
                    styles.inputRow,
                    {
                      backgroundColor: theme.inputBg,
                      borderColor: theme.inputBorder,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.dobText,
                      {
                        color: dob ? theme.inputText : theme.inputPlaceholder,
                        fontFamily: fonts.regular,
                      },
                    ]}>
                    {formatDate(dob)}
                  </Text>
                  <Ionicons
                    name='calendar-outline'
                    size={22}
                    color={theme.textSecondary}
                  />
                </View>
              </Pressable>
            </View>

            <View style={styles.field}>
              <Text
                style={[
                  styles.label,
                  { color: theme.inputLabel, fontFamily: fonts.medium },
                ]}>
                Gender
              </Text>
              <View style={styles.genderRow}>
                {GENDERS.map((g) => {
                  const selected = gender === g.id;
                  return (
                    <Pressable
                      key={g.id}
                      style={styles.genderOption}
                      onPress={() => setGender(g.id)}
                      accessibilityRole='radio'
                      accessibilityState={{ selected }}>
                      <View
                        style={[
                          styles.radioOuter,
                          {
                            borderColor: selected ? theme.accent : theme.divider,
                          },
                        ]}>
                        {selected ? (
                          <View
                            style={[
                              styles.radioInner,
                              { backgroundColor: theme.accent },
                            ]}
                          />
                        ) : null}
                      </View>
                      <Text
                        style={[
                          styles.genderLabel,
                          {
                            color: theme.textPrimary,
                            fontFamily: fonts.medium,
                          },
                        ]}>
                        {g.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.field}>
              <Text
                style={[
                  styles.label,
                  { color: theme.inputLabel, fontFamily: fonts.medium },
                ]}>
                Describe your problem
              </Text>
              <Text
                style={[styles.fieldHint, { color: theme.textMuted }]}>
                This is sent to your doctor as appointment notes.
              </Text>
              <TextInput
                style={[
                  styles.textarea,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: theme.inputBorder,
                    color: theme.inputText,
                  },
                ]}
                placeholder='Symptoms, concerns, or questions…'
                placeholderTextColor={theme.inputPlaceholder}
                multiline
                textAlignVertical='top'
                value={problem}
                onChangeText={setProblem}
              />
            </View>

            <View style={styles.field}>
              <Text
                style={[
                  styles.label,
                  { color: theme.inputLabel, fontFamily: fonts.medium },
                ]}>
                Upload documents (optional)
              </Text>
              <Pressable
                onPress={handlePickFiles}
                style={[
                  styles.uploadZone,
                  { borderColor: theme.divider, backgroundColor: theme.card },
                ]}
                accessibilityRole='button'
                accessibilityLabel='Browse files to upload'>
                <Ionicons
                  name='cloud-upload-outline'
                  size={40}
                  color={theme.textSecondary}
                />
                <Text style={[styles.browseLine, { color: theme.textPrimary }]}>
                  <Text
                    style={{ color: theme.accent, fontFamily: fonts.semiBold }}>
                    Browse
                  </Text>
                  {' your files'}
                </Text>
                <Text
                  style={[styles.uploadHint, { color: theme.textSecondary }]}>
                  Maximum size 10MB per file
                </Text>
              </Pressable>

              {uploadFiles.map((file) => (
                <FileUploadCard
                  key={file.id}
                  file={file}
                  onRemove={handleRemoveFile}
                />
              ))}
            </View>

            <View style={{ height: 8 }} />
          </ScrollView>

          <SafeAreaView
            edges={['bottom']}
            style={[styles.footer, { backgroundColor: theme.background }]}>
            <PrimaryCtaButton label='Review appointment' onPress={handleNext} />
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>

      <DatePickerBottomSheet
        visible={calendarOpen}
        selected={dob}
        onConfirm={(date) => setDob(date)}
        onClose={() => setCalendarOpen(false)}
      />
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
  helper: {
    fontSize: 13,
    marginTop: -8,
    marginBottom: 12,
    lineHeight: 18,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  fieldHint: {
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
  },
  inputRow: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dobText: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
  },
  genderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    alignItems: 'center',
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  genderLabel: {
    fontSize: 15,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  textarea: {
    minHeight: 120,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
  },
  uploadZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  browseLine: {
    fontSize: 15,
    marginTop: 12,
    textAlign: 'center',
  },
  uploadHint: {
    fontSize: 13,
    marginTop: 6,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
