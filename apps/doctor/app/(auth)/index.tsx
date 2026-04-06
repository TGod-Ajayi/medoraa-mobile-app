import { useTheme } from '@/config/theme';
import { Redirect, useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Splash — logo on teal (matches native splash background).
 */
export default function SplashScreen() {
  const theme = useTheme();
  

  return (
    <View style={[styles.root, { backgroundColor: theme.accent }]}>
     <Redirect href="/(auth)/onboarding" />
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
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 28,
  },
  appName: {
    marginTop: 16,
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cta: {
    minHeight: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
});
