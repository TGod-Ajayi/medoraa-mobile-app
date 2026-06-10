import * as Hooks from './modules/hooks';
import type { GetActiveFaqItemsQuery } from './modules/types';

/** FAQ items returned by `getActiveFaqItems`. */
export type FaqItem = GetActiveFaqItemsQuery['getActiveFaqItems'][number];

const defaultFetchOptions = {
  fetchPolicy: 'cache-and-network' as const,
  nextFetchPolicy: 'cache-first' as const,
};

type UseActiveFaqItemsOptions = {
  /** When true, the query does not run. */
  skip?: boolean;
};

/**
 * Loads active FAQ items via `getActiveFaqItems`.
 */
export function useActiveFaqItems(options?: UseActiveFaqItemsOptions) {
  const result = Hooks.useGetActiveFaqItemsQuery({
    skip: options?.skip,
    ...defaultFetchOptions,
  });

  const faqItems = [...(result.data?.getActiveFaqItems ?? [])].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );

  return {
    faqItems,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}
