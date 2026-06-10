import * as Hooks from './modules/hooks';
import {
  AppointmentStatus,
  DoctorTimeSlotStatus,
  type AppointmentFilterInput,
  type BookAppointmentInput,
  type GetAppointmentsQuery,
  type GetDoctorAvailableTimeSlotsQuery,
  type MyAppointmentsQuery,
  type RescheduleAppointmentInput,
} from './modules/types';

export type DoctorTimeSlotOption =
  GetDoctorAvailableTimeSlotsQuery['getDoctorDetails']['doctorTimeSlots'] extends
    | (infer T)[]
    | null
    | undefined
    ? T
    : never;

/** Appointments returned by `myAppointments`. */
export type UserAppointment = MyAppointmentsQuery['myAppointments'][number];

/** Paginated appointments from `appointments(filter, paginationArgs)`. */
export type DoctorAppointmentsPage = GetAppointmentsQuery['appointments'];
export type DoctorAppointment =
  NonNullable<DoctorAppointmentsPage['items']>[number];

const defaultFetchOptions = {
  fetchPolicy: 'cache-and-network' as const,
  nextFetchPolicy: 'cache-first' as const,
};

type UseMyAppointmentsOptions = {
  /** Filter by appointment status (API `statuses` argument). */
  statuses?: AppointmentStatus[];
  /** When true, the query does not run. */
  skip?: boolean;
};

type UseAppointmentsOptions = {
  filter?: AppointmentFilterInput;
  limit?: number;
  page?: number;
  skip?: boolean;
};

/**
 * Loads paginated appointments via `appointments(filter, paginationArgs)`.
 * Pass `filter.doctorId` to scope results to the signed-in doctor.
 */
export function useAppointments(options?: UseAppointmentsOptions) {
  const result = Hooks.useGetAppointmentsQuery({
    skip: options?.skip,
    variables: {
      filter: options?.filter,
      paginationArgs: {
        limit: options?.limit ?? 20,
        page: options?.page ?? 1,
      },
    },
    ...defaultFetchOptions,
  });

  return {
    appointments: result.data?.appointments.items ?? [],
    pageInfo: result.data?.appointments.pageInfo ?? null,
    metaData: result.data?.appointments.metaData ?? null,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
    data: result.data?.appointments ?? null,
  };
}

/**
 * Loads the signed-in user's appointments via `myAppointments(statuses)`.
 */
export function useMyAppointments(options?: UseMyAppointmentsOptions) {
  const result = Hooks.useMyAppointmentsQuery({
    skip: options?.skip,
    variables: {
      statuses: options?.statuses,
    },
    ...defaultFetchOptions,
  });

  return {
    appointments: result.data?.myAppointments ?? [],
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

/** Maps UI appointment tabs to API status filters. */
export const APPOINTMENT_TAB_STATUSES: Record<
  'upcoming' | 'completed' | 'cancelled',
  AppointmentStatus[]
> = {
  upcoming: [
    AppointmentStatus.Pending,
    AppointmentStatus.Confirmed,
    AppointmentStatus.Scheduled,
    AppointmentStatus.InProgress,
    AppointmentStatus.Rescheduled,
  ],
  completed: [AppointmentStatus.Completed],
  cancelled: [AppointmentStatus.Cancelled, AppointmentStatus.Missed],
};

type UseDoctorAvailableTimeSlotsOptions = {
  doctorId: string | null | undefined;
  skip?: boolean;
};

/**
 * Loads a doctor's time slots via `getDoctorDetails(doctorId).doctorTimeSlots`.
 */
export function useDoctorAvailableTimeSlots(
  options: UseDoctorAvailableTimeSlotsOptions
) {
  const doctorId = options.doctorId ?? '';
  const shouldSkip = options.skip ?? !doctorId;

  const result = Hooks.useGetDoctorAvailableTimeSlotsQuery({
    skip: shouldSkip,
    variables: { doctorId },
    ...defaultFetchOptions,
  });

  const allSlots = result.data?.getDoctorDetails.doctorTimeSlots ?? [];
  const now = Date.now();

  const availableSlots = allSlots.filter((slot) => {
    if (slot.status !== DoctorTimeSlotStatus.Available) return false;
    const start = new Date(slot.startDateTime);
    return !Number.isNaN(start.getTime()) && start.getTime() > now;
  });

  const statusCounts = allSlots.reduce<Record<string, number>>(
    (counts, slot) => {
      counts[slot.status] = (counts[slot.status] ?? 0) + 1;
      return counts;
    },
    {}
  );

  const pastAvailableCount = allSlots.filter((slot) => {
    if (slot.status !== DoctorTimeSlotStatus.Available) return false;
    const start = new Date(slot.startDateTime);
    return !Number.isNaN(start.getTime()) && start.getTime() <= now;
  }).length;

  return {
    /** Slots the user can pick (status AVAILABLE + in the future). */
    slots: availableSlots,
    /** Raw slots returned by the API before client filtering. */
    allSlots,
    statusCounts,
    pastAvailableCount,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

type UseRescheduleAppointmentOptions = {
  onCompleted?: () => void;
};

/**
 * Books an appointment via `bookAppointment(input)`.
 */
export function useBookAppointment() {
  const [mutate, result] = Hooks.useBookAppointmentMutation();

  const bookAppointment = async (input: BookAppointmentInput) => {
    const response = await mutate({
      variables: { input },
    });
    return response.data?.bookAppointment ?? null;
  };

  return {
    bookAppointment,
    loading: result.loading,
    error: result.error,
  };
}

/**
 * Reschedules an appointment via `rescheduleAppointment(input)`.
 */
export function useRescheduleAppointment(
  options?: UseRescheduleAppointmentOptions
) {
  const [mutate, result] = Hooks.useRescheduleAppointmentMutation();

  const rescheduleAppointment = async (input: RescheduleAppointmentInput) => {
    const response = await mutate({
      variables: { input },
    });
    options?.onCompleted?.();
    return response.data?.rescheduleAppointment ?? null;
  };

  return {
    rescheduleAppointment,
    loading: result.loading,
    error: result.error,
  };
}
