import { Button } from '../../../components';
import { ScreenHeader } from '../../../components/doctor';
import { useTheme } from '../../../config/theme';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { DOCTOR_AUTH_FLOW } from './flow';

/** Intro — ID + medical qualification required */
export default function VerificationIntroScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={[styles.flex, { backgroundColor: theme.background }]}>
      <ScreenHeader title='Verify identity' />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Doctor verification</Text>
        <Text style={[styles.body, { color: theme.textSecondary }]}>
          To keep patients safe, we need a government-issued ID and proof of your medical
          qualification. You can upload documents in the next steps.
        </Text>
        <Button
          label='Accept and continue'
          onPress={() => router.push(DOCTOR_AUTH_FLOW.idSelection)}
          variant='primary'
          style={[styles.cta, { backgroundColor: theme.accent }]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 32 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  body: { fontSize: 15, lineHeight: 22, marginBottom: 24 },
  cta: { marginTop: 8 },
});
