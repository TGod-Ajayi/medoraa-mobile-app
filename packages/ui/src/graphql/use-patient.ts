import * as Hooks from './modules/hooks';
import type { GetPatientQuery } from './modules/types';

/** Single patient fetched via `patient(id)`. */
export type PatientDetail = NonNullable<GetPatientQuery['patient']>;

/**
 * Lazy-loads a patient by id via `patient(id)`.
 */
export function usePatientLazy() {
  const [fetchPatient, result] = Hooks.useGetPatientLazyQuery({
    fetchPolicy: 'cache-and-network',
  });

  return {
    fetchPatient,
    patient: result.data?.patient ?? null,
    loading: result.loading,
    error: result.error,
  };
}
