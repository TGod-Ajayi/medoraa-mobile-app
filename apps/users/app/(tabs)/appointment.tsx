import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../config/theme';

/** Appointment tab — replace with calendar / bookings. */
export default function AppointmentTabScreen() {
  const theme = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top']}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Appointment</Text>
      <Text style={[styles.sub, { color: theme.textSecondary }]}>
        Manage your upcoming visits.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  title: { fontSize: 22, fontWeight: '700' },
  sub: { fontSize: 15, marginTop: 8 },
});
