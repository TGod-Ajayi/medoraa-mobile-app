import { isTokenExpired } from '@repo/ui/graphql';
import { useTheme } from '../config/theme';
import { useRouter } from 'expo-router';
import { getItemAsync } from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function IndexScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function redirect() {
      try {
        const token = await getItemAsync('token');
        const expired = isTokenExpired(token);

        if (cancelled) return;

        if (token && !expired) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/onboarding');
        }
      } catch {
        if (!cancelled) router.replace('/(auth)/onboarding');
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    redirect();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
