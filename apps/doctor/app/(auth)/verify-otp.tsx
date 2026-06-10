import {
    eyeOff,
    eyeOn,
    lock,
    lockSuccess,
    shieldCheck,
  } from '@/config/svg';
  import { Ionicons } from '@expo/vector-icons';
  import { useLocalSearchParams, useRouter } from 'expo-router';
  import { useEffect, useRef, useState } from 'react';
  import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
  } from 'react-native';
  import { SvgXml } from 'react-native-svg';
  import { Button, Input } from '../../components';
  import { fonts } from '../../config/fonts';
  import { useTheme } from '../../config/theme';
import { Hooks } from '@repo/ui/graphql';
import { showMessage } from 'react-native-flash-message';
import { itAsync } from '@apollo/client/v4-migration/v4-migration.cjs';
  
  const TEAL_FOCUS = '#4CCBC6';
  
  const OTP_LENGTH = 6;
  const RESEND_SECONDS = 600; // 1:50
  
  type Step = 0 | 1 | 2; // OTP → Create Password → Password Created
  
  export default function VerifyOTP({ email }: { email: string }) {
    const router = useRouter();
    const theme = useTheme();
    const [step, setStep] = useState<Step>(0);
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [resendSecs, setResendSecs] = useState(RESEND_SECONDS);
    const [password, setPassword] = useState('');
    const [verifyResetOtp , { loading }] = Hooks.useVerifyResetOtpMutation();
    const [resendOtp , { loading: resendOtpLoading }] = Hooks.useForgotPasswordMutation();
    const [resetPassword , { loading: resetPasswordLoading }] = Hooks.useResetPasswordMutation();
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [resetToken, setResetToken] = useState<string | null>(null);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const otpRefs = useRef<(TextInput | null)[]>([]);
    const params = useLocalSearchParams<{ email?: string }>();

    const showWarning = resendSecs > 0 && resendSecs < 60;
    // Resend OTP countdown
    useEffect(() => {
      if (step !== 0 || resendSecs <= 0) return;
      const t = setInterval(() => setResendSecs((s) => s - 1), 1000);
      return () => clearInterval(t);
    }, [step, resendSecs]);
  
    const otpValue = otp.join('');
    const canResend = resendSecs <= 0;
  
    const formatTimer = (secs: number) => {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${m}:${s.toString().padStart(2, '0')}s`;
    };

  const emailParam = typeof params.email === 'string' ? params.email : Array.isArray(params.email) ? params.email[0] : '';
  
    const handleVerify = async () => {
      if (otpValue.length !== OTP_LENGTH) return;
      try{
        const response = await verifyResetOtp({
          variables: {
            email: emailParam,
            otp: otpValue,
          },
        });
        console.log("response from verifying otp", response);
        const token = response.data?.verifyResetOtp;
        if(token){
          setResetToken(token);
        }
        showMessage({
          message: "OTP verified successfully",
          type: "success",
          duration: 4000,
        });
        setStep(1);
      }
      catch(err:any){
        showMessage({
          message: err.message,
          type: "danger",
          duration: 4000,
        });
      }
      return;
    };
  
    const handleResendOtp = async () => {
      if (!canResend) return;
      try{
        const response = await resendOtp({
          variables: {
            email: emailParam,
          },
        });
        console.log("response from resending otp", response);
        setResendSecs(RESEND_SECONDS);
      }
catch(err:any){
showMessage({
  message: err?.message, 
  type: "danger", 
  duration:4000
})
}
      };
  
    const handleCreatePassword = async () => {
      if (password.length <=0 || null || undefined) return;
      try{
        const response = await resetPassword({
          variables: {
            newPassword: password,
            token: resetToken as any,
          }
        })
        console.log("response from resetting password", response);
        showMessage({
          message: "Password reset successfully",
          type: "success",
          duration: 4000,
        });
        setStep(2);
       
      }
      catch(err:any){
        showMessage({
          message: err?.message, 
          type: "danger", 
          duration:4000
        });
        return; 
      }
      
    };
  
    const handleLogin = () => {
      router.replace("/(auth)/sign-in");
    };
  
 
    if (step === 0) {
      return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.header,]}>
            {/* <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
              <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
            </Pressable> */}
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Reset Password</Text>
            <View style={styles.backBtn} />
          </View>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.iconWrap}>
              <SvgXml xml={shieldCheck} width={80} height={80} />
            </View>
            <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>OTP Verification</Text>
            <Text style={[styles.stepSubtitle, { color: theme.textSecondary }]}>
              We sent OTP verification code to your email
            </Text>
            <View style={styles.otpRow}>
              {otp.map((c, i) => (
                <View
                  key={i}
                  style={[
                    styles.otpBoxWrap,
                    {
                      backgroundColor: theme.inputBg,
                      borderColor: theme.inputBorder,
                    },
                    otp[i] && [styles.otpBoxWrapFilled, { borderColor: TEAL_FOCUS }],
                  ]}
                >
                  <TextInput
                    ref={(r) => { otpRefs.current[i] = r; }}
                    style={[styles.otpBoxInput, { color: theme.inputText }]}
                    value={c}
                    maxLength={1}
                    keyboardType="number-pad"
                    placeholderTextColor={theme.inputPlaceholder}
                    onChangeText={(t) => {
                      const ch = t.replace(/\D/g, '').slice(-1);
                      const next = [...otp];
                      next[i] = ch;
                      setOtp(next);
                      if (ch && i < OTP_LENGTH - 1) otpRefs.current[i + 1]?.focus();
                    }}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === 'Backspace' && !otp[i] && i > 0)
                        otpRefs.current[i - 1]?.focus();
                    }}
                    placeholder=""
                  />
                  <View style={[{ backgroundColor: theme.divider }]} />
                </View>
              ))}
            </View>
            <Button
              theme={theme}
              label={loading ? "Verifying..." : "Verify"}
              onPress={handleVerify}
              variant="primary"
              disabled={otpValue.length !== OTP_LENGTH || loading}
              style={[styles.verifyBtn, { backgroundColor: theme.accentFocus }]}
            />
            <View style={styles.resendWrap}>
              {canResend && (
                <Text style={[styles.resendText, { color: theme.textMuted }]}>Didn't get OTP? </Text>
              )}
              <Pressable
                onPress={handleResendOtp}
                disabled={!canResend}
                style={styles.resendLinkWrap}
              >
                <Text
                  style={[
                    styles.resendTimer,
                    { color: showWarning ? theme.error : theme.textPrimary },
                    canResend && [styles.resendLink, { color: theme.link }],
                  ]}
                >
                  {canResend ? 'Resend OTP' : `Resent OTP in ${formatTimer(resendSecs)}`}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      );
    }
  
    // —— Step 1: Create Password ——
    if (step === 1) {
      return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <KeyboardAvoidingView
            style={styles.keyboardAvoid}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.createPasswordContent}>
            <View style={styles.logoWrap}>
              <View style={[styles.logo, { backgroundColor: theme.accent }]}>
                <Image
                  source={require('../../assets/images/icon.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            </View>
            <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>Create Password</Text>
            <Text style={[styles.stepSubtitle, { color: theme.textSecondary }]}>Create new Password</Text>
            <View style={styles.form}>
              <Input
                theme={theme}
                label="New Password"
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
                theme={theme}
                label={resetPasswordLoading ? "Resetting Password..." : "Create Password"}
                disabled={resetPasswordLoading || password.length <=0 }
                onPress={handleCreatePassword}
                variant="primary"
                style={[styles.createPasswordBtn, { backgroundColor: theme.accent }]}
              />
            </View>
          </View>
          </KeyboardAvoidingView>
        </View>
      );
    }
  
    // —— Step 2: Password Created (Success) ——
    return (
      <View style={[styles.container, styles.successContainer, { backgroundColor: theme.background }]}>
        <View style={styles.successContent}>
          <View style={styles.iconWrap}>
            <SvgXml xml={lockSuccess} width={80} height={80} />
          </View>
          <Text style={[styles.successTitle, { color: theme.textPrimary }]}>Password Created</Text>
          <Text style={[styles.successMessage, { color: theme.textSecondary }]}>
            Your password is created Successfully
          </Text>
          <Button
            theme={theme}
            label="Login"
            onPress={handleLogin}
            variant="primary"
            style={[styles.loginBtn, { backgroundColor: theme.accent }]}
          />
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: 56,
      paddingBottom: 16,
     
    },
    backBtn: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: fonts.semiBold,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 32,
      paddingBottom: 24,
    },
    keyboardAvoid: {
      flex: 1,
    },
    createPasswordContent: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    iconWrap: {
      alignItems: 'center',
      marginBottom: 24,
    },
    stepTitle: {
      fontSize: 22,
      fontFamily: fonts.semiBold,
      textAlign: 'center',
      marginBottom: 8,
    },
    stepSubtitle: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 24,
    },
    otpRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 12,
      marginBottom: 24,
    },
    otpBoxWrap: {
      width: 36,
      height: 36,
      borderRadius: 12,
      borderWidth: 1,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    },
    otpBoxWrapFilled: {},
    otpBoxInput: {
      width: '100%',
      height: '100%',
      fontSize: 24,
      fontFamily: fonts.semiBold,
      textAlign: 'center',
      padding: 0,
    },
    otpBoxLine: {
      position: 'absolute',
      left: 8,
      right: 8,
      bottom: 12,
      height: 1,
    },
    verifyBtn: {
      marginBottom: 16,
    },
    resendWrap: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    resendText: {
      fontSize: 14,
    },
    resendLinkWrap: {
      padding: 4,
    },
    resendTimer: {
      fontSize: 14,
      fontFamily: fonts.semiBold,
    },
    resendLink: {
      fontSize: 14,
      fontFamily: fonts.medium,
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
    form: {
      marginBottom: 24,
    },
    inputAction: {
      padding: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    createPasswordBtn: {
      marginTop: 8,
    },
    successContainer: {
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    successContent: {
      alignItems: 'center',
      alignSelf: 'stretch',
    },
    successTitle: {
      fontSize: 22,
      fontFamily: fonts.semiBold,
      textAlign: 'center',
      marginBottom: 8,
    },
    successMessage: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 32,
    },
    loginBtn: {
      width: '100%',
      borderRadius:30,
    },
  });
  