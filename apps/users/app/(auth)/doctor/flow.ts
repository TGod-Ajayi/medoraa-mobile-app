/**
 * Ordered routes for the doctor onboarding / verification flow.
 * Splash & marketing onboarding live outside this folder: (auth)/onboarding, initial sign-up: (auth)/sign-up.
 */
export const DOCTOR_AUTH_FLOW = {
  /** Step 1 — personal info */
  registrationDetails: '/(auth)/doctor/registration-details',
  /** Step 2 — profile photo */
  uploadPhoto: '/(auth)/doctor/upload-photo',
  /** Step 3 — password */
  setPassword: '/(auth)/doctor/set-password',
  /** Step 4 — success before verification */
  accountCreated: '/(auth)/doctor/account-created',
  /** Step 5 — verification intro */
  verificationIntro: '/(auth)/doctor/verification-intro',
  /** Step 6 — ID type */
  idSelection: '/(auth)/doctor/id-selection',
  /** Step 7 — ID details + uploads */
  idDetails: '/(auth)/doctor/id-details',
  /** Step 8 — medical school, certs */
  medicalQualification: '/(auth)/doctor/medical-qualification',
  /** Step 9 — clinic + specialization */
  clinicDetails: '/(auth)/doctor/clinic-details',
  /** Step 10 — submitted / pending review */
  submissionStatus: '/(auth)/doctor/submission-status',
} as const;
