import { Button, Input } from '../../components';
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
import { envelope, eyeOff, eyeOn, facebook, google, lock } from '@/config/svg';

export default function SignUpScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSignUp = () => {
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
              source={require('../../assets/images/medorra.png')}
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
            label="Name"
            placeholder="Full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            leftIcon={<SvgXml xml={envelope} />}
          />
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
            label="Sign up"
            onPress={handleSignUp}
            variant="primary"
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
