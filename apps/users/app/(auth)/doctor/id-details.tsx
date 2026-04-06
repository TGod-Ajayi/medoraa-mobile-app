import { Button, Input } from '../../../components';
import { ScreenHeader } from '../../../components/doctor';
import { useTheme } from '../../../config/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

import { DOCTOR_AUTH_FLOW } from './flow';

/** ID number, expiry, front upload — `idType` from id-selection */
export default function IdDetailsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { idType } = useLocalSearchParams<{ idType?: string }>();
  const [idNumber, setIdNumber] = useState('');
  const [expiry, setExpiry] = useState('');

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title='ID details' />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}>
        {idType ? (
          <Text style={[styles.meta, { color: theme.textMuted }]}>
            Document: {idType.replace('_', ' ')}
          </Text>
        ) : null}
        <Input
          theme={theme}
          label='ID number'
          placeholder='Enter ID number'
          value={idNumber}
          onChangeText={setIdNumber}
        />
        <Input
          theme={theme}
          label='Expiry date'
          placeholder='DD/MM/YYYY'
          value={expiry}
          onChangeText={setExpiry}
        />
        <Pressable
          style={[styles.uploadZone, { borderColor: theme.divider, backgroundColor: theme.card }]}
          accessibilityRole='button'>
          <Text style={{ color: theme.textSecondary }}>Upload front of ID</Text>
        </Pressable>
        <Button
          label='Continue'
          onPress={() => router.push(DOCTOR_AUTH_FLOW.medicalQualification)}
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
  meta: { fontSize: 13, marginBottom: 12 },
  uploadZone: {
    minHeight: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cta: { marginTop: 8 },
});
