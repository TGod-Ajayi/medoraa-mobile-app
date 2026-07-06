import { useEffect, useMemo } from 'react';
import * as Hooks from './modules/hooks';
import type { GetLifestyleCategoriesQuery } from './modules/types';

export type LifestyleCategoryItem = NonNullable<
  GetLifestyleCategoriesQuery['getLifestyleCategories']
>[number];

/**
 * Loads wellness/lifestyle categories via `getLifestyleCategories(activeOnly)`.
 */
export function useLifestyleCategories(activeOnly = true) {
  const result = Hooks.useGetLifestyleCategoriesQuery({
    variables: { activeOnly },
  });

  const categories = useMemo(
    () =>
      [...(result.data?.getLifestyleCategories ?? [])].sort(
        (left, right) => left.sortOrder - right.sortOrder,
      ),
    [result.data?.getLifestyleCategories],
  );

  useEffect(() => {
    if (result.data) {
      console.log(
        'getLifestyleCategories response',
        JSON.stringify(result.data, null, 2),
      );
    }
  }, [result.data]);

  useEffect(() => {
    if (result.error) {
      console.log(
        'getLifestyleCategories error',
        JSON.stringify({ message: result.error.message }, null, 2),
      );
    }
  }, [result.error]);

  return {
    categories,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}
