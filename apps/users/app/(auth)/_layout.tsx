import { isTokenExpired } from '@repo/ui/graphql';
import { Slot, useRouter } from 'expo-router';
import { getItemAsync } from 'expo-secure-store';
import { useEffect } from 'react';

/**
 * If a valid access token exists, skip the entire auth group (onboarding, login, etc.).
 */
export default function AuthLayout() {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const token = await getItemAsync('token');
        if (!active) return;
        if (token && !isTokenExpired(token)) {
          router.replace('/(tabs)');
        }
      } catch {
        /* stay on auth */
      }
    })();
    return () => {
      active = false;
    };
  }, [router]);

  return <Slot />;
}
