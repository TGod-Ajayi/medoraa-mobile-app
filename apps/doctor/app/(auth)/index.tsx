import { useDoctorStartupRoute } from '@/hooks/use-doctor-startup-route';
import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

/**
 * Default route when opening `/(auth)` without a child path.
 * Uses the same startup rules as `app/index.tsx`.
 */
export default function AuthIndexScreen() {
  const { ready, href } = useDoctorStartupRoute();

  if (!ready || !href) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color="#20BEB8" />
      </View>
    );
  }

  return <Redirect href={href} />;
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#20BEB8',
  },
});
