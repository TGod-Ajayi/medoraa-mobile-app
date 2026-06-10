import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConsultationCompleteView, safeDecodeParam } from '../components/appointment';
import { useTheme } from '../config/theme';

export default function ConsultationCompleteScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{
    appointmentId?: string;
    dateTimeLabel?: string;
    doctorName?: string;
  }>();

  const doctorName = safeDecodeParam(
    Array.isArray(params.doctorName) ? params.doctorName[0] : params.doctorName,
    'your doctor',
  );
  const dateTimeLabel = safeDecodeParam(
    Array.isArray(params.dateTimeLabel)
      ? params.dateTimeLabel[0]
      : params.dateTimeLabel,
    '',
  );

  const subtitle = dateTimeLabel
    ? `Your appointment with ${doctorName} is booked for ${dateTimeLabel}. You can view it in the Appointments tab.`
    : `Your appointment with ${doctorName} is confirmed. You can view it in the Appointments tab.`;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={['top', 'bottom']}>
      <View style={{ flex: 1 }}>
        <ConsultationCompleteView
          title='Appointment booked!'
          subtitle={subtitle}
          secondaryLabel='Back to Home'
          primaryLabel='View appointments'
          onSecondaryPress={() => router.replace('/(tabs)')}
          onPrimaryPress={() => router.replace('/(tabs)/appointment')}
        />
      </View>
    </SafeAreaView>
  );
}
