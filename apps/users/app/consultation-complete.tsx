import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConsultationCompleteView } from '../components/appointment';
import { useTheme } from '../config/theme';

const DEFAULT_SUBTITLE =
  'Get Consultation Documents on Appointment History tab.';

/**
 * Full-screen route wrapping the reusable {@link ConsultationCompleteView}.
 * Wire navigation from appointment flow or reuse params for custom copy.
 */
export default function ConsultationCompleteScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top', 'bottom']}>
      <View style={{ flex: 1 }}>
        <ConsultationCompleteView
          title='Consultation Complete!'
          subtitle={DEFAULT_SUBTITLE}
          secondaryLabel='Back to Home'
          primaryLabel='View Reports'
          onSecondaryPress={() => router.replace('/(tabs)')}
          onPrimaryPress={() => router.replace('/(tabs)/history')}
        />
      </View>
    </SafeAreaView>
  );
}
