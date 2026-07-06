import { useEffect } from 'react';
import * as Hooks from './modules/hooks';
import type { GetWellnessProgramsQuery } from './modules/types';

/** Wellness programs list fetched via `getWellnessPrograms`. */
export type WellnessProgramsPage = GetWellnessProgramsQuery['getWellnessPrograms'];

/** Single wellness program from `getWellnessPrograms.items`. */
export type WellnessProgramListItem = NonNullable<
  WellnessProgramsPage['items']
>[number];

const defaultFetchOptions = {
  fetchPolicy: 'cache-and-network' as const,
  nextFetchPolicy: 'cache-first' as const,
};

type UseWellnessProgramsOptions = {
  limit?: number;
  page?: number;
  skip?: boolean;
};

/**
 * Loads paginated wellness programs via `getWellnessPrograms(paginationArgs)`.
 */
export function useWellnessPrograms(options?: UseWellnessProgramsOptions) {
  const result = Hooks.useGetWellnessProgramsQuery({
    skip: options?.skip,
    variables: {
      paginationArgs: {
        limit: options?.limit ?? 10,
        page: options?.page ?? 1,
      },
    },
    ...defaultFetchOptions,
  });

  useEffect(() => {
    if (result.data) {
      console.log(
        'getWellnessPrograms response',
        JSON.stringify(result.data, null, 2),
      );
    }
  }, [result.data]);

  useEffect(() => {
    if (result.error) {
      console.log(
        'getWellnessPrograms error',
        JSON.stringify({ message: result.error.message }, null, 2),
      );
    }
  }, [result.error]);

  return {
    wellnessPrograms: result.data?.getWellnessPrograms.items ?? [],
    pageInfo: result.data?.getWellnessPrograms.pageInfo ?? null,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}
