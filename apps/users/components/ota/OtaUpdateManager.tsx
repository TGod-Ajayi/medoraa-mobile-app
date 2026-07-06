import * as Updates from 'expo-updates';
import { useEffect } from 'react';

/**
 * Checks for EAS Update bundles on app launch and reloads when a new one is available.
 * Skipped in dev (Metro) where expo-updates is disabled.
 */
export function OtaUpdateManager() {
  useEffect(() => {
    if (__DEV__ || !Updates.isEnabled) {
      return;
    }

    void (async () => {
      try {
        const result = await Updates.checkForUpdateAsync();

        if (!result.isAvailable) {
          return;
        }

        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      } catch (error) {
        console.warn('[OTA] Failed to check for updates', error);
      }
    })();
  }, []);

  return null;
}
