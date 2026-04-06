import { Button, Input } from '../../components';
import { DatePickerBottomSheet } from '../../components/appointment';
import { useTheme } from '../../config/theme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { envelope, eyeOff, eyeOn, lock } from '@/config/svg';
import { Hooks, setLogInHandler, Types } from '@repo/ui/graphql';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatDate(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export default function SignUpScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [signUp, { loading }] = Hooks.useSignUpMutation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [dob, setDob] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 25);
    return d;
  });
  const [dobSheetOpen, setDobSheetOpen] = useState(false);

  const handleSignUp = async () => {
    const { data } = await signUp({
      variables: {
        signUpInput: {
          email: email.trim(),
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role: Types.UserRoles.Patient,
          dateOfBirth: dob.toISOString(),
        },
      },
    });
    const token = data?.signUp?.accessToken;
    if (!token) return;
    await setLogInHandler(token);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoWrap}>
          <View style={[styles.logo, { backgroundColor: theme.accent }]}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Welcome to Medicare</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Welcome to medicare</Text>

        <View style={styles.form}>
          <Input
            theme={theme}
            label="First name"
            placeholder="First name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            leftIcon={<SvgXml xml={envelope} />}
          />
          <Input
            theme={theme}
            label="Last name"
            placeholder="Last name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            leftIcon={<SvgXml xml={envelope} />}
          />
          <View style={styles.dobBlock}>
            <Text style={[styles.dobLabel, { color: theme.inputLabel }]}>Date of birth</Text>
            <Pressable
              onPress={() => setDobSheetOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Select date of birth">
              <View
                style={[
                  styles.dobRow,
                  { backgroundColor: theme.inputBg, borderColor: theme.inputBorder },
                ]}>
                <Text style={[styles.dobText, { color: theme.inputText }]} numberOfLines={1}>
                  {formatDate(dob)}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
              </View>
            </Pressable>
          </View>
          <Input
            theme={theme}
            label="Email"
            placeholder="example@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={<SvgXml xml={envelope} />}
          />
          <Input
            theme={theme}
            label="Password"
            placeholder="Create Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            leftIcon={<SvgXml xml={lock} />}
            rightContent={
              <Pressable
                onPress={() => setPasswordVisible((v) => !v)}
                hitSlop={8}
                style={styles.inputAction}
              >
                <SvgXml xml={passwordVisible ? eyeOn : eyeOff} />
              </Pressable>
            }
          />

          <Button
            label={loading ? 'Signing up…' : 'Sign up'}
            onPress={handleSignUp}
            variant="primary"
            disabled={loading}
            style={[styles.signUpButton, { backgroundColor: theme.accent }]}
          />

          {/* <View style={styles.dividerWrap}>
            <View style={[styles.dividerLine, { backgroundColor: theme.divider }]} />
            <Text style={[styles.dividerText, { color: theme.dividerText }]}>or Login with</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.divider }]} />
          </View>

          <Button
            label="Continue with google"
            onPress={() => {}}
            variant="secondary"
            leftIcon={<SvgXml xml={google} />}
            style={{
              borderRadius: 2,
              backgroundColor: theme.socialButtonBg,
              borderColor: theme.socialButtonBorder,
              borderWidth: 1,
            }}
            labelStyle={{ fontSize: 14, fontWeight: '400', color: theme.socialButtonText }}
          />
          <View style={styles.buttonSpacer} />
          <Button
            label="Continue with Facebook"
            onPress={() => {}}
            variant="secondary"
            leftIcon={<SvgXml xml={facebook} />}
            style={{
              borderRadius: 2,
              backgroundColor: theme.socialButtonBg,
              borderColor: theme.socialButtonBorder,
              borderWidth: 1,
            }}
            labelStyle={{ fontSize: 14, fontWeight: '400', color: theme.socialButtonText }}
          /> */}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textMuted }]}>Have an account? </Text>
          <Pressable onPress={() => router.back()}>
            <Text style={[styles.footerLink, { color: theme.link }]}>sign in</Text>
          </Pressable>
        </View>
      </ScrollView>

      <DatePickerBottomSheet
        visible={dobSheetOpen}
        selected={dob}
        onConfirm={(date) => setDob(date)}
        onClose={() => setDobSheetOpen(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    marginBottom: 24,
  },
  dobBlock: {
    marginBottom: 16,
  },
  dobLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  dobRow: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dobText: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
  },
  inputAction: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButton: {
    marginTop: 8,
    marginBottom: 28,
  },
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
  },
  buttonSpacer: {
    height: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  footerText: {
    fontSize: 15,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: '600',
  },
});
