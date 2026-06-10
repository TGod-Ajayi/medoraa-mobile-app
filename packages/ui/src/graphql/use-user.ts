import { useEffect } from 'react';

import * as Hooks from './modules/hooks';
import type { GetUserQuery, UpdateUserInput, UpdateUserMutation } from './modules/types';
import { UserRoles } from './modules/types';

/** Current authenticated user (`getUser`). */
export type UserProfile = GetUserQuery['getUser'];

const defaultFetchOptions = {
  fetchPolicy: 'cache-and-network' as const,
  nextFetchPolicy: 'cache-first' as const,
};

type UseUserOptions = {
  /** When true, the query does not run (e.g. user is logged out). */
  skip?: boolean;
  /**
   * Expected user role for this app context (e.g. `UserRoles.Doctor`).
   * Passed at call sites so doctor/patient apps request the correct profile
   * once the API supports a `role` argument on `getUser`.
   */
  role?: UserRoles;
};

/**
 * Loads the signed-in user profile via `getUser`.
 * Apollo caches by operation name, so multiple screens can call this
 * without triggering duplicate network requests.
 */
export function useUser(options?: UseUserOptions) {
  const result = Hooks.useGetUserQuery({
    skip: options?.skip,
    ...defaultFetchOptions,
  });

  const user = result.data?.getUser ?? null;

  useEffect(() => {
    console.log(
      'user response\n' +
        JSON.stringify(
          {
            role: options?.role ?? null,
            user,
            loading: result.loading,
            error: result.error?.message ?? null,
          },
          null,
          2
        )
    );
  }, [options?.role, result.error, result.loading, user]);

  return {
    user,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

/** Loads the signed-in doctor user via `getUser` (role: DOCTOR). */
export function useDoctorUser(options?: Omit<UseUserOptions, 'role'>) {
  return useUser({ ...options, role: UserRoles.Doctor });
}

/** User returned by `updateUser`. */
export type UpdatedUserProfile = UpdateUserMutation['updateUser'];

/**
 * Updates the signed-in user via `updateUser(updateUserInput)`.
 */
export function useUpdateUser() {
  const [mutate, result] = Hooks.useUpdateUserMutation();

  const updateUser = async (updateUserInput: UpdateUserInput) => {
    return mutate({
      variables: { updateUserInput },
      refetchQueries: ['GetUser', 'GetDoctor'],
    });
  };

  return {
    updateUser,
    loading: result.loading,
    error: result.error,
    data: result.data?.updateUser ?? null,
  };
}
