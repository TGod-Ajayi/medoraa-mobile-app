import * as Hooks from './modules/hooks';
import type { GetPatientsQuery, PatientFilterInput } from './modules/types';

export type DoctorPatient = NonNullable<
  GetPatientsQuery['patients']['items']
>[number];

const defaultFetchOptions = {
  fetchPolicy: 'cache-and-network' as const,
  nextFetchPolicy: 'cache-first' as const,
};

type UsePatientsOptions = {
  skip?: boolean;
  limit?: number;
  page?: number;
  filter?: PatientFilterInput;
};

/**
 * Loads paginated patients via `patients(filter, paginationArgs)`.
 */
export function usePatients(options?: UsePatientsOptions) {
  const result = Hooks.useGetPatientsQuery({
    skip: options?.skip,
    variables: {
      filter: options?.filter,
      paginationArgs: {
        limit: options?.limit ?? 50,
        page: options?.page ?? 1,
      },
    },
    ...defaultFetchOptions,
  });

  return {
    patients: result.data?.patients.items ?? [],
    pageInfo: result.data?.patients.pageInfo ?? null,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}
