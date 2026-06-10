import * as Hooks from './modules/hooks';
import {
  AppointmentStatus,
  ConsultationHistoryFilter,
  type ConsultationHistoryQuery,
} from './modules/types';

export type ConsultationHistoryItem =
  ConsultationHistoryQuery['consultationHistory'][number];

export type ConsultationHistoryTab = 'all' | 'upcoming' | 'completed' | 'cancelled';

/** Maps history tab UI keys to `consultationHistory(filter)`. */
export const CONSULTATION_HISTORY_TAB_FILTER: Record<
  ConsultationHistoryTab,
  ConsultationHistoryFilter
> = {
  all: ConsultationHistoryFilter.All,
  upcoming: ConsultationHistoryFilter.Upcoming,
  completed: ConsultationHistoryFilter.Completed,
  cancelled: ConsultationHistoryFilter.Cancelled,
};

/** Maps API appointment status to list card badge (for the All tab). */
export function resolveConsultationListStatus(
  status: AppointmentStatus
): 'upcoming' | 'completed' | 'cancelled' {
  if (status === AppointmentStatus.Completed) return 'completed';
  if (
    status === AppointmentStatus.Cancelled ||
    status === AppointmentStatus.Missed
  ) {
    return 'cancelled';
  }
  return 'upcoming';
}

const defaultFetchOptions = {
  fetchPolicy: 'cache-and-network' as const,
  nextFetchPolicy: 'cache-first' as const,
};

type UseConsultationHistoryOptions = {
  filter?: ConsultationHistoryFilter;
  skip?: boolean;
};

/**
 * Loads consultation history via `consultationHistory(filter)` for patient or doctor.
 */
export function useConsultationHistory(options?: UseConsultationHistoryOptions) {
  const result = Hooks.useConsultationHistoryQuery({
    skip: options?.skip,
    variables: {
      filter: options?.filter,
    },
    ...defaultFetchOptions,
  });

  return {
    consultations: result.data?.consultationHistory ?? [],
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

export { ConsultationHistoryFilter };
