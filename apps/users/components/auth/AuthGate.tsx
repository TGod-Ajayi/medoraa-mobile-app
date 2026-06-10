import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTheme } from '../../config/theme';
import { useRequireAuth } from '../../hooks/useRequireAuth';

type Props = {
  children: ReactNode;
  /** Pass false on routes that handle their own session check (e.g. app entry). */
  enabled?: boolean;
};

/**
 * Renders children only for a valid session; otherwise shows a loader or redirects to login.
 */
export function AuthGate({ children, enabled = true }: Props) {
  const theme = useTheme();
  const { isChecking, isAuthenticated } = useRequireAuth({ enabled });

  if (!enabled) {
    return children;
  }

  if (isChecking || !isAuthenticated) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size='large' color={theme.accent} />
      </View>
    );
  }

  return children;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
