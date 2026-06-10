import { useSegments } from 'expo-router';

import { useRequireAuth } from '../../hooks/useRequireAuth';

/**
 * Mounted at the app root to redirect unauthenticated users away from protected stacks
 * (tabs, profile, booking, etc.) without wrapping every screen manually.
 */
export function AuthSessionGuard() {
  const segments = useSegments();
  const root = segments[0];

  const isPublicRoute =
    root === '(auth)' ||
    root === 'index' ||
    root === undefined ||
    segments.length === 0;

  /** Tabs and profile stacks use `AuthGate` for the same check. */
  const usesAuthGate = root === '(tabs)' || root === 'profile';

  useRequireAuth({ enabled: !isPublicRoute && !usesAuthGate });

  return null;
}
