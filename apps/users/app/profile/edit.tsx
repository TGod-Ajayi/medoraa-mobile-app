import { Ionicons } from '@expo/vector-icons';
import { useState, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Transition from 'react-native-screen-transitions';

import { DatePickerBottomSheet } from '../../components/appointment';
import { ScreenHeader } from '../../components/doctor';
import {
  CountryPickerBottomSheet,
  COUNTRIES,
  GenderPickerBottomSheet,
  type Country,
} from '../../components/profile';
import { fonts } from '../../config/fonts';
import { useTheme, type AppTheme } from '../../config/theme';

const GENDERS = ['Male', 'Female', 'Other'];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatDate(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function flagEmoji(code: string): string {
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join('');
}

/**
 * Edit profile form — matches design: labels, bordered inputs, trailing icons, Save CTA.
 */
export default function EditProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('Amilie Jacson');
  const [email, setEmail] = useState('amiliejacson@gmail.com');
  /** Same calendar bottom sheet as `patient-details.tsx` */
  const [dob, setDob] = useState(new Date(1998, 10, 22)); // 22 Nov 1998
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [country, setCountry] = useState<Country>(
    COUNTRIES.find((c) => c.code === 'BD') ?? COUNTRIES[0],
  );
  const [countryOpen, setCountryOpen] = useState(false);
  const [contact, setContact] = useState('+880 16 26 86 50 21');
  const [gender, setGender] = useState('Male');
  const [genderOpen, setGenderOpen] = useState(false);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <ScreenHeader title='Edit Profile' />

        <Transition.ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}>
          <Field label='Name' theme={theme}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.textPrimary, borderColor: theme.divider, backgroundColor: theme.card }]}
              autoCapitalize='words'
              autoCorrect={false}
            />
          </Field>

          <Field label='Email' theme={theme}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.textPrimary, borderColor: theme.divider, backgroundColor: theme.card }]}
              keyboardType='email-address'
              autoCapitalize='none'
              autoCorrect={false}
            />
          </Field>

          <Field label='Date of Birth' theme={theme}>
            <Pressable
              onPress={() => setCalendarOpen(true)}
              style={({ pressed }) => [pressed && styles.pressed]}
              accessibilityRole='button'
              accessibilityLabel='Select date of birth'>
              <View
                style={[
                  styles.inputRow,
                  { borderColor: theme.divider, backgroundColor: theme.card },
                ]}>
                <Text style={[styles.inputRowText, { color: theme.textPrimary }]} numberOfLines={1}>
                  {formatDate(dob)}
                </Text>
                <Ionicons name='calendar-outline' size={20} color={theme.textSecondary} />
              </View>
            </Pressable>
          </Field>

          <Field label='Country' theme={theme}>
            <Pressable
              onPress={() => setCountryOpen(true)}
              style={({ pressed }) => [
                styles.inputRow,
                { borderColor: theme.divider, backgroundColor: theme.card },
                pressed && styles.pressed,
              ]}
              accessibilityRole='button'
              accessibilityLabel='Select country'>
              <Text style={styles.flag}>{flagEmoji(country.code)}</Text>
              <Text style={[styles.inputRowText, { color: theme.textPrimary }]} numberOfLines={1}>
                {country.name}
              </Text>
              <Ionicons name='chevron-down' size={20} color={theme.textSecondary} />
            </Pressable>
          </Field>

          <Field label='Contact Number' theme={theme}>
            <TextInput
              value={contact}
              onChangeText={setContact}
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.textPrimary, borderColor: theme.divider, backgroundColor: theme.card }]}
              keyboardType='phone-pad'
            />
          </Field>

          <Field label='Gender' theme={theme}>
            <Pressable
              onPress={() => setGenderOpen(true)}
              style={({ pressed }) => [
                styles.inputRow,
                { borderColor: theme.divider, backgroundColor: theme.card },
                pressed && styles.pressed,
              ]}
              accessibilityRole='button'
              accessibilityLabel='Select gender'>
              <Text style={[styles.inputRowText, { color: theme.textPrimary }]}>{gender}</Text>
              <Ionicons name='chevron-down' size={20} color={theme.textSecondary} />
            </Pressable>
          </Field>
        </Transition.ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Pressable
            style={({ pressed }) => [
              styles.saveBtn,
              { backgroundColor: theme.accent },
              pressed && styles.savePressed,
            ]}
            accessibilityRole='button'
            accessibilityLabel='Save changes'>
            <Text style={[styles.saveText, { fontFamily: fonts.semiBold }]}>Save Changes</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <DatePickerBottomSheet
        visible={calendarOpen}
        selected={dob}
        onConfirm={(date) => setDob(date)}
        onClose={() => setCalendarOpen(false)}
      />

      <CountryPickerBottomSheet
        visible={countryOpen}
        selected={country}
        onSelect={(c) => {
          setCountry(c);
          setCountryOpen(false);
        }}
        onClose={() => setCountryOpen(false)}
      />

      <GenderPickerBottomSheet
        visible={genderOpen}
        selected={gender}
        onSelect={(g) => {
          setGender(g);
          setGenderOpen(false);
        }}
        onClose={() => setGenderOpen(false)}
      />
    </SafeAreaView>
  );
}

function Field({
  label,
  theme,
  children,
}: {
  label: string;
  theme: AppTheme;
  children: ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.textPrimary }]}>{label}</Text>
      <View style={styles.fieldBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: fonts.regular,
  },
  fieldBody: {
    position: 'relative',
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.select({ ios: 14, default: 12 }),
    fontSize: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.select({ ios: 14, default: 12 }),
    minHeight: 48,
  },
  inputRowText: {
    flex: 1,
    fontSize: 15,
    marginRight: 8,
  },
  flag: {
    fontSize: 22,
    lineHeight: 26,
    marginRight: 4,
  },
  pressed: {
    opacity: 0.92,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  saveBtn: {
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savePressed: {
    opacity: 0.92,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
