import { Button } from '../../../components';
import { useTheme } from '../../../config/theme';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/** Submission under review — 12–72h */
export default function SubmissionStatusScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={[styles.flex, { backgroundColor: theme.background }]}>
      <View style={styles.center}>
        <Ionicons name='time-outline' size={56} color={theme.accent} style={{ marginBottom: 20 }} />
        <Text style={[styles.title, { color: theme.textPrimary }]}>Under review</Text>
        <Text style={[styles.body, { color: theme.textSecondary }]}>
          Your submission is under review. Our medical team will verify your profile — this usually
          takes between 12 and 72 hours. We will notify you when you are approved.
        </Text>
        <Button
          label='Back to home'
          onPress={() => router.replace('/(tabs)')}
          variant='primary'
          style={[styles.cta, { backgroundColor: theme.accent }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  cta: { alignSelf: 'stretch' },
});
