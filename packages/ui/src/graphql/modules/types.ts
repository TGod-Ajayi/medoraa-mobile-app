/** biome-ignore-all lint: leave this file */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type Appointment = {
  __typename?: 'Appointment';
  createdAt: Scalars['DateTime']['output'];
  doctor: Doctor;
  endDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  patient: Patient;
  startDate: Scalars['DateTime']['output'];
  status: AppointmentStatus;
  updatedAt: Scalars['DateTime']['output'];
};

/** The status of an appointment */
export enum AppointmentStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Scheduled = 'SCHEDULED'
}

export type CommonSymptom = {
  __typename?: 'CommonSymptom';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CreateAppointmentInput = {
  /** Example field (placeholder) */
  exampleField: Scalars['Int']['input'];
};

export type CreateDoctorAvailabilityInput = {
  dayOfWeek: Scalars['Float']['input'];
  endTime: Scalars['String']['input'];
  startTime: Scalars['String']['input'];
  timezone: Scalars['String']['input'];
};

export type CreateDoctorSpecialtyInput = {
  specialtyId: Scalars['String']['input'];
};

export type CreateFileInput = {
  key: Scalars['String']['input'];
  size?: InputMaybe<Scalars['Float']['input']>;
  type: FileTypeEnum;
};

export type CreateFileOutput = {
  __typename?: 'CreateFileOutput';
  key: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type CreateUserInput = {
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role: UserRoles;
};

export type Doctor = {
  __typename?: 'Doctor';
  appointments?: Maybe<Array<Appointment>>;
  availability?: Maybe<Array<DoctorAvailability>>;
  clinicAddress?: Maybe<Scalars['String']['output']>;
  clinicName?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  doctorsSpecialties?: Maybe<Array<DoctorSpecialty>>;
  graduationYear?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  identificationFile?: Maybe<Scalars['String']['output']>;
  identificationNumber?: Maybe<Scalars['String']['output']>;
  identificationType?: Maybe<Scalars['String']['output']>;
  level?: Maybe<DoctorLevel>;
  medicalCertificateFile?: Maybe<Scalars['String']['output']>;
  medicalLicenseFile?: Maybe<Scalars['String']['output']>;
  medicalSchool?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type DoctorAvailability = {
  __typename?: 'DoctorAvailability';
  createdAt: Scalars['DateTime']['output'];
  dayOfWeek: Scalars['Float']['output'];
  doctor: Doctor;
  endTime: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  startTime: Scalars['String']['output'];
  timezone: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type DoctorFilterInput = {
  query?: InputMaybe<Scalars['String']['input']>;
  specialtyId?: InputMaybe<Scalars['String']['input']>;
};

/** The Type of identification a doctor can have */
export enum DoctorIdentificationTypes {
  Nin = 'NIN',
  Passport = 'PASSPORT'
}

/** The level of a doctor */
export enum DoctorLevel {
  Consultant = 'CONSULTANT',
  JuniorResident = 'JUNIOR_RESIDENT',
  MedicalOfficer = 'MEDICAL_OFFICER',
  SeniorResident = 'SENIOR_RESIDENT'
}

export type DoctorPaginated = {
  __typename?: 'DoctorPaginated';
  items?: Maybe<Array<Doctor>>;
  metaData?: Maybe<Scalars['JSON']['output']>;
  pageInfo?: Maybe<OffsetPageInfo>;
};

export type DoctorSpecialty = {
  __typename?: 'DoctorSpecialty';
  createdAt: Scalars['DateTime']['output'];
  doctor: Doctor;
  id: Scalars['ID']['output'];
  specialty: Specialty;
  updatedAt: Scalars['DateTime']['output'];
};

export type FileEntity = {
  __typename?: 'FileEntity';
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<User>;
  id: Scalars['ID']['output'];
  mimeType: Scalars['String']['output'];
  size: Scalars['Float']['output'];
  type: FileTypeEnum;
  updatedAt: Scalars['DateTime']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

/** The type of file, ex: profile picture, medical license */
export enum FileTypeEnum {
  MedicalCertificate = 'MEDICAL_CERTIFICATE',
  MedicalLicense = 'MEDICAL_LICENSE',
  ProfilePicture = 'PROFILE_PICTURE'
}

/** The genders a user can have */
export enum GenderTypes {
  Female = 'FEMALE',
  Male = 'MALE'
}

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginOutput = {
  __typename?: 'LoginOutput';
  /** JWT access token */
  accessToken: Scalars['String']['output'];
};

/** The Type of login a user can have */
export enum LoginTypes {
  Email = 'EMAIL',
  Google = 'GOOGLE'
}

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: Scalars['String']['output'];
  createAppointment: Appointment;
  createDoctorAvailability: DoctorAvailability;
  createFile: CreateFileOutput;
  forgotPassword: Scalars['String']['output'];
  login: LoginOutput;
  removeAppointment: Appointment;
  removeDoctor: Doctor;
  removeDoctorAvailability: Scalars['String']['output'];
  removeFile: FileEntity;
  removeUser: User;
  resetPassword: Scalars['String']['output'];
  signUp: LoginOutput;
  updateAppointment: Appointment;
  updateDoctor: Doctor;
  updateDoctorAvailability: DoctorAvailability;
  updateFile: FileEntity;
  updateUser: User;
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};


export type MutationCreateAppointmentArgs = {
  createAppointmentInput: CreateAppointmentInput;
};


export type MutationCreateDoctorAvailabilityArgs = {
  createDoctorAvailabilityInput: CreateDoctorAvailabilityInput;
};


export type MutationCreateFileArgs = {
  createFileInput: CreateFileInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  loginInput: LoginInput;
};


export type MutationRemoveAppointmentArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveDoctorArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveDoctorAvailabilityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveFileArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveUserArgs = {
  id: Scalars['Int']['input'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationSignUpArgs = {
  signUpInput: CreateUserInput;
};


export type MutationUpdateAppointmentArgs = {
  updateAppointmentInput: UpdateAppointmentInput;
};


export type MutationUpdateDoctorArgs = {
  updateDoctorInput: UpdateDoctorInput;
};


export type MutationUpdateDoctorAvailabilityArgs = {
  updateDoctorAvailabilityInput: UpdateDoctorAvailabilityInput;
};


export type MutationUpdateFileArgs = {
  updateFileInput: UpdateFileInput;
};


export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export type OffsetPageInfo = {
  __typename?: 'OffsetPageInfo';
  currentPage: Scalars['Float']['output'];
  itemCount: Scalars['Float']['output'];
  itemsPerPage: Scalars['Float']['output'];
  totalItems: Scalars['Float']['output'];
  totalPages: Scalars['Float']['output'];
};

export type Patient = {
  __typename?: 'Patient';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type PatientEncounter = {
  __typename?: 'PatientEncounter';
  chiefComplaint: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  diagnosis: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  notes: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Prescription = {
  __typename?: 'Prescription';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  patientEncounter: PatientEncounter;
  prescriptionItems: Array<PrescriptionItems>;
  updatedAt: Scalars['DateTime']['output'];
};

export type PrescriptionItems = {
  __typename?: 'PrescriptionItems';
  createdAt: Scalars['DateTime']['output'];
  dosage: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  instructions: Scalars['String']['output'];
  medicationName: Scalars['String']['output'];
  prescription: Prescription;
  quantity: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Query = {
  __typename?: 'Query';
  appointment: Appointment;
  file: Array<FileEntity>;
  getCommonSymptom: CommonSymptom;
  getCommonSymptoms: Array<CommonSymptom>;
  getDoctor: Doctor;
  getDoctorAvailabilityByWeekday: Array<DoctorAvailability>;
  getDoctorDetails: Doctor;
  getDoctors: DoctorPaginated;
  getSpecialties: Array<Specialty>;
  getSpecialty: Specialty;
  getUser: User;
  getViewUrl: Scalars['String']['output'];
};


export type QueryAppointmentArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetCommonSymptomArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetDoctorAvailabilityByWeekdayArgs = {
  dayOfWeek: Scalars['Int']['input'];
};


export type QueryGetDoctorDetailsArgs = {
  doctorId: Scalars['ID']['input'];
};


export type QueryGetDoctorsArgs = {
  filter?: InputMaybe<DoctorFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetSpecialtyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetViewUrlArgs = {
  filename: Scalars['String']['input'];
};

export type Specialty = {
  __typename?: 'Specialty';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  doctorName: Scalars['String']['output'];
  doctors?: Maybe<Array<DoctorSpecialty>>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type UpdateAppointmentInput = {
  /** Example field (placeholder) */
  exampleField?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['Int']['input'];
};

export type UpdateDoctorAvailabilityInput = {
  dayOfWeek?: InputMaybe<Scalars['Float']['input']>;
  endTime?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  startTime?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateDoctorInput = {
  clinicAddress?: InputMaybe<Scalars['String']['input']>;
  clinicName?: InputMaybe<Scalars['String']['input']>;
  doctorsSpecialties?: InputMaybe<Array<CreateDoctorSpecialtyInput>>;
  graduationYear?: InputMaybe<Scalars['Float']['input']>;
  identificationFile?: InputMaybe<Scalars['String']['input']>;
  identificationType?: InputMaybe<DoctorIdentificationTypes>;
  level?: InputMaybe<DoctorLevel>;
  medicalCertificate?: InputMaybe<Scalars['String']['input']>;
  medicalLicense?: InputMaybe<Scalars['String']['input']>;
  medicalSchool?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFileInput = {
  id: Scalars['ID']['input'];
  key?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Float']['input']>;
  type?: InputMaybe<FileTypeEnum>;
};

export type UpdateUserInput = {
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRoles>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  gender?: Maybe<GenderTypes>;
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  loginType: LoginTypes;
  password: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  profilePhoto?: Maybe<Scalars['String']['output']>;
  resetPasswordToken?: Maybe<Scalars['String']['output']>;
  role: UserRoles;
  updatedAt: Scalars['DateTime']['output'];
};

/** The Type of roles a user can have */
export enum UserRoles {
  Doctor = 'DOCTOR',
  Patient = 'PATIENT'
}

export type LoginMutationVariables = Exact<{
  loginInput: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginOutput', accessToken: string } };

export type SignUpMutationVariables = Exact<{
  signUpInput: CreateUserInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'LoginOutput', accessToken: string } };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: string };

export type ResetPasswordMutationVariables = Exact<{
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: string };

export type ChangePasswordMutationVariables = Exact<{
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: string };

export type UpdateDoctorMutationVariables = Exact<{
  updateDoctorInput: UpdateDoctorInput;
}>;


export type UpdateDoctorMutation = { __typename?: 'Mutation', updateDoctor: { __typename?: 'Doctor', id: string } };

export type GetDoctorDetailsQueryVariables = Exact<{
  doctorId: Scalars['ID']['input'];
}>;


export type GetDoctorDetailsQuery = { __typename?: 'Query', getDoctorDetails: { __typename?: 'Doctor', clinicAddress?: string | null, clinicName?: string | null, createdAt: any, graduationYear?: number | null, id: string, identificationFile?: string | null, identificationNumber?: string | null, identificationType?: string | null, level?: DoctorLevel | null, medicalCertificateFile?: string | null, medicalLicenseFile?: string | null, medicalSchool?: string | null, updatedAt: any, doctorsSpecialties?: Array<{ __typename?: 'DoctorSpecialty', createdAt: any, id: string, updatedAt: any, specialty: { __typename?: 'Specialty', code: string, createdAt: any, description?: string | null, doctorName: string, id: string, imageUrl?: string | null, name: string, updatedAt: any } }> | null } };

export type GetDoctorQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDoctorQuery = { __typename?: 'Query', getDoctor: { __typename?: 'Doctor', clinicAddress?: string | null, clinicName?: string | null, createdAt: any, graduationYear?: number | null, id: string, identificationFile?: string | null, identificationNumber?: string | null, identificationType?: string | null, level?: DoctorLevel | null, medicalCertificateFile?: string | null, medicalLicenseFile?: string | null, medicalSchool?: string | null, updatedAt: any, doctorsSpecialties?: Array<{ __typename?: 'DoctorSpecialty', createdAt: any, id: string, updatedAt: any, specialty: { __typename?: 'Specialty', code: string, createdAt: any, description?: string | null, doctorName: string, id: string, imageUrl?: string | null, name: string, updatedAt: any } }> | null } };

export type UpdateUserMutationVariables = Exact<{
  updateUserInput: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string } };

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', getUser: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, dateOfBirth?: any | null, gender?: GenderTypes | null, loginType: LoginTypes, phoneNumber?: string | null, profilePhoto?: string | null, role: UserRoles, createdAt: any, updatedAt: any } };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"loginInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"loginInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"loginInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"signUpInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"signUpInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"signUpInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const ForgotPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ForgotPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"forgotPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const ChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"oldPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}}}]}]}}]} as unknown as DocumentNode<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const UpdateDoctorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDoctor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateDoctorInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDoctorInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDoctor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateDoctorInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateDoctorInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateDoctorMutation, UpdateDoctorMutationVariables>;
export const GetDoctorDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDoctorDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"doctorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDoctorDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"doctorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"doctorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clinicAddress"}},{"kind":"Field","name":{"kind":"Name","value":"clinicName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"doctorsSpecialties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"specialty"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"doctorName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identificationFile"}},{"kind":"Field","name":{"kind":"Name","value":"identificationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"identificationType"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"medicalCertificateFile"}},{"kind":"Field","name":{"kind":"Name","value":"medicalLicenseFile"}},{"kind":"Field","name":{"kind":"Name","value":"medicalSchool"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetDoctorDetailsQuery, GetDoctorDetailsQueryVariables>;
export const GetDoctorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDoctor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDoctor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clinicAddress"}},{"kind":"Field","name":{"kind":"Name","value":"clinicName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"doctorsSpecialties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"specialty"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"doctorName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identificationFile"}},{"kind":"Field","name":{"kind":"Name","value":"identificationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"identificationType"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"medicalCertificateFile"}},{"kind":"Field","name":{"kind":"Name","value":"medicalLicenseFile"}},{"kind":"Field","name":{"kind":"Name","value":"medicalSchool"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetDoctorQuery, GetDoctorQueryVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateUserInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateUserInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateUserInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"loginType"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhoto"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;