import { Button, Input } from '../../../components';
import { DatePickerBottomSheet } from '../../../components/appointment';
import { ScreenHeader } from '../../../components/doctor';
import { useTheme } from '../../../config/theme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { envelope } from '@/config/svg';

import { DOCTOR_AUTH_FLOW } from './flow';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatDate(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Complete registration — name, email, phone, date of birth */
export default function RegistrationDetailsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 25);
    return d;
  });
  const [dobOpen, setDobOpen] = useState(false);

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title='Complete registration' />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.lead, { color: theme.textSecondary }]}>
          Tell us a bit about yourself to continue.
        </Text>

        <Input
          theme={theme}
          label='Full name'
          placeholder='Your name'
          value={name}
          onChangeText={setName}
          autoCapitalize='words'
          leftIcon={<SvgXml xml={envelope} />}
        />
        <Input
          theme={theme}
          label='Email'
          placeholder='example@gmail.com'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
          leftIcon={<SvgXml xml={envelope} />}
        />
        <Input
          theme={theme}
          label='Phone number'
          placeholder='+1 …'
          value={phone}
          onChangeText={setPhone}
          keyboardType='phone-pad'
          leftIcon={<SvgXml xml={envelope} />}
        />

        <View style={styles.dobBlock}>
          <Text style={[styles.dobLabel, { color: theme.inputLabel }]}>Date of birth</Text>
          <Pressable
            onPress={() => setDobOpen(true)}
            accessibilityRole='button'
            accessibilityLabel='Select date of birth'>
            <View
              style={[
                styles.dobRow,
                { backgroundColor: theme.inputBg, borderColor: theme.inputBorder },
              ]}>
              <Text style={[styles.dobText, { color: theme.inputText }]} numberOfLines={1}>
                {formatDate(dob)}
              </Text>
              <Ionicons name='calendar-outline' size={20} color={theme.textSecondary} />
            </View>
          </Pressable>
        </View>

        <Button
          label='Continue'
          onPress={() => router.push(DOCTOR_AUTH_FLOW.uploadPhoto)}
          variant='primary'
          style={[styles.cta, { backgroundColor: theme.accent }]}
        />
      </ScrollView>

      <DatePickerBottomSheet
        visible={dobOpen}
        selected={dob}
        onConfirm={(date) => setDob(date)}
        onClose={() => setDobOpen(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  lead: {
    fontSize: 14,
    marginBottom: 20,
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
  cta: {
    marginTop: 8,
  },
});
