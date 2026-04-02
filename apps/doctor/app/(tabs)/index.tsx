import { useTheme } from '@/config/theme';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safe}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Medicare Doctor</Text>
        <Text style={[styles.sub, { color: theme.textSecondary }]}>
          Your dashboard will appear here after verification.
        </Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  sub: {
    fontSize: 15,
    lineHeight: 22,
  },
});
