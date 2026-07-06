import type { CreateWellnessProgramInput } from './modules/types';
import * as Hooks from './modules/hooks';

/**
 * Creates a wellness program via `createWellnessProgram(input)`.
 */
export function useCreateWellnessProgram() {
  const [mutate, result] = Hooks.useCreateWellnessProgramMutation();

  const createWellnessProgram = async (input: CreateWellnessProgramInput) => {
    return mutate({
      variables: { input },
      refetchQueries: ['GetWellnessPrograms'],
    });
  };

  return {
    createWellnessProgram,
    loading: result.loading,
    error: result.error,
    data: result.data?.createWellnessProgram ?? null,
  };
}
