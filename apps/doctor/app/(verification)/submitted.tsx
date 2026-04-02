import { Button } from '@/components';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubmittedScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <View style={[styles.iconCircle, { backgroundColor: `${theme.accent}22` }]}>
            <Ionicons name="checkmark-done" size={56} color={theme.accent} />
          </View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Submitted</Text>
          <Text style={[styles.sub, { color: theme.textSecondary }]}>
            Your submission is under review. You will be notified via email once your account has been
            verified.
          </Text>
        </View>
        <Button
          theme={theme}
          label="Go to home"
          onPress={() => router.replace('/(tabs)')}
        />
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
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  sub: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
