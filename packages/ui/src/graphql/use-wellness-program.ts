import * as Hooks from './modules/hooks';
import type { GetWellnessProgramQuery } from './modules/types';

/** Single wellness program fetched via `getWellnessProgram(id)`. */
export type WellnessProgramDetail = NonNullable<GetWellnessProgramQuery['getWellnessProgram']>;

/**
 * Lazy-loads a wellness program by id via `getWellnessProgram(id)`.
 */
export function useWellnessProgramLazy() {
  const [fetchWellnessProgram, result] = Hooks.useGetWellnessProgramLazyQuery({
    fetchPolicy: 'cache-and-network',
  });

  return {
    fetchWellnessProgram,
    wellnessProgram: result.data?.getWellnessProgram ?? null,
    loading: result.loading,
    error: result.error,
  };
}
