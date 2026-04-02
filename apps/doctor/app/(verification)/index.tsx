import { Button } from '@/components';
import { AuthStepper } from '@/components/auth-stepper';
import {
  useVerificationProgress,
  VERIFICATION_TOTAL_STEPS,
} from '@/context/verification-progress';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type VerificationSectionRoute = 'id-documents' | 'medical-qualification' | 'physical-clinic';

const ITEMS: {
  label: string;
  subText: string;
  route: VerificationSectionRoute;
}[] = [
  {
    label: 'ID Document',
    subText:
      "Your country's approved ID document that matches the information you provided",
    route: 'id-documents',
  },
  {
    label: 'Medical Qualification',
    subText: 'Details of your qualification as a medical practitioner',
    route: 'medical-qualification',
  },
  {
    label: 'Physical Clinic',
    subText: 'Details of your current employment',
    route: 'physical-clinic',
  },
];

const { height } = Dimensions.get('window');

const TOTAL_STEPS = VERIFICATION_TOTAL_STEPS;

function navigateToVerificationSection(
  router: ReturnType<typeof useRouter>,
  route: VerificationSectionRoute,
) {
  switch (route) {
    case 'id-documents':
      router.push('/(verification)/id-documents');
      break;
    case 'medical-qualification':
      router.push('/(verification)/medical-qualification');
      break;
    case 'physical-clinic':
      router.push('/(verification)/physical-clinic');
      break;
  }
}

export default function VerifyIdentityIntroScreen() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [consentAccepted, setConsentAccepted] = useState(false);
  const { currentStep } = useVerificationProgress();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={[styles.safe, { paddingVertical: (height / 100) * 4 }]}>
        <AuthStepper currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        <Text style={[styles.headline, { color: theme.textPrimary }]}>
          Let&apos;s verify your identity
        </Text>
        <Text style={[styles.sub, { color: theme.textSecondary }]}>
        We are required to verify your identity before you can use our service. Your information will be encrypted and stored securely.
        </Text>
      <Text style={{paddingBottom:16, color: "#64748B"}}>
      Details to provide are:
      </Text>
        <View style={styles.list}>
          {ITEMS.map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => navigateToVerificationSection(router, item.route)}
              style={[
                styles.row,
                {
                  backgroundColor: theme.card,
                },
              ]}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: colorScheme === 'dark' ? '#FFFFFF' : '#0F172A',
                }}>
                {item.label}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#64748B' }}>
                {item.subText}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Pressable
            style={styles.consentRow}
            onPress={() => setConsentAccepted((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: consentAccepted }}
            accessibilityLabel="Consent to provide requested data">
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: theme.checkboxBorder,
                  backgroundColor: consentAccepted ? theme.checkboxChecked : theme.inputBg,
                },
              ]}>
              {consentAccepted ? (
                <Ionicons name="checkmark" size={14} color="#fff" />
              ) : null}
            </View>
            <Text style={[styles.consentText, { color: theme.textSecondary }]}>
              By clicking on Accept and Proceed, you consent to provide us with the requested data.
            </Text>
          </Pressable>

          <Button
            style={{ borderRadius: 30 }}
            theme={theme}
            disabled={!consentAccepted}
            label="Accept and Continue"
            onPress={() => router.push("/(verification)/submitted")}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headline: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: 12
  },
  list: {
    gap: 12,
    display: "flex",
    flexDirection: "column",
  },
  row: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
    padding: 16,
    borderRadius: 12,
   borderColor: "transparent",
    borderWidth: 1,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    gap: 56,
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: height/100 * 1,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  consentText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
});
