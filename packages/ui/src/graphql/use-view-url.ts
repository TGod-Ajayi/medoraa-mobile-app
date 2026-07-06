import { useEffect } from 'react';
import * as Hooks from './modules/hooks';

/**
 * Resolves a storage file key to a presigned view URL via `getViewUrl`.
 */
export function useViewUrl(key?: string | null) {
  const [fetchViewUrl, result] = Hooks.useGetViewUrlLazyQuery({
    fetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (!key?.trim()) return;
    void fetchViewUrl({ variables: { filename: key } });
  }, [fetchViewUrl, key]);

  return {
    url: result.data?.getViewUrl ?? null,
    loading: Boolean(key?.trim()) && result.loading,
    error: result.error,
  };
}
