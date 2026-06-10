import { Redirect } from 'expo-router';

import { DOCTOR_AUTH_FLOW } from './flow';

/** Entry: first step of doctor onboarding */
export default function DoctorOnboardingIndex() {
  return <Redirect href={DOCTOR_AUTH_FLOW.registrationDetails} />;
}
