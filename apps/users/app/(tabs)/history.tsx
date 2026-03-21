import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../config/theme';

/** History tab — replace with past visits / orders. */
export default function HistoryTabScreen() {
  const theme = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top']}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>History</Text>
      <Text style={[styles.sub, { color: theme.textSecondary }]}>
        Your past consultations and orders.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  title: { fontSize: 22, fontWeight: '700' },
  sub: { fontSize: 15, marginTop: 8 },
});
