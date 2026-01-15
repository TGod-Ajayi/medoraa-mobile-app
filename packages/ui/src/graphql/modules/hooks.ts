/* Auto-generated — DO NOT EDIT BY HAND */
/** biome-ignore-all lint: leave this file */
'use client';
import * as Apollo from '@apollo/client/react';
import * as Graphql from './types';

const defaultOptions = {} as const;

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

export function useUpdateDoctorMutation(baseOptions?: Apollo.useMutation.Options<Graphql.UpdateDoctorMutation, Graphql.UpdateDoctorMutationVariables>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useMutation<Graphql.UpdateDoctorMutation, Graphql.UpdateDoctorMutationVariables>(Graphql.UpdateDoctorDocument, options);};
export type UpdateDoctorMutationHookResult = ReturnType<typeof useUpdateDoctorMutation>;
export type UpdateDoctorMutationResult = Apollo.useMutation.Result<Graphql.UpdateDoctorMutation>;

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