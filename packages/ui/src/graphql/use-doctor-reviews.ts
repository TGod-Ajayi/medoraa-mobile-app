import * as Hooks from './modules/hooks';
import type { GetDoctorReviewsQuery } from './modules/types';

/** Reviews returned by `getDoctorReviews(doctorId)`. */
export type DoctorReviewItem = GetDoctorReviewsQuery['getDoctorReviews'][number];

const defaultFetchOptions = {
  fetchPolicy: 'cache-and-network' as const,
  nextFetchPolicy: 'cache-first' as const,
};

type UseDoctorReviewsOptions = {
  doctorId: string | null | undefined;
  skip?: boolean;
};

/**
 * Loads doctor reviews via `getDoctorReviews(doctorId)`.
 */
export function useDoctorReviews(options: UseDoctorReviewsOptions) {
  const doctorId = options.doctorId ?? '';
  const shouldSkip = options.skip ?? !doctorId;

  const result = Hooks.useGetDoctorReviewsQuery({
    skip: shouldSkip,
    variables: { doctorId },
    ...defaultFetchOptions,
  });

  return {
    reviews: result.data?.getDoctorReviews ?? [],
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
    data: result.data?.getDoctorReviews ?? null,
  };
}
