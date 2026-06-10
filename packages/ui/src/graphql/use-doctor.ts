import * as Hooks from './modules/hooks';
import type {
  DoctorFilterInput,
  GetDoctorDetailsQuery,
  GetDepartmentsQuery,
  GetDoctorsQuery,
  GetDoctorQuery,
} from './modules/types';

/** Current authenticated doctor (`getDoctor`). */
export type DoctorProfile = GetDoctorQuery['getDoctor'];

/** Doctor fetched by id (`getDoctorDetails`). */
export type DoctorDetailsProfile = GetDoctorDetailsQuery['getDoctorDetails'];

/** Doctors list fetched via `getDoctors`. */
export type DoctorsPage = GetDoctorsQuery['getDoctors'];

/** Departments list fetched via `getDepartments`. */
export type DepartmentsList = GetDepartmentsQuery['getDepartments'];

const defaultFetchOptions = {
  fetchPolicy: 'cache-and-network' as const,
  nextFetchPolicy: 'cache-first' as const,
};

type UseDoctorOptions = {
  /** When true, the query does not run (e.g. user is logged out). */
  skip?: boolean;
};

/**
 * Loads the signed-in doctor profile via `getDoctor`.
 * Apollo caches by operation name, so multiple screens can call this
 * without triggering duplicate network requests.
 */
export function useDoctor(options?: UseDoctorOptions) {
  const result = Hooks.useGetDoctorQuery({
    skip: options?.skip,
    ...defaultFetchOptions,
  });

  return {
    doctor: result.data?.getDoctor ?? null,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

type UseDoctorsOptions = {
  filter?: DoctorFilterInput;
  limit?: number;
  page?: number;
  skip?: boolean;
};

/**
 * Loads paginated doctors via `getDoctors(filter, paginationArgs)`.
 * Useful for browse/search screens that need list-level filtering.
 */
export function useDoctors(options?: UseDoctorsOptions) {
  const result = Hooks.useGetDoctorsQuery({
    skip: options?.skip,
    variables: {
      filter: options?.filter,
      paginationArgs: {
        limit: options?.limit ?? 10,
        page: options?.page ?? 1,
      },
    },
    ...defaultFetchOptions,
  });

  return {
    doctors: result.data?.getDoctors.items ?? [],
    pageInfo: result.data?.getDoctors.pageInfo ?? null,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

type UseDepartmentsOptions = {
  skip?: boolean;
};

/**
 * Loads available departments via `getDepartments`.
 */
export function useDepartments(options?: UseDepartmentsOptions) {
  const result = Hooks.useGetDepartmentsQuery({
    skip: options?.skip,
    ...defaultFetchOptions,
  });

  return {
    departments: result.data?.getDepartments ?? [],
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

type UseDoctorDetailsOptions = {
  skip?: boolean;
};

/**
 * Loads a doctor profile by id via `getDoctorDetails(doctorId)`.
 * Pass `null`/`undefined` to skip the query until an id is available.
 */
export function useDoctorDetails(
  doctorId: string | null | undefined,
  options?: UseDoctorDetailsOptions
) {
  const shouldSkip = options?.skip ?? !doctorId;

  const result = Hooks.useGetDoctorDetailsQuery({
    skip: shouldSkip,
    variables: { doctorId: doctorId ?? '' },
    ...defaultFetchOptions,
  });

  return {
    doctor: result.data?.getDoctorDetails ?? null,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}
