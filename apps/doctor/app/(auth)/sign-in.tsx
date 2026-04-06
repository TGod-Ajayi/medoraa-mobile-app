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
import { envelope, eyeOff, eyeOn, lock } from '@/config/svg';
import { Hooks, setLogInHandler } from '@repo/ui/graphql';
import { showMessage } from 'react-native-flash-message';

const { height } = Dimensions.get('window');


function isValidEmail(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}


export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [signIn, { loading }] = Hooks.useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const trimmedEmail = email.trim();
  const emailLooksInvalid =
    trimmedEmail.length > 0 && !isValidEmail(trimmedEmail);
  const canLogin =
    isValidEmail(trimmedEmail) && password.trim().length > 0;

  const handleLogin = async () => {
    if(!isValidEmail(trimmedEmail)){
      showMessage({
        message: 'Enter a valid email address',
        type: 'danger',
        duration: 4000,
      });
      return;
    }
    if (!canLogin) return;
    try{
      const { data } = await signIn({
        variables: {
          loginInput: {
            email: trimmedEmail,
            password,
          },
        },
      });
      const token = data?.login?.accessToken;
      if (!token) return;
      await setLogInHandler(token);
      showMessage({
        message: "Login successful",
        type: "success",
        duration: 4000,
      })
      router.replace("/(tabs)");
    }
    catch(e:any){
      showMessage({
        message: e?.message,
        type: 'danger',
        duration: 4000,
      })
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
        <Text style={[styles.title, { color: theme.textPrimary }]}>Hello Again!</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Welcome back you've been missed!
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
          <Input
            theme={theme}
            label="Password"
            placeholder="Enter Password"
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

          <View style={styles.row}>
            <Pressable
              style={styles.checkboxWrap}
              onPress={() => setRememberMe((v) => !v)}
            >
              <View
                style={[
                  styles.checkbox,
                  { borderColor: theme.checkboxBorder },
                  rememberMe && [
                    styles.checkboxChecked,
                    {
                      backgroundColor: theme.checkboxChecked,
                      borderColor: theme.checkboxChecked,
                    },
                  ],
                ]}
              >
                {rememberMe && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>
              <Text style={[styles.checkboxLabel, { color: theme.textSecondary }]}>
                Remember me
              </Text>
            </Pressable>
            <Pressable onPress={() => router.push("/(auth)/forget-password")}>
              <Text style={[styles.link, { color: theme.textMuted }]}>
                Forgot Password?
              </Text>
            </Pressable>
          </View>

          <Button
            theme={theme}
            label={loading ? 'Logging in...' : 'Login'}
            onPress={handleLogin}
            variant="primary"
            disabled={!canLogin || loading}
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
    marginTop: 4,
    marginBottom: 8,
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
