import { Button, Input } from '@/components';
import { AuthStepper } from '@/components/auth-stepper';
import { DatePickerBottomSheet } from '@/components/DatePickerBottomSheet';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { SvgXml } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { padlock } from '@/config/svg';

const { width: SCREEN_W } = Dimensions.get('window');
const SLIDE_DURATION = 380;
const SLIDE_EASING = Easing.out(Easing.cubic);

const GENDERS = ['Male', 'Female'] as const;
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatDate(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const TOTAL_STEPS = 3;

export default function RegisterProfileScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 25);
    return d;
  });
  const [dobSheetOpen, setDobSheetOpen] = useState(false);
  const [genderSheetOpen, setGenderSheetOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pwVisible, setPwVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // Slide animation values
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scrollRef = useRef<ScrollView>(null);

  const stepRef = useRef(step);

  // Named JS function so Reanimated's Babel plugin does NOT workletize it.
  // Passing an inline arrow to runOnJS() inside a worklet causes a crash because
  // the plugin tries to workletize it, which fails for non-serializable React refs.
  function resetScroll() {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }

  function goToStep(next: number) {
    const direction = next > stepRef.current ? 1 : -1;
    stepRef.current = next;

    opacity.value = withTiming(0, { duration: SLIDE_DURATION / 2, easing: SLIDE_EASING });
    translateX.value = withTiming(
      -direction * SCREEN_W * 0.28,
      { duration: SLIDE_DURATION / 2, easing: SLIDE_EASING },
      () => {
        'worklet';
        translateX.value = direction * SCREEN_W * 0.28;
        runOnJS(setStep)(next);
        runOnJS(resetScroll)();
        opacity.value = withTiming(1, { duration: SLIDE_DURATION / 2, easing: SLIDE_EASING });
        translateX.value = withTiming(0, { duration: SLIDE_DURATION / 2, easing: SLIDE_EASING });
      },
    );
  }

  // Reset scroll on step change
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [step]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  function handleContinue() {
    if (step < TOTAL_STEPS) {
      goToStep(step + 1);
    } else {
      router.push('/(auth)/account-created');
    }
  }

  async function pickImageFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  const ctaLabel = step === 1 ? 'Continue' : step === 2 ? 'Save and continue' : 'Set Password';

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.safe}>
        {/* ── Stepper at the top ── */}
        <AuthStepper currentStep={step} totalSteps={TOTAL_STEPS} />
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>

          {/* ── Animated step content ── */}
          <Animated.View style={contentStyle}>

            {/* ── STEP 1: Profile ── */}
            {step === 1 && (
              <View>
                <Text style={[styles.title, { color: theme.textPrimary }]}>
                  Complete your registration
                </Text>
                <Input
               
                  theme={theme}
                  label="First Name"
                  placeholder="First name"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
                <Input
                  theme={theme}
                  label="Last Name"
                  placeholder="Last name"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
                <View style={styles.dobBlock}>
                  <Text style={[styles.fieldLabel, { color: theme.inputLabel }]}>Date of Birth</Text>
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
                <View style={styles.dobBlock}>
                  <Text style={[styles.fieldLabel, { color: theme.inputLabel }]}>Gender</Text>
                  <Pressable
                    onPress={() => setGenderSheetOpen(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Select gender">
                    <View
                      style={[
                        styles.dobRow,
                        { backgroundColor: theme.inputBg, borderColor: theme.inputBorder },
                      ]}>
                      <Text
                        style={[
                          styles.dobText,
                          { color: gender ? theme.inputText : theme.inputPlaceholder },
                        ]}
                        numberOfLines={1}>
                        {gender || 'Select gender'}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
                    </View>
                  </Pressable>
                </View>
              </View>
            )}

            {/* ── STEP 2: Upload photo ── */}
            {step === 2 && (
              <View>
                <Text style={[styles.title, { color: theme.textPrimary }]}>
                  Upload your picture
                </Text>
                <View style={styles.avatarWrap}>
                  <View
                    style={[
                      styles.avatarCircle,
                      { backgroundColor: '#BEC8D4' },
                    ]}>
                    {photoUri ? (
                      <Image source={{ uri: photoUri }} style={styles.avatarImage} />
                    ) : (
                      <Ionicons name="person-outline" size={72} color="#8EA0B5" />
                    )}
                  </View>
                </View>
                <View style={styles.uploadBtnWrap}>
                  <TouchableOpacity
                    style={[
                      styles.uploadBtn,
                      { borderColor: theme.accent },
                    ]}
                    onPress={pickImageFromGallery}>
                    <Text style={[styles.uploadBtnText, { color: theme.accent }]}>
                      Upload a photo
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* ── STEP 3: Password ── */}
            {step === 3 && (
              <View>
                <Text style={[styles.title, { color: theme.textPrimary }]}>
                  Create a password
                </Text>
                <Input
                  theme={theme}
                  label="Password"
                  placeholder="Create password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!pwVisible}
                  leftIcon={
                    <SvgXml xml={padlock} width={24} height={24} />
                  }
                  rightContent={
                    <Pressable onPress={() => setPwVisible((v) => !v)} hitSlop={8}>
                      <Ionicons
                        name={pwVisible ? 'eye-off-outline' : 'eye-outline'}
                        size={22}
                        color={theme.textMuted}
                      />
                    </Pressable>
                  }
                />
                <Input
                  theme={theme}
                  label="Confirm Password"
                  placeholder="Confirm password"
                  value={confirm}
                  onChangeText={setConfirm}
                  secureTextEntry={!confirmVisible}
                  leftIcon={
                    <SvgXml xml={padlock} width={24} height={24} />
                  }
                  rightContent={
                    <Pressable onPress={() => setConfirmVisible((v) => !v)} hitSlop={8}>
                      <Ionicons
                        name={confirmVisible ? 'eye-off-outline' : 'eye-outline'}
                        size={22}
                        color={theme.textMuted}
                      />
                    </Pressable>
                  }
                />
              </View>
            )}
          </Animated.View>
        </ScrollView>

        {/* ── Sticky CTA ── */}
        <View style={styles.footer}>
          <Button
            theme={theme}
            label={ctaLabel}
            onPress={handleContinue}
            style={{ backgroundColor: theme.accent, borderRadius: 30 }}
          />
        </View>
      </SafeAreaView>

      <DatePickerBottomSheet
        visible={dobSheetOpen}
        selected={dob}
        onConfirm={(date) => setDob(date)}
        onClose={() => setDobSheetOpen(false)}
      />
      <Modal
        transparent
        animationType="fade"
        visible={genderSheetOpen}
        onRequestClose={() => setGenderSheetOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setGenderSheetOpen(false)}>
          <View
            style={[styles.genderSheet, { backgroundColor: theme.card }]}
            onStartShouldSetResponder={() => true}>
            {GENDERS.map((option) => {
              const isSelected = gender === option;
              return (
                <Pressable
                  key={option}
                  style={styles.genderOption}
                  onPress={() => {
                    setGender(option);
                    setGenderSheetOpen(false);
                  }}>
                  <Text
                    style={[
                      styles.genderOptionText,
                      {
                        color: isSelected ? theme.accent : theme.textPrimary,
                      },
                    ]}>
                    {option}
                  </Text>
                  {isSelected ? (
                    <Ionicons name="checkmark" size={20} color={theme.accent} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
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
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
 
    marginBottom: 24,
  },
  /* DOB picker */
  fieldLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  dobBlock: {
    marginBottom: 16,
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
  /* Upload photo */
  avatarWrap: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 28,
  },
  avatarCircle: {
    width: 156,
    height: 156,
    borderRadius: 78,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  uploadBtnWrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadBtn: {
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  uploadBtnText: {
    fontSize: 14,
    fontWeight: '500',
  },
  /* Footer */
  footer: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  genderSheet: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  genderOption: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  genderOptionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
