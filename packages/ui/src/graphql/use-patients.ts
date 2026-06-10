import * as Hooks from './modules/hooks';
import type { GetPatientsQuery } from './modules/types';

export type DoctorPatient = NonNullable<
  GetPatientsQuery['patients']['items']
>[number];

const defaultFetchOptions = {
  fetchPolicy: 'cache-and-network' as const,
  nextFetchPolicy: 'cache-first' as const,
};

type UsePatientsOptions = {
  skip?: boolean;
};

/**
 * Loads patients for the signed-in doctor via `patients`.
 */
export function usePatients(options?: UsePatientsOptions) {
  const result = Hooks.useGetPatientsQuery({
    skip: options?.skip,
    variables: {
      paginationArgs: {
        limit: 100,
        page: 1,
      },
    },
    ...defaultFetchOptions,
  });

  return {
    patients: result.data?.patients.items ?? [],
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}
