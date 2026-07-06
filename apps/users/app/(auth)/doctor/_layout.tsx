import { Stack } from 'expo-router';

/**
 * Doctor registration & verification flow (MediCare design).
 * Order: see ./flow.ts
 */
export default function DoctorOnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  );
}
