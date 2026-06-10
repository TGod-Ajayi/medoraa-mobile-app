/* Auto-generated — DO NOT EDIT BY HAND */
/** biome-ignore-all lint: leave this file */
'use client';
import * as Apollo from '@apollo/client/react';
import * as Graphql from './types';

const defaultOptions = {} as const;

export function useBookAppointmentMutation(baseOptions?: Apollo.useMutation.Options<Graphql.BookAppointmentMutation, Graphql.BookAppointmentMutationVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useMutation<Graphql.BookAppointmentMutation, Graphql.BookAppointmentMutationVariables>(Graphql.BookAppointmentDocument, options);};
export type BookAppointmentMutationHookResult = ReturnType<typeof useBookAppointmentMutation>;
export type BookAppointmentMutationResult = Apollo.useMutation.Result<Graphql.BookAppointmentMutation>;

export function useRescheduleAppointmentMutation(baseOptions?: Apollo.useMutation.Options<Graphql.RescheduleAppointmentMutation, Graphql.RescheduleAppointmentMutationVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useMutation<Graphql.RescheduleAppointmentMutation, Graphql.RescheduleAppointmentMutationVariables>(Graphql.RescheduleAppointmentDocument, options);};
export type RescheduleAppointmentMutationHookResult = ReturnType<typeof useRescheduleAppointmentMutation>;
export type RescheduleAppointmentMutationResult = Apollo.useMutation.Result<Graphql.RescheduleAppointmentMutation>;

export function useGetAppointmentsQuery(baseOptions: Apollo.useQuery.Options<Graphql.GetAppointmentsQuery, Graphql.GetAppointmentsQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useQuery<Graphql.GetAppointmentsQuery, Graphql.GetAppointmentsQueryVariables>(Graphql.GetAppointmentsDocument, options);};
export type GetAppointmentsQueryHookResult = ReturnType<typeof useGetAppointmentsQuery>;
export type GetAppointmentsQueryResult = Apollo.useQuery.Result<Graphql.GetAppointmentsQuery, Graphql.GetAppointmentsQueryVariables>;

export function useGetAppointmentsLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<Graphql.GetAppointmentsQuery, Graphql.GetAppointmentsQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useLazyQuery<Graphql.GetAppointmentsQuery, Graphql.GetAppointmentsQueryVariables>(Graphql.GetAppointmentsDocument, options);};
export type GetAppointmentsLazyQueryHookResult = ReturnType<typeof useGetAppointmentsLazyQuery>;

export function useGetAppointmentsSuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<Graphql.GetAppointmentsQueryVariables>) {const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };return Apollo.useSuspenseQuery<Graphql.GetAppointmentsQuery, Graphql.GetAppointmentsQueryVariables>(Graphql.GetAppointmentsDocument, options);};
export type GetAppointmentsSuspenseQueryHookResult = ReturnType<typeof useGetAppointmentsSuspenseQuery>;

export function useMyAppointmentsQuery(baseOptions?: Apollo.useQuery.Options<Graphql.MyAppointmentsQuery, Graphql.MyAppointmentsQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useQuery<Graphql.MyAppointmentsQuery, Graphql.MyAppointmentsQueryVariables>(Graphql.MyAppointmentsDocument, options);};
export type MyAppointmentsQueryHookResult = ReturnType<typeof useMyAppointmentsQuery>;
export type MyAppointmentsQueryResult = Apollo.useQuery.Result<Graphql.MyAppointmentsQuery, Graphql.MyAppointmentsQueryVariables>;

export function useMyAppointmentsLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<Graphql.MyAppointmentsQuery, Graphql.MyAppointmentsQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useLazyQuery<Graphql.MyAppointmentsQuery, Graphql.MyAppointmentsQueryVariables>(Graphql.MyAppointmentsDocument, options);};
export type MyAppointmentsLazyQueryHookResult = ReturnType<typeof useMyAppointmentsLazyQuery>;

export function useMyAppointmentsSuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<Graphql.MyAppointmentsQueryVariables>) {const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };return Apollo.useSuspenseQuery<Graphql.MyAppointmentsQuery, Graphql.MyAppointmentsQueryVariables>(Graphql.MyAppointmentsDocument, options);};
export type MyAppointmentsSuspenseQueryHookResult = ReturnType<typeof useMyAppointmentsSuspenseQuery>;

export function useGetDoctorAvailableTimeSlotsQuery(baseOptions: Apollo.useQuery.Options<Graphql.GetDoctorAvailableTimeSlotsQuery, Graphql.GetDoctorAvailableTimeSlotsQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useQuery<Graphql.GetDoctorAvailableTimeSlotsQuery, Graphql.GetDoctorAvailableTimeSlotsQueryVariables>(Graphql.GetDoctorAvailableTimeSlotsDocument, options);};
export type GetDoctorAvailableTimeSlotsQueryHookResult = ReturnType<typeof useGetDoctorAvailableTimeSlotsQuery>;
export type GetDoctorAvailableTimeSlotsQueryResult = Apollo.useQuery.Result<Graphql.GetDoctorAvailableTimeSlotsQuery, Graphql.GetDoctorAvailableTimeSlotsQueryVariables>;

export function useGetDoctorAvailableTimeSlotsLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<Graphql.GetDoctorAvailableTimeSlotsQuery, Graphql.GetDoctorAvailableTimeSlotsQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useLazyQuery<Graphql.GetDoctorAvailableTimeSlotsQuery, Graphql.GetDoctorAvailableTimeSlotsQueryVariables>(Graphql.GetDoctorAvailableTimeSlotsDocument, options);};
export type GetDoctorAvailableTimeSlotsLazyQueryHookResult = ReturnType<typeof useGetDoctorAvailableTimeSlotsLazyQuery>;

export function useGetDoctorAvailableTimeSlotsSuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<Graphql.GetDoctorAvailableTimeSlotsQueryVariables>) {const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };return Apollo.useSuspenseQuery<Graphql.GetDoctorAvailableTimeSlotsQuery, Graphql.GetDoctorAvailableTimeSlotsQueryVariables>(Graphql.GetDoctorAvailableTimeSlotsDocument, options);};
export type GetDoctorAvailableTimeSlotsSuspenseQueryHookResult = ReturnType<typeof useGetDoctorAvailableTimeSlotsSuspenseQuery>;

export function useLoginMutation(baseOptions?: Apollo.useMutation.Options<Graphql.LoginMutation, Graphql.LoginMutationVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useMutation<Graphql.LoginMutation, Graphql.LoginMutationVariables>(Graphql.LoginDocument, options);};
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.useMutation.Result<Graphql.LoginMutation>;

export function useSignUpMutation(baseOptions?: Apollo.useMutation.Options<Graphql.SignUpMutation, Graphql.SignUpMutationVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useMutation<Graphql.SignUpMutation, Graphql.SignUpMutationVariables>(Graphql.SignUpDocument, options);};
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.useMutation.Result<Graphql.SignUpMutation>;

export function useForgotPasswordMutation(baseOptions?: Apollo.useMutation.Options<Graphql.ForgotPasswordMutation, Graphql.ForgotPasswordMutationVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useMutation<Graphql.ForgotPasswordMutation, Graphql.ForgotPasswordMutationVariables>(Graphql.ForgotPasswordDocument, options);};
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.useMutation.Result<Graphql.ForgotPasswordMutation>;

export function useResetPasswordMutation(baseOptions?: Apollo.useMutation.Options<Graphql.ResetPasswordMutation, Graphql.ResetPasswordMutationVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useMutation<Graphql.ResetPasswordMutation, Graphql.ResetPasswordMutationVariables>(Graphql.ResetPasswordDocument, options);};
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.useMutation.Result<Graphql.ResetPasswordMutation>;

export function useChangePasswordMutation(baseOptions?: Apollo.useMutation.Options<Graphql.ChangePasswordMutation, Graphql.ChangePasswordMutationVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useMutation<Graphql.ChangePasswordMutation, Graphql.ChangePasswordMutationVariables>(Graphql.ChangePasswordDocument, options);};
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.useMutation.Result<Graphql.ChangePasswordMutation>;

export function useVerifyResetOtpMutation(baseOptions?: Apollo.useMutation.Options<Graphql.VerifyResetOtpMutation, Graphql.VerifyResetOtpMutationVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useMutation<Graphql.VerifyResetOtpMutation, Graphql.VerifyResetOtpMutationVariables>(Graphql.VerifyResetOtpDocument, options);};
export type VerifyResetOtpMutationHookResult = ReturnType<typeof useVerifyResetOtpMutation>;
export type VerifyResetOtpMutationResult = Apollo.useMutation.Result<Graphql.VerifyResetOtpMutation>;

export function useRefreshAccessTokenMutation(baseOptions?: Apollo.useMutation.Options<Graphql.RefreshAccessTokenMutation, Graphql.RefreshAccessTokenMutationVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useMutation<Graphql.RefreshAccessTokenMutation, Graphql.RefreshAccessTokenMutationVariables>(Graphql.RefreshAccessTokenDocument, options);};
export type RefreshAccessTokenMutationHookResult = ReturnType<typeof useRefreshAccessTokenMutation>;
export type RefreshAccessTokenMutationResult = Apollo.useMutation.Result<Graphql.RefreshAccessTokenMutation>;

export function useUpdateDoctorMutation(baseOptions?: Apollo.useMutation.Options<Graphql.UpdateDoctorMutation, Graphql.UpdateDoctorMutationVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useMutation<Graphql.UpdateDoctorMutation, Graphql.UpdateDoctorMutationVariables>(Graphql.UpdateDoctorDocument, options);};
export type UpdateDoctorMutationHookResult = ReturnType<typeof useUpdateDoctorMutation>;
export type UpdateDoctorMutationResult = Apollo.useMutation.Result<Graphql.UpdateDoctorMutation>;

export function useCreateDoctorAvailabilityMutation(baseOptions?: Apollo.useMutation.Options<Graphql.CreateDoctorAvailabilityMutation, Graphql.CreateDoctorAvailabilityMutationVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useMutation<Graphql.CreateDoctorAvailabilityMutation, Graphql.CreateDoctorAvailabilityMutationVariables>(Graphql.CreateDoctorAvailabilityDocument, options);};
export type CreateDoctorAvailabilityMutationHookResult = ReturnType<typeof useCreateDoctorAvailabilityMutation>;
export type CreateDoctorAvailabilityMutationResult = Apollo.useMutation.Result<Graphql.CreateDoctorAvailabilityMutation>;

export function useRemoveDoctorAvailabilityMutation(baseOptions?: Apollo.useMutation.Options<Graphql.RemoveDoctorAvailabilityMutation, Graphql.RemoveDoctorAvailabilityMutationVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useMutation<Graphql.RemoveDoctorAvailabilityMutation, Graphql.RemoveDoctorAvailabilityMutationVariables>(Graphql.RemoveDoctorAvailabilityDocument, options);};
export type RemoveDoctorAvailabilityMutationHookResult = ReturnType<typeof useRemoveDoctorAvailabilityMutation>;
export type RemoveDoctorAvailabilityMutationResult = Apollo.useMutation.Result<Graphql.RemoveDoctorAvailabilityMutation>;

export function useGetDoctorDetailsQuery(baseOptions: Apollo.useQuery.Options<Graphql.GetDoctorDetailsQuery, Graphql.GetDoctorDetailsQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useQuery<Graphql.GetDoctorDetailsQuery, Graphql.GetDoctorDetailsQueryVariables>(Graphql.GetDoctorDetailsDocument, options);};
export type GetDoctorDetailsQueryHookResult = ReturnType<typeof useGetDoctorDetailsQuery>;
export type GetDoctorDetailsQueryResult = Apollo.useQuery.Result<Graphql.GetDoctorDetailsQuery, Graphql.GetDoctorDetailsQueryVariables>;

export function useGetDoctorDetailsLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<Graphql.GetDoctorDetailsQuery, Graphql.GetDoctorDetailsQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useLazyQuery<Graphql.GetDoctorDetailsQuery, Graphql.GetDoctorDetailsQueryVariables>(Graphql.GetDoctorDetailsDocument, options);};
export type GetDoctorDetailsLazyQueryHookResult = ReturnType<typeof useGetDoctorDetailsLazyQuery>;

export function useGetDoctorDetailsSuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<Graphql.GetDoctorDetailsQueryVariables>) {const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };return Apollo.useSuspenseQuery<Graphql.GetDoctorDetailsQuery, Graphql.GetDoctorDetailsQueryVariables>(Graphql.GetDoctorDetailsDocument, options);};
export type GetDoctorDetailsSuspenseQueryHookResult = ReturnType<typeof useGetDoctorDetailsSuspenseQuery>;

export function useGetDoctorQuery(baseOptions?: Apollo.useQuery.Options<Graphql.GetDoctorQuery, Graphql.GetDoctorQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useQuery<Graphql.GetDoctorQuery, Graphql.GetDoctorQueryVariables>(Graphql.GetDoctorDocument, options);};
export type GetDoctorQueryHookResult = ReturnType<typeof useGetDoctorQuery>;
export type GetDoctorQueryResult = Apollo.useQuery.Result<Graphql.GetDoctorQuery, Graphql.GetDoctorQueryVariables>;

export function useGetDoctorLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<Graphql.GetDoctorQuery, Graphql.GetDoctorQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useLazyQuery<Graphql.GetDoctorQuery, Graphql.GetDoctorQueryVariables>(Graphql.GetDoctorDocument, options);};
export type GetDoctorLazyQueryHookResult = ReturnType<typeof useGetDoctorLazyQuery>;

export function useGetDoctorSuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<Graphql.GetDoctorQueryVariables>) {const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };return Apollo.useSuspenseQuery<Graphql.GetDoctorQuery, Graphql.GetDoctorQueryVariables>(Graphql.GetDoctorDocument, options);};
export type GetDoctorSuspenseQueryHookResult = ReturnType<typeof useGetDoctorSuspenseQuery>;

export function useGetDoctorsQuery(baseOptions: Apollo.useQuery.Options<Graphql.GetDoctorsQuery, Graphql.GetDoctorsQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useQuery<Graphql.GetDoctorsQuery, Graphql.GetDoctorsQueryVariables>(Graphql.GetDoctorsDocument, options);};
export type GetDoctorsQueryHookResult = ReturnType<typeof useGetDoctorsQuery>;
export type GetDoctorsQueryResult = Apollo.useQuery.Result<Graphql.GetDoctorsQuery, Graphql.GetDoctorsQueryVariables>;

export function useGetDoctorsLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<Graphql.GetDoctorsQuery, Graphql.GetDoctorsQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useLazyQuery<Graphql.GetDoctorsQuery, Graphql.GetDoctorsQueryVariables>(Graphql.GetDoctorsDocument, options);};
export type GetDoctorsLazyQueryHookResult = ReturnType<typeof useGetDoctorsLazyQuery>;

export function useGetDoctorsSuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<Graphql.GetDoctorsQueryVariables>) {const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };return Apollo.useSuspenseQuery<Graphql.GetDoctorsQuery, Graphql.GetDoctorsQueryVariables>(Graphql.GetDoctorsDocument, options);};
export type GetDoctorsSuspenseQueryHookResult = ReturnType<typeof useGetDoctorsSuspenseQuery>;

export function useGetDepartmentsQuery(baseOptions?: Apollo.useQuery.Options<Graphql.GetDepartmentsQuery, Graphql.GetDepartmentsQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useQuery<Graphql.GetDepartmentsQuery, Graphql.GetDepartmentsQueryVariables>(Graphql.GetDepartmentsDocument, options);};
export type GetDepartmentsQueryHookResult = ReturnType<typeof useGetDepartmentsQuery>;
export type GetDepartmentsQueryResult = Apollo.useQuery.Result<Graphql.GetDepartmentsQuery, Graphql.GetDepartmentsQueryVariables>;

export function useGetDepartmentsLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<Graphql.GetDepartmentsQuery, Graphql.GetDepartmentsQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useLazyQuery<Graphql.GetDepartmentsQuery, Graphql.GetDepartmentsQueryVariables>(Graphql.GetDepartmentsDocument, options);};
export type GetDepartmentsLazyQueryHookResult = ReturnType<typeof useGetDepartmentsLazyQuery>;

export function useGetDepartmentsSuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<Graphql.GetDepartmentsQueryVariables>) {const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };return Apollo.useSuspenseQuery<Graphql.GetDepartmentsQuery, Graphql.GetDepartmentsQueryVariables>(Graphql.GetDepartmentsDocument, options);};
export type GetDepartmentsSuspenseQueryHookResult = ReturnType<typeof useGetDepartmentsSuspenseQuery>;

export function useGetSpecialtiesQuery(baseOptions?: Apollo.useQuery.Options<Graphql.GetSpecialtiesQuery, Graphql.GetSpecialtiesQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useQuery<Graphql.GetSpecialtiesQuery, Graphql.GetSpecialtiesQueryVariables>(Graphql.GetSpecialtiesDocument, options);};
export type GetSpecialtiesQueryHookResult = ReturnType<typeof useGetSpecialtiesQuery>;
export type GetSpecialtiesQueryResult = Apollo.useQuery.Result<Graphql.GetSpecialtiesQuery, Graphql.GetSpecialtiesQueryVariables>;

export function useGetSpecialtiesLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<Graphql.GetSpecialtiesQuery, Graphql.GetSpecialtiesQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useLazyQuery<Graphql.GetSpecialtiesQuery, Graphql.GetSpecialtiesQueryVariables>(Graphql.GetSpecialtiesDocument, options);};
export type GetSpecialtiesLazyQueryHookResult = ReturnType<typeof useGetSpecialtiesLazyQuery>;

export function useGetSpecialtiesSuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<Graphql.GetSpecialtiesQueryVariables>) {const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };return Apollo.useSuspenseQuery<Graphql.GetSpecialtiesQuery, Graphql.GetSpecialtiesQueryVariables>(Graphql.GetSpecialtiesDocument, options);};
export type GetSpecialtiesSuspenseQueryHookResult = ReturnType<typeof useGetSpecialtiesSuspenseQuery>;

export function useGetCommonSymptomsQuery(baseOptions?: Apollo.useQuery.Options<Graphql.GetCommonSymptomsQuery, Graphql.GetCommonSymptomsQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useQuery<Graphql.GetCommonSymptomsQuery, Graphql.GetCommonSymptomsQueryVariables>(Graphql.GetCommonSymptomsDocument, options);};
export type GetCommonSymptomsQueryHookResult = ReturnType<typeof useGetCommonSymptomsQuery>;
export type GetCommonSymptomsQueryResult = Apollo.useQuery.Result<Graphql.GetCommonSymptomsQuery, Graphql.GetCommonSymptomsQueryVariables>;

export function useGetCommonSymptomsLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<Graphql.GetCommonSymptomsQuery, Graphql.GetCommonSymptomsQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useLazyQuery<Graphql.GetCommonSymptomsQuery, Graphql.GetCommonSymptomsQueryVariables>(Graphql.GetCommonSymptomsDocument, options);};
export type GetCommonSymptomsLazyQueryHookResult = ReturnType<typeof useGetCommonSymptomsLazyQuery>;

export function useGetCommonSymptomsSuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<Graphql.GetCommonSymptomsQueryVariables>) {const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };return Apollo.useSuspenseQuery<Graphql.GetCommonSymptomsQuery, Graphql.GetCommonSymptomsQueryVariables>(Graphql.GetCommonSymptomsDocument, options);};
export type GetCommonSymptomsSuspenseQueryHookResult = ReturnType<typeof useGetCommonSymptomsSuspenseQuery>;

export function useGetCommonSymptomQuery(baseOptions: Apollo.useQuery.Options<Graphql.GetCommonSymptomQuery, Graphql.GetCommonSymptomQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useQuery<Graphql.GetCommonSymptomQuery, Graphql.GetCommonSymptomQueryVariables>(Graphql.GetCommonSymptomDocument, options);};
export type GetCommonSymptomQueryHookResult = ReturnType<typeof useGetCommonSymptomQuery>;
export type GetCommonSymptomQueryResult = Apollo.useQuery.Result<Graphql.GetCommonSymptomQuery, Graphql.GetCommonSymptomQueryVariables>;

export function useGetCommonSymptomLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<Graphql.GetCommonSymptomQuery, Graphql.GetCommonSymptomQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useLazyQuery<Graphql.GetCommonSymptomQuery, Graphql.GetCommonSymptomQueryVariables>(Graphql.GetCommonSymptomDocument, options);};
export type GetCommonSymptomLazyQueryHookResult = ReturnType<typeof useGetCommonSymptomLazyQuery>;

export function useGetCommonSymptomSuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<Graphql.GetCommonSymptomQueryVariables>) {const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };return Apollo.useSuspenseQuery<Graphql.GetCommonSymptomQuery, Graphql.GetCommonSymptomQueryVariables>(Graphql.GetCommonSymptomDocument, options);};
export type GetCommonSymptomSuspenseQueryHookResult = ReturnType<typeof useGetCommonSymptomSuspenseQuery>;

export function useGetPatientsQuery(baseOptions: Apollo.useQuery.Options<Graphql.GetPatientsQuery, Graphql.GetPatientsQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useQuery<Graphql.GetPatientsQuery, Graphql.GetPatientsQueryVariables>(Graphql.GetPatientsDocument, options);};
export type GetPatientsQueryHookResult = ReturnType<typeof useGetPatientsQuery>;
export type GetPatientsQueryResult = Apollo.useQuery.Result<Graphql.GetPatientsQuery, Graphql.GetPatientsQueryVariables>;

export function useGetPatientsLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<Graphql.GetPatientsQuery, Graphql.GetPatientsQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useLazyQuery<Graphql.GetPatientsQuery, Graphql.GetPatientsQueryVariables>(Graphql.GetPatientsDocument, options);};
export type GetPatientsLazyQueryHookResult = ReturnType<typeof useGetPatientsLazyQuery>;

export function useGetPatientsSuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<Graphql.GetPatientsQueryVariables>) {const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };return Apollo.useSuspenseQuery<Graphql.GetPatientsQuery, Graphql.GetPatientsQueryVariables>(Graphql.GetPatientsDocument, options);};
export type GetPatientsSuspenseQueryHookResult = ReturnType<typeof useGetPatientsSuspenseQuery>;

export function useConsultationHistoryQuery(baseOptions?: Apollo.useQuery.Options<Graphql.ConsultationHistoryQuery, Graphql.ConsultationHistoryQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useQuery<Graphql.ConsultationHistoryQuery, Graphql.ConsultationHistoryQueryVariables>(Graphql.ConsultationHistoryDocument, options);};
export type ConsultationHistoryQueryHookResult = ReturnType<typeof useConsultationHistoryQuery>;
export type ConsultationHistoryQueryResult = Apollo.useQuery.Result<Graphql.ConsultationHistoryQuery, Graphql.ConsultationHistoryQueryVariables>;

export function useConsultationHistoryLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<Graphql.ConsultationHistoryQuery, Graphql.ConsultationHistoryQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useLazyQuery<Graphql.ConsultationHistoryQuery, Graphql.ConsultationHistoryQueryVariables>(Graphql.ConsultationHistoryDocument, options);};
export type ConsultationHistoryLazyQueryHookResult = ReturnType<typeof useConsultationHistoryLazyQuery>;

export function useConsultationHistorySuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<Graphql.ConsultationHistoryQueryVariables>) {const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };return Apollo.useSuspenseQuery<Graphql.ConsultationHistoryQuery, Graphql.ConsultationHistoryQueryVariables>(Graphql.ConsultationHistoryDocument, options);};
export type ConsultationHistorySuspenseQueryHookResult = ReturnType<typeof useConsultationHistorySuspenseQuery>;

export function useGetWalletByDoctorQuery(baseOptions: Apollo.useQuery.Options<Graphql.GetWalletByDoctorQuery, Graphql.GetWalletByDoctorQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useQuery<Graphql.GetWalletByDoctorQuery, Graphql.GetWalletByDoctorQueryVariables>(Graphql.GetWalletByDoctorDocument, options);};
export type GetWalletByDoctorQueryHookResult = ReturnType<typeof useGetWalletByDoctorQuery>;
export type GetWalletByDoctorQueryResult = Apollo.useQuery.Result<Graphql.GetWalletByDoctorQuery, Graphql.GetWalletByDoctorQueryVariables>;

export function useGetWalletByDoctorLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<Graphql.GetWalletByDoctorQuery, Graphql.GetWalletByDoctorQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useLazyQuery<Graphql.GetWalletByDoctorQuery, Graphql.GetWalletByDoctorQueryVariables>(Graphql.GetWalletByDoctorDocument, options);};
export type GetWalletByDoctorLazyQueryHookResult = ReturnType<typeof useGetWalletByDoctorLazyQuery>;

export function useGetWalletByDoctorSuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<Graphql.GetWalletByDoctorQueryVariables>) {const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };return Apollo.useSuspenseQuery<Graphql.GetWalletByDoctorQuery, Graphql.GetWalletByDoctorQueryVariables>(Graphql.GetWalletByDoctorDocument, options);};
export type GetWalletByDoctorSuspenseQueryHookResult = ReturnType<typeof useGetWalletByDoctorSuspenseQuery>;

export function useGetDoctorReviewsQuery(baseOptions: Apollo.useQuery.Options<Graphql.GetDoctorReviewsQuery, Graphql.GetDoctorReviewsQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useQuery<Graphql.GetDoctorReviewsQuery, Graphql.GetDoctorReviewsQueryVariables>(Graphql.GetDoctorReviewsDocument, options);};
export type GetDoctorReviewsQueryHookResult = ReturnType<typeof useGetDoctorReviewsQuery>;
export type GetDoctorReviewsQueryResult = Apollo.useQuery.Result<Graphql.GetDoctorReviewsQuery, Graphql.GetDoctorReviewsQueryVariables>;

export function useGetDoctorReviewsLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<Graphql.GetDoctorReviewsQuery, Graphql.GetDoctorReviewsQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useLazyQuery<Graphql.GetDoctorReviewsQuery, Graphql.GetDoctorReviewsQueryVariables>(Graphql.GetDoctorReviewsDocument, options);};
export type GetDoctorReviewsLazyQueryHookResult = ReturnType<typeof useGetDoctorReviewsLazyQuery>;

export function useGetDoctorReviewsSuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<Graphql.GetDoctorReviewsQueryVariables>) {const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };return Apollo.useSuspenseQuery<Graphql.GetDoctorReviewsQuery, Graphql.GetDoctorReviewsQueryVariables>(Graphql.GetDoctorReviewsDocument, options);};
export type GetDoctorReviewsSuspenseQueryHookResult = ReturnType<typeof useGetDoctorReviewsSuspenseQuery>;

export function useGetActiveFaqItemsQuery(baseOptions?: Apollo.useQuery.Options<Graphql.GetActiveFaqItemsQuery, Graphql.GetActiveFaqItemsQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useQuery<Graphql.GetActiveFaqItemsQuery, Graphql.GetActiveFaqItemsQueryVariables>(Graphql.GetActiveFaqItemsDocument, options);};
export type GetActiveFaqItemsQueryHookResult = ReturnType<typeof useGetActiveFaqItemsQuery>;
export type GetActiveFaqItemsQueryResult = Apollo.useQuery.Result<Graphql.GetActiveFaqItemsQuery, Graphql.GetActiveFaqItemsQueryVariables>;

export function useGetActiveFaqItemsLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<Graphql.GetActiveFaqItemsQuery, Graphql.GetActiveFaqItemsQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useLazyQuery<Graphql.GetActiveFaqItemsQuery, Graphql.GetActiveFaqItemsQueryVariables>(Graphql.GetActiveFaqItemsDocument, options);};
export type GetActiveFaqItemsLazyQueryHookResult = ReturnType<typeof useGetActiveFaqItemsLazyQuery>;

export function useGetActiveFaqItemsSuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<Graphql.GetActiveFaqItemsQueryVariables>) {const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };return Apollo.useSuspenseQuery<Graphql.GetActiveFaqItemsQuery, Graphql.GetActiveFaqItemsQueryVariables>(Graphql.GetActiveFaqItemsDocument, options);};
export type GetActiveFaqItemsSuspenseQueryHookResult = ReturnType<typeof useGetActiveFaqItemsSuspenseQuery>;

export function useInitiateUploadMutation(baseOptions?: Apollo.useMutation.Options<Graphql.InitiateUploadMutation, Graphql.InitiateUploadMutationVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useMutation<Graphql.InitiateUploadMutation, Graphql.InitiateUploadMutationVariables>(Graphql.InitiateUploadDocument, options);};
export type InitiateUploadMutationHookResult = ReturnType<typeof useInitiateUploadMutation>;
export type InitiateUploadMutationResult = Apollo.useMutation.Result<Graphql.InitiateUploadMutation>;

export function useConfirmUploadMutation(baseOptions?: Apollo.useMutation.Options<Graphql.ConfirmUploadMutation, Graphql.ConfirmUploadMutationVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useMutation<Graphql.ConfirmUploadMutation, Graphql.ConfirmUploadMutationVariables>(Graphql.ConfirmUploadDocument, options);};
export type ConfirmUploadMutationHookResult = ReturnType<typeof useConfirmUploadMutation>;
export type ConfirmUploadMutationResult = Apollo.useMutation.Result<Graphql.ConfirmUploadMutation>;

export function useUpdateUserMutation(baseOptions?: Apollo.useMutation.Options<Graphql.UpdateUserMutation, Graphql.UpdateUserMutationVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useMutation<Graphql.UpdateUserMutation, Graphql.UpdateUserMutationVariables>(Graphql.UpdateUserDocument, options);};
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.useMutation.Result<Graphql.UpdateUserMutation>;

export function useGetUserQuery(baseOptions?: Apollo.useQuery.Options<Graphql.GetUserQuery, Graphql.GetUserQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useQuery<Graphql.GetUserQuery, Graphql.GetUserQueryVariables>(Graphql.GetUserDocument, options);};
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserQueryResult = Apollo.useQuery.Result<Graphql.GetUserQuery, Graphql.GetUserQueryVariables>;

export function useGetUserLazyQuery(baseOptions?: Apollo.useLazyQuery.Options<Graphql.GetUserQuery, Graphql.GetUserQueryVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useLazyQuery<Graphql.GetUserQuery, Graphql.GetUserQueryVariables>(Graphql.GetUserDocument, options);};
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;

export function useGetUserSuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<Graphql.GetUserQueryVariables>) {const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };return Apollo.useSuspenseQuery<Graphql.GetUserQuery, Graphql.GetUserQueryVariables>(Graphql.GetUserDocument, options);};
export type GetUserSuspenseQueryHookResult = ReturnType<typeof useGetUserSuspenseQuery>;