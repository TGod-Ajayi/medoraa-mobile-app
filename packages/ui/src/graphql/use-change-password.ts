import * as Hooks from './modules/hooks';

/**
 * Changes the signed-in user's password via
 * `changePassword(newPassword, oldPassword)`.
 */
export function useChangePassword() {
  const [mutate, result] = Hooks.useChangePasswordMutation();

  const changePassword = async (oldPassword: string, newPassword: string) => {
    return mutate({
      variables: { oldPassword, newPassword },
    });
  };

  return {
    changePassword,
    loading: result.loading,
    error: result.error,
    data: result.data?.changePassword ?? null,
  };
}
