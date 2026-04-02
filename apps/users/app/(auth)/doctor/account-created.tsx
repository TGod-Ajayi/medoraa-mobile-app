import { Button } from '../../../components';
import { useTheme } from '../../../config/theme';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { DOCTOR_AUTH_FLOW } from './flow';

/** Account created — proceed to doctor verification */
export default function AccountCreatedScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={[styles.flex, { backgroundColor: theme.background }]}>
      <View style={styles.center}>
        <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
          <Ionicons name='checkmark-circle' size={64} color='#22C55E' />
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Account created!</Text>
        <Text style={[styles.body, { color: theme.textSecondary }]}>
          Your account is ready. Complete your professional profile for verification to start
          practicing on MediCare.
        </Text>
        <Button
          label='Proceed now'
          onPress={() => router.push(DOCTOR_AUTH_FLOW.verificationIntro)}
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
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
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
