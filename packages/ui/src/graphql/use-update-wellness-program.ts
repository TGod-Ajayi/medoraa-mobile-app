import type { UpdateWellnessProgramInput } from './modules/types';
import * as Hooks from './modules/hooks';

/**
 * Updates a wellness program via `updateWellnessProgram(input)`.
 */
export function useUpdateWellnessProgram() {
  const [mutate, result] = Hooks.useUpdateWellnessProgramMutation();

  const updateWellnessProgram = async (input: UpdateWellnessProgramInput) => {
    return mutate({
      variables: { input },
      refetchQueries: ['GetWellnessPrograms', 'GetWellnessProgram'],
    });
  };

  return {
    updateWellnessProgram,
    loading: result.loading,
    error: result.error,
    data: result.data?.updateWellnessProgram ?? null,
  };
}
