import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
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

import { PrimaryCtaButton } from '../components/appointment';
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

export default function PatientDetailsScreen() {
  const theme = useTheme();
  const [name, setName] = useState('Akash basak');
  const [dateOfBirth] = useState('22 November 1998');
  const [gender, setGender] = useState<Gender>('male');
  const [problem, setProblem] = useState('');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
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

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.inputLabel, fontFamily: fonts.medium }]}>
                Date of Birth
              </Text>
              <View
                style={[
                  styles.inputRow,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: theme.inputBorder,
                  },
                ]}>
                <TextInput
                  style={[styles.dobInput, { color: theme.inputText }]}
                  value={dateOfBirth}
                  editable={false}
                  placeholder='Select date'
                  placeholderTextColor={theme.inputPlaceholder}
                />
                <Pressable
                  hitSlop={8}
                  accessibilityRole='button'
                  accessibilityLabel='Open calendar'>
                  <Ionicons name='calendar-outline' size={22} color={theme.textSecondary} />
                </Pressable>
              </View>
            </View>

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

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.inputLabel, fontFamily: fonts.medium }]}>
                Upload Documents ( if any )
              </Text>
              <Pressable
                style={[
                  styles.uploadZone,
                  {
                    borderColor: theme.divider,
                    backgroundColor: theme.card,
                  },
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
            </View>

            <View style={{ height: 8 }} />
          </ScrollView>

          <SafeAreaView
            edges={['bottom']}
            style={[styles.footer, { backgroundColor: theme.background }]}>
            <PrimaryCtaButton label='Next' onPress={() => {}} />
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
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
  dobInput: {
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
