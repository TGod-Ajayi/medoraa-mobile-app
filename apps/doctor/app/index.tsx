import { useDoctorStartupRoute } from '@/hooks/use-doctor-startup-route';
import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Index() {
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
    backgroundColor: '#FFFFFF',
  },
});
