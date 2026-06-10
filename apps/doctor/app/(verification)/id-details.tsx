import { Button, Input } from '@/components';
import { AuthStepper } from '@/components/auth-stepper';
import { ScreenHeader } from '@/components/screen-header';
import { useTheme } from '@/config/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TOTAL_STEPS = 3;

export default function IdDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { methodLabel } = useLocalSearchParams<{ methodLabel?: string }>();
  const [idNumber, setIdNumber] = useState('');

  const label = methodLabel ?? 'National ID';

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          <AuthStepper currentStep={2} totalSteps={TOTAL_STEPS} />
          <ScreenHeader theme={theme} title="ID details" />
          <Text style={[styles.sub, { color: theme.textSecondary }]}>
            Enter your {label.toLowerCase()} information.
          </Text>

          <Input
            theme={theme}
            label="ID type"
            value={label}
            editable={false}
          />
          <Input
            theme={theme}
            label="ID number"
            placeholder="Enter ID number"
            value={idNumber}
            onChangeText={setIdNumber}
          />

          <Button
            theme={theme}
            label="Upload document"
            variant="secondary"
            onPress={() => {}}
          />
          <View style={styles.spacer} />
          <Button
            theme={theme}
            label="Continue"
            onPress={() => router.push('/(verification)/medical-qualification')}
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
  spacer: {
    height: 12,
  },
});
