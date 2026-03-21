import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../config/theme';

/** Medicine tab — replace with pharmacy / order flow. */
export default function MedicineTabScreen() {
  const theme = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top']}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Medicine</Text>
      <Text style={[styles.sub, { color: theme.textSecondary }]}>
        Order medicines and track delivery.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  title: { fontSize: 22, fontWeight: '700' },
  sub: { fontSize: 15, marginTop: 8 },
});
