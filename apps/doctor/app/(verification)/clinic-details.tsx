import { Button, Input } from '@/components';
import { AuthStepper } from '@/components/auth-stepper';
import { ScreenHeader } from '@/components/screen-header';
import { SelectField } from '@/components/select-field';
import {
  useVerificationProgress,
  VERIFICATION_TOTAL_STEPS,
} from '@/context/verification-progress';
import { useTheme } from '@/config/theme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STATES = [
  'Lagos',
  'Abuja',
  'Rivers',
  'Kano',
  'Oyo',
  'Other',
];

const SPECIALTIES = [
  'General practice',
  'Cardiology',
  'Pediatrics',
  'Dermatology',
  'Other',
];

export default function ClinicDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { currentStep } = useVerificationProgress();
  const [clinicName, setClinicName] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [specialization, setSpecialization] = useState('');

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          <AuthStepper
            currentStep={currentStep}
            totalSteps={VERIFICATION_TOTAL_STEPS}
          />
          <ScreenHeader theme={theme} title="Clinic details" />
          <Text style={[styles.sub, { color: theme.textSecondary }]}>
            Where do you practise?
          </Text>

          <Input
            theme={theme}
            label="Clinic name"
            placeholder="Clinic name"
            value={clinicName}
            onChangeText={setClinicName}
          />
          <SelectField
            theme={theme}
            label="State"
            value={state}
            placeholder="Select state"
            options={STATES}
            onChange={setState}
          />
          <Input
            theme={theme}
            label="Town / address"
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
          <SelectField
            theme={theme}
            label="Specialization"
            value={specialization}
            placeholder="Select specialization"
            options={SPECIALTIES}
            onChange={setSpecialization}
          />

          <Button
            theme={theme}
            label="Submit"
            onPress={() => router.replace('/(verification)/submitted')}
            style={{ backgroundColor: theme.accent, borderRadius: 30 }}
          />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scroll: {
    paddingBottom: 32,
  },
  sub: {
    fontSize: 15,
    marginBottom: 16,
  },
});
