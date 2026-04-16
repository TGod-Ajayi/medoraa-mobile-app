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
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import { envelope, eyeOff, eyeOn, facebook, google, lock } from '@/config/svg';
import { Hooks, } from '@repo/ui/graphql';
import { showMessage } from 'react-native-flash-message';

const { height } = Dimensions.get('window');

/** Practical email shape check (not full RFC). */
function isValidEmail(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function ForgetPasswordScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [forgetPassword, { loading }] = Hooks.useForgotPasswordMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const trimmedEmail = email.trim();
  const emailLooksInvalid =
    trimmedEmail.length > 0 && !isValidEmail(trimmedEmail);
  const canForgetPassword =
    isValidEmail(trimmedEmail);

  const handleForgetPassword = async () => {
    if (!canForgetPassword) return;
    try {
        const result = await forgetPassword({
          variables: { email: trimmedEmail },
        });
      
        // GraphQL errors (HTTP 200 with errors payload) — shape depends on errorPolicy
        if (result.errors?.length) {
          // show result.errors[0].message
       
          return;
        }
      
        // Optional: check your schema’s payload for business errors
        // e.g. if (!result.data?.forgotPassword?.success) { ... }
        showMessage({
          message: `OTP has been sent to your email ${email}`,
          type: "success",
          duration: 4000,
        });
        router.replace({pathname: '/(auth)/verify-otp', params: { email: trimmedEmail }});
      } catch (e:any) {
        // Network / HTTP failures (e.g. 404, 500) often land here
        // ApolloError: message, networkError, graphQLErrors
        showMessage({
          message: e?.message,
          type: 'danger',
          duration: 4000,
        });
      }
  };


  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background, paddingTop: height/100 * 10 }]}
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
        <Text style={[styles.title, { color: theme.textPrimary }]}>Reset Password</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
         let's reset your password
        </Text>

        <View style={styles.form}>
          <View>
            <Input
              theme={theme}
              label="Email"
              placeholder="example@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              autoComplete="email"
              leftIcon={<SvgXml xml={envelope} />}
            />
            {emailLooksInvalid ? (
              <Text style={[styles.fieldError, { color: theme.error }]}>
                Enter a valid email address
              </Text>
            ) : null}
          </View>
      
          <Button
            theme={theme}
            label={loading ? 'Resetting...' : 'Reset Password'}
            onPress={handleForgetPassword}
            variant="primary"
            disabled={!canForgetPassword || loading}
            style={{ backgroundColor: theme.accent, borderRadius: 30 }}
          />

        
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textMuted }]}>
            Don't have an account?{' '}
          </Text>
          <Pressable onPress={() => router.push('/(auth)/signup')}>
            <Text style={[styles.footerLink, { color: theme.link }]}>signup</Text>
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
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    marginBottom: 24,
    gap: 4,
  },
  fieldError: {
    fontSize: 13,
    marginTop: 2,
    marginBottom: 3,
    marginLeft: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  checkboxWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {},
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '400',
  },
  link: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputAction: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
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
