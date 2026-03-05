import { isTokenExpired } from '@repo/ui/graphql';
import { useRouter } from 'expo-router';
import { getItemAsync } from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function IndexScreen() {
  const router = useRouter();
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
          router.replace('/(auth)/splash');
        }
      } catch {
        if (!cancelled) router.replace('/(auth)/splash');
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D9488' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return null;
}
