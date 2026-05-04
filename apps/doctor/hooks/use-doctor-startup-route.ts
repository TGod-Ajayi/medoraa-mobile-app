import { tryRestoreSessionWithRefresh } from '@repo/ui/graphql';
import type { Href } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

const TOKEN_KEY = 'token';

/** Persisted when the user leaves the marketing onboarding flow. */
export const DOCTOR_ONBOARDING_SEEN_KEY = 'medoraa_doctor_onboarding_seen';

export async function markDoctorOnboardingSeen(): Promise<void> {
  await SecureStore.setItemAsync(DOCTOR_ONBOARDING_SEEN_KEY, 'true');
}

type StartupState = {
  ready: boolean;
  href: Href | null;
};

/**
 * Resolves the first screen after cold start:
 * - Valid (non-expired) JWT → main tabs
 * - No JWT but onboarding already seen → sign-in
 * - Otherwise → onboarding
 */
export function useDoctorStartupRoute(): StartupState {
  const [state, setState] = useState<StartupState>({
    ready: false,
    href: null,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [token, onboardingSeen] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          SecureStore.getItemAsync(DOCTOR_ONBOARDING_SEEN_KEY),
        ]);
        console.log('[doctor-startup] token from SecureStore:', token);
        console.log('[doctor-startup] onboarding seen flag:', onboardingSeen);

        let href: Href = '/(auth)/onboarding';
        const sessionOk = await tryRestoreSessionWithRefresh();
        console.log('[doctor-startup] session valid (access or refresh):', sessionOk);

        if (sessionOk) {
          href = '/(tabs)';
        } else if (onboardingSeen === 'true') {
          href = '/(auth)/sign-in';
        }
        console.log('[doctor-startup] chosen route:', href);

        if (!cancelled) {
          setState({ ready: true, href });
        }
      } catch (error) {
        console.log('[doctor-startup] startup route error:', error);
        if (!cancelled) {
          setState({ ready: true, href: '/(auth)/onboarding' });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
