import * as Hooks from './modules/hooks';
import type { GetWalletByDoctorQuery } from './modules/types';

/** Wallet returned by `getWalletByDoctor(doctorId)`. */
export type DoctorWallet = NonNullable<GetWalletByDoctorQuery['getWalletByDoctor']>;

export type WalletTransactionItem = NonNullable<
  DoctorWallet['transactions']
>[number];

const defaultFetchOptions = {
  fetchPolicy: 'cache-and-network' as const,
  nextFetchPolicy: 'cache-first' as const,
};

type UseDoctorWalletOptions = {
  doctorId: string | null | undefined;
  skip?: boolean;
};

/**
 * Loads a doctor wallet via `getWalletByDoctor(doctorId)`.
 */
export function useDoctorWallet(options: UseDoctorWalletOptions) {
  const doctorId = options.doctorId ?? '';
  const shouldSkip = options.skip ?? !doctorId;

  const result = Hooks.useGetWalletByDoctorQuery({
    skip: shouldSkip,
    variables: { doctorId },
    ...defaultFetchOptions,
  });

  return {
    wallet: result.data?.getWalletByDoctor ?? null,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}
