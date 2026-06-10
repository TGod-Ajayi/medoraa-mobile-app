import { useApolloClient } from '@apollo/client/react';
import { tryRestoreSessionWithRefresh, useUser } from '@repo/ui/graphql';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { clearAuthSession } from '../lib/auth-session';

type AuthPhase = 'idle' | 'checking-token' | 'loading-user' | 'authenticated' | 'redirecting';

type Options = {
  /** When false, the hook does nothing (e.g. on public auth screens). */
  enabled?: boolean;
};

function isSessionErrorMessage(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes('getuser') ||
    lower.includes('non-nullable') ||
    lower.includes('unauthorized') ||
    lower.includes('unauthenticated') ||
    lower.includes('not authenticated') ||
    lower.includes('patient profile not found')
  );
}

/**
 * Guards authenticated routes: validates the stored session, loads `getUser`,
 * and redirects to login when the user is not signed in or the session is invalid.
 */
export function useRequireAuth(options?: Options) {
  const enabled = options?.enabled ?? true;
  const router = useRouter();
  const client = useApolloClient();
  const redirectingRef = useRef(false);

  const [phase, setPhase] = useState<AuthPhase>(enabled ? 'checking-token' : 'idle');

  const redirectToLogin = useCallback(async () => {
    if (redirectingRef.current) return;
    redirectingRef.current = true;
    setPhase('redirecting');
    try {
      await clearAuthSession(client);
      router.replace('/(auth)/login');
    } finally {
      redirectingRef.current = false;
    }
  }, [client, router]);

  useEffect(() => {
    if (!enabled) {
      setPhase('idle');
      return;
    }

    let cancelled = false;
    redirectingRef.current = false;
    setPhase('checking-token');

    (async () => {
      const sessionOk = await tryRestoreSessionWithRefresh();
      if (cancelled) return;

      if (!sessionOk) {
        await redirectToLogin();
        return;
      }

      setPhase('loading-user');
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, redirectToLogin]);

  const shouldLoadUser = enabled && phase === 'loading-user';
  const { user, loading, error } = useUser({ skip: !shouldLoadUser });

  useEffect(() => {
    if (!shouldLoadUser || loading) return;

    if (user) {
      setPhase('authenticated');
      return;
    }

    const message = error?.message ?? '';
    if (error && isSessionErrorMessage(message)) {
      void redirectToLogin();
      return;
    }

    if (!user) {
      void redirectToLogin();
    }
  }, [shouldLoadUser, user, loading, error, redirectToLogin]);

  const isAuthenticated = enabled && phase === 'authenticated' && !!user;
  const isChecking = enabled && !isAuthenticated && phase !== 'idle';

  return {
    user: isAuthenticated ? user : null,
    isChecking,
    isAuthenticated,
  };
}
