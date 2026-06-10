import { useApolloClient } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { showMessage } from 'react-native-flash-message';

import { clearAuthSession } from '../../lib/auth-session';

export function useLogout() {
  const router = useRouter();
  const client = useApolloClient();
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await clearAuthSession(client);
      router.replace('/(auth)/login');
    } catch {
      showMessage({
        message: 'Could not sign out. Try again.',
        type: 'danger',
        duration: 4000,
      });
    } finally {
      setLoggingOut(false);
    }
  }, [client, loggingOut, router]);

  return { logout, loggingOut };
}
