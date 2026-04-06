import { AuthStepper } from '@/components/auth-stepper';
import { ScreenHeader } from '@/components/screen-header';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OPTIONS = [
  { id: 'national-id', label: 'National ID' },
  { id: 'passport', label: 'International passport' },
] as const;

const TOTAL_STEPS = 3;

export default function IdMethodScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safe}>
        <AuthStepper currentStep={2} totalSteps={TOTAL_STEPS} />
        <ScreenHeader theme={theme} title="ID verification" />
        <Text style={[styles.sub, { color: theme.textSecondary }]}>
          Choose how you&apos;d like to verify your identity.
        </Text>

        <View style={styles.list}>
          {OPTIONS.map((opt) => (
            <Pressable
              key={opt.id}
              onPress={() =>
                router.push({
                  pathname: '/(verification)/id-details',
                  params: { method: opt.id, methodLabel: opt.label },
                })
              }
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.divider,
                },
                pressed && { opacity: 0.9 },
              ]}>
              <Text style={[styles.cardLabel, { color: theme.textPrimary }]}>
                {opt.label}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
            </Pressable>
          ))}
        </View>
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
  },
  sub: {
    fontSize: 15,
    marginBottom: 20,
    lineHeight: 22,
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
