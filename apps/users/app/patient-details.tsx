import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
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

import {
  DatePickerBottomSheet,
  FileUploadCard,
  PrimaryCtaButton,
  type UploadFile,
} from '../components/appointment';
import { Input } from '../components';
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
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

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

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

export default function PatientDetailsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [name, setName] = useState('Akash basak');
  const [dob, setDob] = useState(new Date(1998, 10, 22)); // 22 Nov 1998
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [gender, setGender] = useState<Gender>('male');
  const [problem, setProblem] = useState('');
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const intervalsRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  const simulateUpload = useCallback((id: string, totalBytes: number) => {
    const tick = 400; // ms between ticks
    const increment = tick / ((totalBytes / (100 * 1024)) * 1000); // proportional to ~100KB/s

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
        const size = asset.size ?? 512 * 1024; // fallback 512 KB if unknown
        if (size > MAX_FILE_BYTES) continue; // silently skip oversized files
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
      // user dismissed or permission denied — no-op
    }
  }, [simulateUpload]);

  const handleRemoveFile = useCallback((id: string) => {
    clearInterval(intervalsRef.current[id]);
    delete intervalsRef.current[id];
    setUploadFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.flex}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={styles.scroll}>
            <ScreenHeader title='Patient Details' />

            <Input
              theme={theme}
              label='Name'
              value={name}
              onChangeText={setName}
              placeholder='Enter your name'
              autoCapitalize='words'
            />

            {/* Date of Birth */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.inputLabel, fontFamily: fonts.medium }]}>
                Date of Birth
              </Text>
              <Pressable
                onPress={() => setCalendarOpen(true)}
                accessibilityRole='button'
                accessibilityLabel='Select date of birth'>
                <View
                  style={[
                    styles.inputRow,
                    { backgroundColor: theme.inputBg, borderColor: theme.inputBorder },
                  ]}>
                  <Text
                    style={[
                      styles.dobText,
                      {
                        color: dob ? theme.inputText : theme.inputPlaceholder,
                        fontFamily: fonts.regular,
                      },
                    ]}>
                    {dob ? formatDate(dob) : 'Select date'}
                  </Text>
                  <Ionicons name='calendar-outline' size={22} color={theme.textSecondary} />
                </View>
              </Pressable>
            </View>

            {/* Gender */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.inputLabel, fontFamily: fonts.medium }]}>
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
                          { borderColor: selected ? theme.accent : theme.divider },
                        ]}>
                        {selected ? (
                          <View style={[styles.radioInner, { backgroundColor: theme.accent }]} />
                        ) : null}
                      </View>
                      <Text
                        style={[
                          styles.genderLabel,
                          { color: theme.textPrimary, fontFamily: fonts.medium },
                        ]}>
                        {g.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Problem */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.inputLabel, fontFamily: fonts.medium }]}>
                Write Your Problem
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
                placeholder='Write your problem here..'
                placeholderTextColor={theme.inputPlaceholder}
                multiline
                textAlignVertical='top'
                value={problem}
                onChangeText={setProblem}
              />
            </View>

            {/* Upload */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.inputLabel, fontFamily: fonts.medium }]}>
                Upload Documents ( if any )
              </Text>
              <Pressable
                onPress={handlePickFiles}
                style={[
                  styles.uploadZone,
                  { borderColor: theme.divider, backgroundColor: theme.card },
                ]}
                accessibilityRole='button'
                accessibilityLabel='Browse files to upload'>
                <Ionicons name='cloud-upload-outline' size={40} color={theme.textSecondary} />
                <Text style={[styles.browseLine, { color: theme.textPrimary }]}>
                  <Text style={{ color: theme.accent, fontFamily: fonts.semiBold }}>Browse</Text>
                  {' your files'}
                </Text>
                <Text style={[styles.uploadHint, { color: theme.textSecondary }]}>
                  ( Maximum size 10MB )
                </Text>
              </Pressable>

              {/* File cards — rendered below the drop zone */}
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
            <PrimaryCtaButton
              label='Next'
              onPress={() => {
                const genderLabel = GENDERS.find((g) => g.id === gender)?.label ?? gender;
                router.push({
                  pathname: '/appointment-details',
                  params: {
                    patientName: encodeURIComponent(name.trim()),
                    age: String(ageFromDob(dob)),
                    gender: encodeURIComponent(genderLabel),
                    problem: encodeURIComponent(problem.trim()),
                  },
                });
              }}
            />
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
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
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
