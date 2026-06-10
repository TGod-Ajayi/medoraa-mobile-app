import * as Hooks from './modules/hooks';
import type {
  GetCommonSymptomQuery,
  GetCommonSymptomsQuery,
} from './modules/types';

/** Symptoms returned by `getCommonSymptoms`. */
export type CommonSymptomItem =
  GetCommonSymptomsQuery['getCommonSymptoms'][number];

/** Symptom returned by `getCommonSymptom(id)`. */
export type CommonSymptomDetails = GetCommonSymptomQuery['getCommonSymptom'];

export type SymptomDoctorItem = NonNullable<
  CommonSymptomDetails['doctorCommonSymptoms']
>[number]['doctor'];

const defaultFetchOptions = {
  fetchPolicy: 'cache-and-network' as const,
  nextFetchPolicy: 'cache-first' as const,
};

type UseCommonSymptomsOptions = {
  /** When true, the query does not run. */
  skip?: boolean;
};

/**
 * Loads common symptoms via `getCommonSymptoms`.
 */
export function useCommonSymptoms(options?: UseCommonSymptomsOptions) {
  const result = Hooks.useGetCommonSymptomsQuery({
    skip: options?.skip,
    ...defaultFetchOptions,
  });

  const symptoms = (result.data?.getCommonSymptoms ?? []).filter(
    (symptom) => symptom.isActive,
  );

  return {
    symptoms,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

type UseCommonSymptomOptions = {
  /** When true, the query does not run. */
  skip?: boolean;
};

/**
 * Loads a common symptom by id via `getCommonSymptom(id)`.
 */
export function useCommonSymptom(
  symptomId: string | null | undefined,
  options?: UseCommonSymptomOptions,
) {
  const shouldSkip = options?.skip ?? !symptomId;

  const result = Hooks.useGetCommonSymptomQuery({
    skip: shouldSkip,
    variables: { id: symptomId ?? '' },
    ...defaultFetchOptions,
  });

  const symptom = result.data?.getCommonSymptom ?? null;
  const doctors =
    symptom?.doctorCommonSymptoms?.map((entry) => entry.doctor) ?? [];

  return {
    symptom,
    doctors,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}
