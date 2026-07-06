import { VerificationProgressProvider } from '@/context/verification-progress';
import { Stack } from 'expo-router';

export default function VerificationLayout() {
  return (
    <VerificationProgressProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </VerificationProgressProvider>
  );
}
