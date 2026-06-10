import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DoctorDetailsView } from '../components/doctor';
import { fonts } from '../config/fonts';
import { useTheme } from '../config/theme';

export default function DoctorDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { doctorId } = useLocalSearchParams<{ doctorId?: string | string[] }>();
  const resolvedDoctorId = Array.isArray(doctorId) ? doctorId[0] : doctorId;

  if (!resolvedDoctorId) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.background, padding: 24 }}
        edges={['top', 'bottom']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              color: theme.textSecondary,
              fontFamily: fonts.regular,
              textAlign: 'center',
            }}>
            Doctor not found.
          </Text>
          <Text
            onPress={() => router.back()}
            style={{
              color: theme.accent,
              fontFamily: fonts.semiBold,
              marginTop: 12,
            }}>
            Go back
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return <DoctorDetailsView doctorId={resolvedDoctorId} />;
}
