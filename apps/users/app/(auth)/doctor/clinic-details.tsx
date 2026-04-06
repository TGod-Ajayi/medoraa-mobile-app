import { Button, Input } from '../../../components';
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
import { Ionicons } from '@expo/vector-icons';

import { DOCTOR_AUTH_FLOW } from './flow';

/** Clinic name, location, specialization */
export default function ClinicDetailsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [clinicName, setClinicName] = useState('');
  const [state, setState] = useState('');
  const [street, setStreet] = useState('');

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title='Clinic details' />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}>
        <Input
          theme={theme}
          label='Clinic name'
          placeholder='Your practice name'
          value={clinicName}
          onChangeText={setClinicName}
        />
        <Input
          theme={theme}
          label='State / Province'
          placeholder=''
          value={state}
          onChangeText={setState}
        />
        <Input
          theme={theme}
          label='Street address'
          placeholder=''
          value={street}
          onChangeText={setStreet}
        />
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.inputLabel }]}>Specialization</Text>
          <Pressable
            style={[
              styles.selectRow,
              { backgroundColor: theme.inputBg, borderColor: theme.inputBorder },
            ]}
            accessibilityRole='button'>
            <Text style={{ color: theme.inputPlaceholder }}>Select specialization</Text>
            <Ionicons name='chevron-down' size={20} color={theme.textSecondary} />
          </Pressable>
        </View>
        <Button
          label='Submit'
          onPress={() => router.push(DOCTOR_AUTH_FLOW.submissionStatus)}
          variant='primary'
          style={[styles.cta, { backgroundColor: theme.accent }]}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 32 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 8, fontWeight: '500' },
  selectRow: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cta: { marginTop: 8 },
});
