import { Button, Input } from '../../../components';
import { ScreenHeader } from '../../../components/doctor';
import { useTheme } from '../../../config/theme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { DOCTOR_AUTH_FLOW } from './flow';

/** Medical school, degree, graduation year, certificate uploads */
export default function MedicalQualificationScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [school, setSchool] = useState('');
  const [degree, setDegree] = useState('');
  const [year, setYear] = useState('');

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title='Medical qualification' />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}>
        <Input
          theme={theme}
          label='Institution name'
          placeholder='Medical school'
          value={school}
          onChangeText={setSchool}
        />
        <Input
          theme={theme}
          label='Degree'
          placeholder='e.g. Bachelor of Medicine'
          value={degree}
          onChangeText={setDegree}
        />
        <Input
          theme={theme}
          label='Graduation year'
          placeholder='YYYY'
          value={year}
          onChangeText={setYear}
          keyboardType='number-pad'
        />
        <Pressable
          style={[styles.uploadZone, { borderColor: theme.divider, backgroundColor: theme.card }]}
          accessibilityRole='button'>
          <Text style={{ color: theme.textSecondary }}>Medical certificate</Text>
        </Pressable>
        <Pressable
          style={[styles.uploadZone, { borderColor: theme.divider, backgroundColor: theme.card }]}
          accessibilityRole='button'>
          <Text style={{ color: theme.textSecondary }}>Current medical license</Text>
        </Pressable>
        <Button
          label='Continue'
          onPress={() => router.push(DOCTOR_AUTH_FLOW.clinicDetails)}
          variant='primary'
          style={[styles.cta, { backgroundColor: theme.accent }]}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 32 },
  uploadZone: {
    minHeight: 72,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cta: { marginTop: 8 },
});
