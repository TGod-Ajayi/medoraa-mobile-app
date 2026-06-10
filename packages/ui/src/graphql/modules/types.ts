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

/** Whether content is free or premium */
export enum AccessLevel {
  Free = 'FREE',
  Premium = 'PREMIUM'
}

/** The type of user activity logged */
export enum ActivityType {
  BadgeEarned = 'BADGE_EARNED',
  ChallengeDayCompleted = 'CHALLENGE_DAY_COMPLETED',
  ContentCreated = 'CONTENT_CREATED',
  MealCompleted = 'MEAL_COMPLETED',
  ProgramTaskCompleted = 'PROGRAM_TASK_COMPLETED',
  WeightLogged = 'WEIGHT_LOGGED',
  WorkoutCompleted = 'WORKOUT_COMPLETED'
}

export type Appointment = {
  __typename?: 'Appointment';
  cancellationReason?: Maybe<Scalars['String']['output']>;
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  cancelledByUserId?: Maybe<Scalars['String']['output']>;
  consultationSession?: Maybe<ConsultationSession>;
  createdAt: Scalars['DateTime']['output'];
  doctor: Doctor;
  doctorTimeSlot?: Maybe<DoctorTimeSlot>;
  endDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isRescheduled: Scalars['Boolean']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  originalAppointment?: Maybe<Appointment>;
  originalAppointmentChain?: Maybe<Array<Appointment>>;
  patient: Patient;
  paymentStatus: AppointmentPaymentStatus;
  payments?: Maybe<Array<Payment>>;
  rescheduleReason?: Maybe<Scalars['String']['output']>;
  rescheduledByUserId?: Maybe<Scalars['String']['output']>;
  rescheduledFromAppointment?: Maybe<Appointment>;
  rescheduledTo?: Maybe<Array<Appointment>>;
  startDate: Scalars['DateTime']['output'];
  status: AppointmentStatus;
  type: AppointmentType;
  updatedAt: Scalars['DateTime']['output'];
};

export type AppointmentFilterInput = {
  doctorId?: InputMaybe<Scalars['ID']['input']>;
  patientId?: InputMaybe<Scalars['ID']['input']>;
  statuses?: InputMaybe<Array<AppointmentStatus>>;
  type?: InputMaybe<AppointmentType>;
};

export type AppointmentPaginated = {
  __typename?: 'AppointmentPaginated';
  items?: Maybe<Array<Appointment>>;
  metaData?: Maybe<Scalars['JSON']['output']>;
  pageInfo?: Maybe<OffsetPageInfo>;
};

/** The payment status of an appointment */
export enum AppointmentPaymentStatus {
  Failed = 'FAILED',
  Paid = 'PAID',
  Pending = 'PENDING',
  Refunded = 'REFUNDED',
  Unpaid = 'UNPAID'
}

/** The status of an appointment */
export enum AppointmentStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Confirmed = 'CONFIRMED',
  InProgress = 'IN_PROGRESS',
  Missed = 'MISSED',
  Pending = 'PENDING',
  Rescheduled = 'RESCHEDULED',
  Scheduled = 'SCHEDULED'
}

/** The type of an appointment */
export enum AppointmentType {
  Instant = 'INSTANT',
  Scheduled = 'SCHEDULED'
}

export type BadgeDefinition = {
  __typename?: 'BadgeDefinition';
  createdAt: Scalars['DateTime']['output'];
  criteria?: Maybe<Scalars['JSON']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  iconUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** ABO/Rh blood group of a patient */
export enum BloodGroup {
  AbNegative = 'AB_NEGATIVE',
  AbPositive = 'AB_POSITIVE',
  ANegative = 'A_NEGATIVE',
  APositive = 'A_POSITIVE',
  BNegative = 'B_NEGATIVE',
  BPositive = 'B_POSITIVE',
  ONegative = 'O_NEGATIVE',
  OPositive = 'O_POSITIVE'
}

export type BookAppointmentInput = {
  doctorId: Scalars['ID']['input'];
  doctorTimeSlotId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<AppointmentType>;
};

/** Budget level for a meal plan */
export enum BudgetLevel {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export type CancelAppointmentInput = {
  appointmentId: Scalars['ID']['input'];
  cancellationReason?: InputMaybe<Scalars['String']['input']>;
};

export type Challenge = {
  __typename?: 'Challenge';
  accessLevel: AccessLevel;
  category?: Maybe<LifestyleCategory>;
  coverImage?: Maybe<FileEntity>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  doctor: Doctor;
  durationDays: Scalars['Int']['output'];
  endDate: Scalars['DateTime']['output'];
  goalType?: Maybe<GoalType>;
  id: Scalars['ID']['output'];
  publishStatus: PublishStatus;
  rules?: Maybe<Scalars['String']['output']>;
  startDate: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ChallengePaginated = {
  __typename?: 'ChallengePaginated';
  items?: Maybe<Array<Challenge>>;
  metaData?: Maybe<Scalars['JSON']['output']>;
  pageInfo?: Maybe<OffsetPageInfo>;
};

export type ChallengeParticipant = {
  __typename?: 'ChallengeParticipant';
  challenge: Challenge;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  joinedAt: Scalars['DateTime']['output'];
  leftAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type ChallengeProgress = {
  __typename?: 'ChallengeProgress';
  completedAt: Scalars['DateTime']['output'];
  createdAt: Scalars['DateTime']['output'];
  day: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  note?: Maybe<Scalars['String']['output']>;
  participant: ChallengeParticipant;
  updatedAt: Scalars['DateTime']['output'];
};

export type CommonSymptom = {
  __typename?: 'CommonSymptom';
  createdAt: Scalars['DateTime']['output'];
  doctorCommonSymptoms?: Maybe<Array<DoctorCommonSymptom>>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Convenience filter for consultation history queries */
export enum ConsultationHistoryFilter {
  All = 'ALL',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Upcoming = 'UPCOMING'
}

export type ConsultationSession = {
  __typename?: 'ConsultationSession';
  appointment: Appointment;
  createdAt: Scalars['DateTime']['output'];
  doctor: Doctor;
  durationSeconds?: Maybe<Scalars['Int']['output']>;
  endedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  meetingUrl?: Maybe<Scalars['String']['output']>;
  patient: Patient;
  provider?: Maybe<Scalars['String']['output']>;
  providerMetadata?: Maybe<Scalars['String']['output']>;
  recordingFile?: Maybe<FileEntity>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  status: ConsultationSessionStatus;
  type: ConsultationSessionType;
  updatedAt: Scalars['DateTime']['output'];
};

/** The status of a consultation session */
export enum ConsultationSessionStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Missed = 'MISSED',
  Pending = 'PENDING'
}

/** The type of consultation session */
export enum ConsultationSessionType {
  Audio = 'AUDIO',
  Chat = 'CHAT',
  Video = 'VIDEO'
}

export type ContentComment = {
  __typename?: 'ContentComment';
  body: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  creatorContent: CreatorContent;
  id: Scalars['ID']['output'];
  parentComment?: Maybe<ContentComment>;
  replies?: Maybe<Array<ContentComment>>;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type ContentMedia = {
  __typename?: 'ContentMedia';
  caption?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  creatorContent: CreatorContent;
  file: FileEntity;
  id: Scalars['ID']['output'];
  sortOrder: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ContentReaction = {
  __typename?: 'ContentReaction';
  createdAt: Scalars['DateTime']['output'];
  creatorContent: CreatorContent;
  id: Scalars['ID']['output'];
  reactionType: ReactionType;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

/** The type of creator content */
export enum ContentType {
  Article = 'ARTICLE',
  ImagePost = 'IMAGE_POST',
  ShortTip = 'SHORT_TIP',
  TextPost = 'TEXT_POST',
  VideoPost = 'VIDEO_POST'
}

export type Conversation = {
  __typename?: 'Conversation';
  appointment?: Maybe<Appointment>;
  createdAt: Scalars['DateTime']['output'];
  doctor: Doctor;
  id: Scalars['ID']['output'];
  lastMessageAt?: Maybe<Scalars['DateTime']['output']>;
  messages?: Maybe<Array<Message>>;
  patient: Patient;
  updatedAt: Scalars['DateTime']['output'];
};

export type CreateChallengeInput = {
  accessLevel?: InputMaybe<AccessLevel>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  coverImageFileId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  durationDays: Scalars['Int']['input'];
  endDate: Scalars['DateTime']['input'];
  goalType?: InputMaybe<GoalType>;
  publishStatus?: InputMaybe<PublishStatus>;
  rules?: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['DateTime']['input'];
  title: Scalars['String']['input'];
};

export type CreateConsultationSessionInput = {
  appointmentId: Scalars['String']['input'];
  type?: InputMaybe<ConsultationSessionType>;
};

export type CreateConversationInput = {
  appointmentId?: InputMaybe<Scalars['ID']['input']>;
  doctorId: Scalars['ID']['input'];
  patientId: Scalars['ID']['input'];
};

export type CreateCreatorContentInput = {
  accessLevel?: InputMaybe<AccessLevel>;
  body?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  contentType: ContentType;
  mediaFileIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  publishStatus?: InputMaybe<PublishStatus>;
  title: Scalars['String']['input'];
};

export type CreateDepartmentInput = {
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  sortOrder?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateDoctorAvailabilityInput = {
  dayOfWeek: Scalars['Float']['input'];
  endTime: Scalars['String']['input'];
  startTime: Scalars['String']['input'];
  timezone: Scalars['String']['input'];
};

export type CreateDoctorReviewInput = {
  appointmentId: Scalars['ID']['input'];
  rating: Scalars['Int']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
};

export type CreateDoctorSpecialtyInput = {
  specialtyId: Scalars['String']['input'];
};

export type CreateFaqItemInput = {
  answer: Scalars['String']['input'];
  category: FaqCategory;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  question: Scalars['String']['input'];
  sortOrder?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateLifestyleCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  slug: Scalars['String']['input'];
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateMealPlanInput = {
  accessLevel?: InputMaybe<AccessLevel>;
  budgetLevel?: InputMaybe<BudgetLevel>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  coverImageFileId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  durationDays: Scalars['Int']['input'];
  publishStatus?: InputMaybe<PublishStatus>;
  targetGoal?: InputMaybe<GoalType>;
  title: Scalars['String']['input'];
};

export type CreateMessageInput = {
  content: Scalars['String']['input'];
  conversationId: Scalars['ID']['input'];
  fileId?: InputMaybe<Scalars['ID']['input']>;
  senderUserId: Scalars['ID']['input'];
  type: MessageType;
};

export type CreatePatientEncounterInput = {
  appointmentId: Scalars['ID']['input'];
  chiefComplaint: Scalars['String']['input'];
  consultationSessionId?: InputMaybe<Scalars['ID']['input']>;
  diagnosis: Scalars['String']['input'];
  notes: Scalars['String']['input'];
  treatmentPlan?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePatientInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  allergies?: InputMaybe<Array<Scalars['String']['input']>>;
  bloodGroup?: InputMaybe<BloodGroup>;
  chronicConditions?: InputMaybe<Array<Scalars['String']['input']>>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  currentMedications?: InputMaybe<Array<Scalars['String']['input']>>;
  emergencyContactName?: InputMaybe<Scalars['String']['input']>;
  emergencyContactPhone?: InputMaybe<Scalars['String']['input']>;
  emergencyContactRelationship?: InputMaybe<Scalars['String']['input']>;
  genotype?: InputMaybe<Genotype>;
  heightCm?: InputMaybe<Scalars['Float']['input']>;
  maritalStatus?: InputMaybe<MaritalStatus>;
  state?: InputMaybe<Scalars['String']['input']>;
  weightKg?: InputMaybe<Scalars['Float']['input']>;
};

export type CreatePatientPaymentMethodInput = {
  brand?: InputMaybe<Scalars['String']['input']>;
  expiryMonth?: InputMaybe<Scalars['String']['input']>;
  expiryYear?: InputMaybe<Scalars['String']['input']>;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  lastFourDigits?: InputMaybe<Scalars['String']['input']>;
  methodType: PaymentMethodType;
  provider: Scalars['String']['input'];
  providerCustomerId?: InputMaybe<Scalars['String']['input']>;
  providerPaymentMethodId?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePatientSupportEntryInput = {
  email: Scalars['String']['input'];
  message: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  subject: Scalars['String']['input'];
  type: SupportType;
};

export type CreatePrescriptionInput = {
  items: Array<PrescriptionItemInput>;
  patientEncounterId: Scalars['ID']['input'];
};

export type CreateSpecialtyInput = {
  code: Scalars['String']['input'];
  departmentId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateUserInput = {
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role: UserRoles;
};

export type CreateWeightRecordInput = {
  goalWeight?: InputMaybe<Scalars['Float']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<WeightUnit>;
  weight: Scalars['Float']['input'];
};

export type CreateWellnessProgramInput = {
  accessLevel?: InputMaybe<AccessLevel>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  coverImageFileId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  difficulty: DifficultyLevel;
  durationWeeks: Scalars['Int']['input'];
  publishStatus?: InputMaybe<PublishStatus>;
  targetAudience?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateWithdrawalRequestInput = {
  amount: Scalars['Float']['input'];
  bankAccountName: Scalars['String']['input'];
  bankAccountNumber: Scalars['String']['input'];
  bankName: Scalars['String']['input'];
};

export type CreateWorkoutInput = {
  accessLevel?: InputMaybe<AccessLevel>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  coverImageFileId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  difficulty: DifficultyLevel;
  durationMinutes: Scalars['Int']['input'];
  equipmentRequired?: InputMaybe<Scalars['String']['input']>;
  estimatedCalories?: InputMaybe<Scalars['Int']['input']>;
  instructions?: InputMaybe<Scalars['String']['input']>;
  publishStatus?: InputMaybe<PublishStatus>;
  targetArea?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreatorContent = {
  __typename?: 'CreatorContent';
  accessLevel: AccessLevel;
  body?: Maybe<Scalars['String']['output']>;
  category?: Maybe<LifestyleCategory>;
  contentType: ContentType;
  createdAt: Scalars['DateTime']['output'];
  doctor: Doctor;
  id: Scalars['ID']['output'];
  media?: Maybe<Array<ContentMedia>>;
  publishStatus: PublishStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  viewCount: Scalars['Int']['output'];
};

export type CreatorContentFilterInput = {
  accessLevel?: InputMaybe<AccessLevel>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  contentType?: InputMaybe<ContentType>;
  doctorId?: InputMaybe<Scalars['ID']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
};

export type CreatorContentPaginated = {
  __typename?: 'CreatorContentPaginated';
  items?: Maybe<Array<CreatorContent>>;
  metaData?: Maybe<Scalars['JSON']['output']>;
  pageInfo?: Maybe<OffsetPageInfo>;
};

export type CreatorFollow = {
  __typename?: 'CreatorFollow';
  createdAt: Scalars['DateTime']['output'];
  doctor: Doctor;
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type Department = {
  __typename?: 'Department';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  sortOrder: Scalars['Float']['output'];
  specialties?: Maybe<Array<Specialty>>;
  updatedAt: Scalars['DateTime']['output'];
};

/** The difficulty level of a workout or program */
export enum DifficultyLevel {
  Advanced = 'ADVANCED',
  Beginner = 'BEGINNER',
  Intermediate = 'INTERMEDIATE'
}

export type Doctor = {
  __typename?: 'Doctor';
  appointments?: Maybe<Array<Appointment>>;
  availability?: Maybe<Array<DoctorAvailability>>;
  averageRating: Scalars['Float']['output'];
  bio?: Maybe<Scalars['String']['output']>;
  clinicAddress?: Maybe<Scalars['String']['output']>;
  clinicName?: Maybe<Scalars['String']['output']>;
  consultationFee: Scalars['Float']['output'];
  consultationSessions?: Maybe<Array<ConsultationSession>>;
  createdAt: Scalars['DateTime']['output'];
  doctorCommonSymptoms?: Maybe<Array<DoctorCommonSymptom>>;
  doctorTimeSlots?: Maybe<Array<DoctorTimeSlot>>;
  doctorsSpecialties?: Maybe<Array<DoctorSpecialty>>;
  graduationYear?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  identificationFile?: Maybe<Scalars['String']['output']>;
  identificationNumber?: Maybe<Scalars['String']['output']>;
  identificationType?: Maybe<Scalars['String']['output']>;
  instantConsultationEnabled: Scalars['Boolean']['output'];
  instantConsultationFee: Scalars['Float']['output'];
  isOnline: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  level?: Maybe<DoctorLevel>;
  medicalCertificateFile?: Maybe<Scalars['String']['output']>;
  medicalLicenseFile?: Maybe<Scalars['String']['output']>;
  medicalSchool?: Maybe<Scalars['String']['output']>;
  totalReviews: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  yearsOfExperience?: Maybe<Scalars['Float']['output']>;
};

export type DoctorAvailability = {
  __typename?: 'DoctorAvailability';
  createdAt: Scalars['DateTime']['output'];
  dayOfWeek: Scalars['Float']['output'];
  doctor: Doctor;
  endTime: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  startTime: Scalars['String']['output'];
  timezone: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type DoctorCommonSymptom = {
  __typename?: 'DoctorCommonSymptom';
  commonSymptom: CommonSymptom;
  createdAt: Scalars['DateTime']['output'];
  doctor: Doctor;
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type DoctorFilterInput = {
  instantConsultationEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  isOnline?: InputMaybe<Scalars['Boolean']['input']>;
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

export type DoctorReview = {
  __typename?: 'DoctorReview';
  appointment: Appointment;
  createdAt: Scalars['DateTime']['output'];
  doctor: Doctor;
  doctorResponse?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  patient: Patient;
  rating: Scalars['Int']['output'];
  text?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type DoctorSpecialty = {
  __typename?: 'DoctorSpecialty';
  createdAt: Scalars['DateTime']['output'];
  doctor: Doctor;
  id: Scalars['ID']['output'];
  specialty: Specialty;
  updatedAt: Scalars['DateTime']['output'];
};

export type DoctorTimeSlot = {
  __typename?: 'DoctorTimeSlot';
  appointment?: Maybe<Appointment>;
  createdAt: Scalars['DateTime']['output'];
  doctor: Doctor;
  endDateTime: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isInstantConsultationSlot: Scalars['Boolean']['output'];
  slotDate: Scalars['String']['output'];
  startDateTime: Scalars['DateTime']['output'];
  status: DoctorTimeSlotStatus;
  updatedAt: Scalars['DateTime']['output'];
};

/** Status of a doctor time slot */
export enum DoctorTimeSlotStatus {
  Available = 'AVAILABLE',
  Blocked = 'BLOCKED',
  Booked = 'BOOKED',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Held = 'HELD'
}

/** The category of an FAQ item */
export enum FaqCategory {
  Consultation = 'CONSULTATION',
  General = 'GENERAL',
  Payment = 'PAYMENT',
  Technical = 'TECHNICAL'
}

export type FaqItem = {
  __typename?: 'FaqItem';
  answer: Scalars['String']['output'];
  category: FaqCategory;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  question: Scalars['String']['output'];
  sortOrder: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type FileEntity = {
  __typename?: 'FileEntity';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  mimeType: Scalars['String']['output'];
  originalName?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  status: FileStatusEnum;
  type: FileTypeEnum;
  updatedAt: Scalars['DateTime']['output'];
};

/** Upload lifecycle status — PENDING until the client confirms the upload */
export enum FileStatusEnum {
  Confirmed = 'CONFIRMED',
  Pending = 'PENDING'
}

/** The category of file being stored */
export enum FileTypeEnum {
  ConsultationRecording = 'CONSULTATION_RECORDING',
  Identification = 'IDENTIFICATION',
  MedicalCertificate = 'MEDICAL_CERTIFICATE',
  MedicalLicense = 'MEDICAL_LICENSE',
  MedicalRecord = 'MEDICAL_RECORD',
  PrescriptionAttachment = 'PRESCRIPTION_ATTACHMENT',
  ProfilePicture = 'PROFILE_PICTURE'
}

/** The genders a user can have */
export enum GenderTypes {
  Female = 'FEMALE',
  Male = 'MALE'
}

/** Haemoglobin genotype of a patient */
export enum Genotype {
  Aa = 'AA',
  Ac = 'AC',
  As = 'AS',
  Sc = 'SC',
  Ss = 'SS'
}

/** The goal type for challenges and programs */
export enum GoalType {
  GeneralFitness = 'GENERAL_FITNESS',
  HabitFormation = 'HABIT_FORMATION',
  HealthyEating = 'HEALTHY_EATING',
  Hydration = 'HYDRATION',
  MuscleGain = 'MUSCLE_GAIN',
  WeightLoss = 'WEIGHT_LOSS'
}

export type InitializePaymentInput = {
  amount: Scalars['Float']['input'];
  appointmentId: Scalars['String']['input'];
  currency?: InputMaybe<Scalars['String']['input']>;
  provider: PaymentProvider;
  type: PaymentType;
};

export type InitiateUploadInput = {
  filename: Scalars['String']['input'];
  size?: InputMaybe<Scalars['Int']['input']>;
  type: FileTypeEnum;
};

export type InitiateUploadOutput = {
  __typename?: 'InitiateUploadOutput';
  /** UTC timestamp when the pre-signed URL expires. */
  expiresAt: Scalars['DateTime']['output'];
  /** Storage key — pass to confirmUpload after the PUT succeeds. */
  key: Scalars['String']['output'];
  /** Pre-signed PUT URL. Upload via HTTP PUT with raw file bytes. */
  presignedUrl: Scalars['String']['output'];
};

export type LifestyleCategory = {
  __typename?: 'LifestyleCategory';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  iconUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  sortOrder: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type LifestyleDashboard = {
  __typename?: 'LifestyleDashboard';
  activeChallenges: Scalars['Int']['output'];
  activeMealPlans: Scalars['Int']['output'];
  activePrograms: Scalars['Int']['output'];
  badgesEarned: Scalars['Int']['output'];
  completedWorkouts: Scalars['Int']['output'];
  healthScore: Scalars['Int']['output'];
  isPremium: Scalars['Boolean']['output'];
  weightProgress: WeightProgress;
};

export type LifestyleEvent = {
  __typename?: 'LifestyleEvent';
  data: Scalars['JSON']['output'];
  module: Scalars['String']['output'];
  operation: LifestyleOperation;
  timestamp: Scalars['DateTime']['output'];
};

/** The type of CRUD/action operation that occurred */
export enum LifestyleOperation {
  Archived = 'ARCHIVED',
  Awarded = 'AWARDED',
  Commented = 'COMMENTED',
  Completed = 'COMPLETED',
  Created = 'CREATED',
  Deleted = 'DELETED',
  Enrolled = 'ENROLLED',
  Followed = 'FOLLOWED',
  Joined = 'JOINED',
  Left = 'LEFT',
  Logged = 'LOGGED',
  Reacted = 'REACTED',
  Saved = 'SAVED',
  Unfollowed = 'UNFOLLOWED',
  Updated = 'UPDATED'
}

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginOutput = {
  __typename?: 'LoginOutput';
  /** JWT access token */
  accessToken: Scalars['String']['output'];
  /** JWT refresh token — long-lived, use to obtain a new access token */
  refreshToken: Scalars['String']['output'];
};

/** The Type of login a user can have */
export enum LoginTypes {
  Email = 'EMAIL',
  Google = 'GOOGLE'
}

/** Marital status of a patient */
export enum MaritalStatus {
  Divorced = 'DIVORCED',
  Married = 'MARRIED',
  Separated = 'SEPARATED',
  Single = 'SINGLE',
  Widowed = 'WIDOWED'
}

export type MealPlan = {
  __typename?: 'MealPlan';
  accessLevel: AccessLevel;
  budgetLevel?: Maybe<BudgetLevel>;
  category?: Maybe<LifestyleCategory>;
  coverImage?: Maybe<FileEntity>;
  createdAt: Scalars['DateTime']['output'];
  days?: Maybe<Array<MealPlanDay>>;
  description?: Maybe<Scalars['String']['output']>;
  doctor: Doctor;
  durationDays: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  publishStatus: PublishStatus;
  targetGoal?: Maybe<GoalType>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type MealPlanDay = {
  __typename?: 'MealPlanDay';
  createdAt: Scalars['DateTime']['output'];
  dayNumber: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  mealPlan: MealPlan;
  meals?: Maybe<Array<MealPlanMeal>>;
  title?: Maybe<Scalars['String']['output']>;
  totalCalories?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type MealPlanMeal = {
  __typename?: 'MealPlanMeal';
  calories?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  ingredients?: Maybe<Scalars['String']['output']>;
  mealPlanDay: MealPlanDay;
  mealType: MealType;
  name: Scalars['String']['output'];
  recipe?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type MealPlanPaginated = {
  __typename?: 'MealPlanPaginated';
  items?: Maybe<Array<MealPlan>>;
  metaData?: Maybe<Scalars['JSON']['output']>;
  pageInfo?: Maybe<OffsetPageInfo>;
};

/** The type of meal within a meal plan day */
export enum MealType {
  Breakfast = 'BREAKFAST',
  Dinner = 'DINNER',
  Lunch = 'LUNCH',
  Snack = 'SNACK'
}

export type Message = {
  __typename?: 'Message';
  content: Scalars['String']['output'];
  conversation: Conversation;
  createdAt: Scalars['DateTime']['output'];
  file?: Maybe<FileEntity>;
  id: Scalars['ID']['output'];
  isRead: Scalars['Boolean']['output'];
  readAt?: Maybe<Scalars['DateTime']['output']>;
  senderUser: User;
  type: MessageType;
  updatedAt: Scalars['DateTime']['output'];
};

/** The type of message */
export enum MessageType {
  File = 'FILE',
  Image = 'IMAGE',
  System = 'SYSTEM',
  Text = 'TEXT'
}

export type Mutation = {
  __typename?: 'Mutation';
  addContentComment: ContentComment;
  addFavoriteDoctor: PatientFavoriteDoctor;
  archiveCreatorContent: CreatorContent;
  attachRecordingToSession?: Maybe<ConsultationSession>;
  bookAppointment: Appointment;
  cancelAppointment: Appointment;
  cancelPrescription: Prescription;
  changePassword: Scalars['String']['output'];
  completeMeal: UserMealCompletion;
  completeProgramTask: UserProgramTaskProgress;
  completeWorkout: UserWorkoutCompletion;
  /** Step 2: confirm a completed upload and activate the file record. */
  confirmUpload: FileEntity;
  createChallenge: Challenge;
  createConsultationSession: ConsultationSession;
  createCreatorContent: CreatorContent;
  createDepartment: Department;
  createDoctorAvailability: DoctorAvailability;
  createDoctorReview: DoctorReview;
  createFaqItem: FaqItem;
  createLifestyleCategory: LifestyleCategory;
  createMealPlan: MealPlan;
  createMessage: Message;
  createPatientEncounter: PatientEncounter;
  createPatientPaymentMethod: PatientPaymentMethod;
  createPatientProfile: Patient;
  createPatientSupportEntry: PatientSupportEntry;
  createPrescription: Prescription;
  createSpecialty: Specialty;
  createWellnessProgram: WellnessProgram;
  createWithdrawalRequest: WithdrawalRequest;
  createWorkout: Workout;
  endConsultationSession?: Maybe<ConsultationSession>;
  enrollInProgram: UserProgramEnrollment;
  ensureWalletForDoctor: Wallet;
  findOrCreateConversation: Conversation;
  followCreator: CreatorFollow;
  followMealPlan: UserMealPlan;
  forgotPassword: Scalars['String']['output'];
  initializePayment: Payment;
  /** Step 1: obtain a pre-signed PUT URL to upload a file directly to storage. */
  initiateUpload: InitiateUploadOutput;
  issuePrescription: Prescription;
  joinChallenge: ChallengeParticipant;
  leaveChallenge: Scalars['Boolean']['output'];
  logWeight: WeightRecord;
  login: LoginOutput;
  markMessageAsRead?: Maybe<Message>;
  markNotificationAsRead: Notification;
  processWithdrawalRequest: WithdrawalRequest;
  reactToContent: ContentReaction;
  refreshAccessToken: LoginOutput;
  removeContentReaction: Scalars['Boolean']['output'];
  removeDoctor: Doctor;
  removeDoctorAvailability: Scalars['String']['output'];
  removeFaqItem: Scalars['Boolean']['output'];
  removeFavoriteDoctor: Scalars['Boolean']['output'];
  removePatientPaymentMethod: PatientPaymentMethod;
  removePatientProfile: Patient;
  removeSpecialty: Scalars['Boolean']['output'];
  removeUser: User;
  requestInstantConsultation: Appointment;
  rescheduleAppointment: Appointment;
  resetPassword: Scalars['String']['output'];
  respondToDoctorReview: DoctorReview;
  saveCreatorContent: SavedContent;
  setDefaultPatientPaymentMethod: PatientPaymentMethod;
  setDoctorOnlineStatus: Doctor;
  signUp: LoginOutput;
  startConsultationSession?: Maybe<ConsultationSession>;
  submitChallengeProgress: ChallengeProgress;
  unfollowCreator: Scalars['Boolean']['output'];
  unsaveCreatorContent: Scalars['Boolean']['output'];
  updateCreatorContent: CreatorContent;
  updateDepartment: Department;
  updateDoctor: Doctor;
  updateDoctorAvailability: DoctorAvailability;
  updateFaqItem: FaqItem;
  updateLifestyleCategory: LifestyleCategory;
  updateMealPlan: MealPlan;
  updatePatientEncounter: PatientEncounter;
  updatePatientProfile: Patient;
  updatePatientSupportEntryStatus: PatientSupportEntry;
  updatePrescription: Prescription;
  updateSpecialty: Specialty;
  updateUser: User;
  updateWellnessProgram: WellnessProgram;
  updateWorkout: Workout;
  verifyPayment?: Maybe<Payment>;
  verifyResetOtp: Scalars['String']['output'];
};


export type MutationAddContentCommentArgs = {
  body: Scalars['String']['input'];
  contentId: Scalars['ID']['input'];
  parentCommentId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationAddFavoriteDoctorArgs = {
  doctorId: Scalars['ID']['input'];
  patientId: Scalars['ID']['input'];
};


export type MutationArchiveCreatorContentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAttachRecordingToSessionArgs = {
  fileId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
};


export type MutationBookAppointmentArgs = {
  input: BookAppointmentInput;
};


export type MutationCancelAppointmentArgs = {
  input: CancelAppointmentInput;
};


export type MutationCancelPrescriptionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};


export type MutationCompleteMealArgs = {
  mealPlanMealId: Scalars['ID']['input'];
  userMealPlanId: Scalars['ID']['input'];
};


export type MutationCompleteProgramTaskArgs = {
  enrollmentId: Scalars['ID']['input'];
  taskId: Scalars['ID']['input'];
};


export type MutationCompleteWorkoutArgs = {
  caloriesBurned?: InputMaybe<Scalars['Int']['input']>;
  durationMinutes?: InputMaybe<Scalars['Int']['input']>;
  workoutId: Scalars['ID']['input'];
};


export type MutationConfirmUploadArgs = {
  key: Scalars['String']['input'];
};


export type MutationCreateChallengeArgs = {
  input: CreateChallengeInput;
};


export type MutationCreateConsultationSessionArgs = {
  input: CreateConsultationSessionInput;
};


export type MutationCreateCreatorContentArgs = {
  input: CreateCreatorContentInput;
};


export type MutationCreateDepartmentArgs = {
  input: CreateDepartmentInput;
};


export type MutationCreateDoctorAvailabilityArgs = {
  createDoctorAvailabilityInput: CreateDoctorAvailabilityInput;
};


export type MutationCreateDoctorReviewArgs = {
  input: CreateDoctorReviewInput;
};


export type MutationCreateFaqItemArgs = {
  input: CreateFaqItemInput;
};


export type MutationCreateLifestyleCategoryArgs = {
  input: CreateLifestyleCategoryInput;
};


export type MutationCreateMealPlanArgs = {
  input: CreateMealPlanInput;
};


export type MutationCreateMessageArgs = {
  input: CreateMessageInput;
};


export type MutationCreatePatientEncounterArgs = {
  input: CreatePatientEncounterInput;
};


export type MutationCreatePatientPaymentMethodArgs = {
  input: CreatePatientPaymentMethodInput;
};


export type MutationCreatePatientProfileArgs = {
  input: CreatePatientInput;
};


export type MutationCreatePatientSupportEntryArgs = {
  input: CreatePatientSupportEntryInput;
};


export type MutationCreatePrescriptionArgs = {
  input: CreatePrescriptionInput;
};


export type MutationCreateSpecialtyArgs = {
  input: CreateSpecialtyInput;
};


export type MutationCreateWellnessProgramArgs = {
  input: CreateWellnessProgramInput;
};


export type MutationCreateWithdrawalRequestArgs = {
  doctorId: Scalars['ID']['input'];
  input: CreateWithdrawalRequestInput;
};


export type MutationCreateWorkoutArgs = {
  input: CreateWorkoutInput;
};


export type MutationEndConsultationSessionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationEnrollInProgramArgs = {
  programId: Scalars['ID']['input'];
};


export type MutationEnsureWalletForDoctorArgs = {
  doctorId: Scalars['ID']['input'];
};


export type MutationFindOrCreateConversationArgs = {
  input: CreateConversationInput;
};


export type MutationFollowCreatorArgs = {
  doctorId: Scalars['ID']['input'];
};


export type MutationFollowMealPlanArgs = {
  mealPlanId: Scalars['ID']['input'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationInitializePaymentArgs = {
  input: InitializePaymentInput;
};


export type MutationInitiateUploadArgs = {
  input: InitiateUploadInput;
};


export type MutationIssuePrescriptionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationJoinChallengeArgs = {
  challengeId: Scalars['ID']['input'];
};


export type MutationLeaveChallengeArgs = {
  challengeId: Scalars['ID']['input'];
};


export type MutationLogWeightArgs = {
  input: CreateWeightRecordInput;
};


export type MutationLoginArgs = {
  loginInput: LoginInput;
};


export type MutationMarkMessageAsReadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationProcessWithdrawalRequestArgs = {
  id: Scalars['ID']['input'];
  processedByUserId: Scalars['ID']['input'];
  rejectionReason?: InputMaybe<Scalars['String']['input']>;
  status: WithdrawalStatus;
};


export type MutationReactToContentArgs = {
  contentId: Scalars['ID']['input'];
  reactionType?: InputMaybe<ReactionType>;
};


export type MutationRefreshAccessTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRemoveContentReactionArgs = {
  contentId: Scalars['ID']['input'];
};


export type MutationRemoveDoctorArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveDoctorAvailabilityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveFaqItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveFavoriteDoctorArgs = {
  doctorId: Scalars['ID']['input'];
  patientId: Scalars['ID']['input'];
};


export type MutationRemovePatientPaymentMethodArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveSpecialtyArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveUserArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRequestInstantConsultationArgs = {
  input: RequestInstantConsultationInput;
};


export type MutationRescheduleAppointmentArgs = {
  input: RescheduleAppointmentInput;
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationRespondToDoctorReviewArgs = {
  input: RespondToDoctorReviewInput;
};


export type MutationSaveCreatorContentArgs = {
  contentId: Scalars['ID']['input'];
};


export type MutationSetDefaultPatientPaymentMethodArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSetDoctorOnlineStatusArgs = {
  instantConsultationEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  isOnline?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationSignUpArgs = {
  signUpInput: CreateUserInput;
};


export type MutationStartConsultationSessionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitChallengeProgressArgs = {
  challengeId: Scalars['ID']['input'];
  day: Scalars['Int']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUnfollowCreatorArgs = {
  doctorId: Scalars['ID']['input'];
};


export type MutationUnsaveCreatorContentArgs = {
  contentId: Scalars['ID']['input'];
};


export type MutationUpdateCreatorContentArgs = {
  input: UpdateCreatorContentInput;
};


export type MutationUpdateDepartmentArgs = {
  input: UpdateDepartmentInput;
};


export type MutationUpdateDoctorArgs = {
  updateDoctorInput: UpdateDoctorInput;
};


export type MutationUpdateDoctorAvailabilityArgs = {
  updateDoctorAvailabilityInput: UpdateDoctorAvailabilityInput;
};


export type MutationUpdateFaqItemArgs = {
  id: Scalars['ID']['input'];
  input: CreateFaqItemInput;
};


export type MutationUpdateLifestyleCategoryArgs = {
  input: UpdateLifestyleCategoryInput;
};


export type MutationUpdateMealPlanArgs = {
  input: UpdateMealPlanInput;
};


export type MutationUpdatePatientEncounterArgs = {
  input: UpdatePatientEncounterInput;
};


export type MutationUpdatePatientProfileArgs = {
  input: UpdatePatientInput;
};


export type MutationUpdatePatientSupportEntryStatusArgs = {
  id: Scalars['ID']['input'];
  resolutionNotes?: InputMaybe<Scalars['String']['input']>;
  status: SupportStatus;
};


export type MutationUpdatePrescriptionArgs = {
  input: UpdatePrescriptionInput;
};


export type MutationUpdateSpecialtyArgs = {
  input: UpdateSpecialtyInput;
};


export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};


export type MutationUpdateWellnessProgramArgs = {
  input: UpdateWellnessProgramInput;
};


export type MutationUpdateWorkoutArgs = {
  input: UpdateWorkoutInput;
};


export type MutationVerifyPaymentArgs = {
  input: VerifyPaymentInput;
};


export type MutationVerifyResetOtpArgs = {
  email: Scalars['String']['input'];
  otp: Scalars['String']['input'];
};

export type Notification = {
  __typename?: 'Notification';
  body: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['String']['output']>;
  readAt?: Maybe<Scalars['DateTime']['output']>;
  recipientUser: User;
  status: NotificationStatus;
  title: Scalars['String']['output'];
  type: NotificationType;
  updatedAt: Scalars['DateTime']['output'];
};

/** The read status of a notification */
export enum NotificationStatus {
  Read = 'READ',
  Unread = 'UNREAD'
}

/** The type of notification */
export enum NotificationType {
  Appointment = 'APPOINTMENT',
  ChallengeUpdate = 'CHALLENGE_UPDATE',
  CreatorPost = 'CREATOR_POST',
  LifestyleReminder = 'LIFESTYLE_REMINDER',
  Message = 'MESSAGE',
  Payment = 'PAYMENT',
  Prescription = 'PRESCRIPTION',
  ProgramUpdate = 'PROGRAM_UPDATE',
  Review = 'REVIEW',
  System = 'SYSTEM'
}

export type OffsetPageInfo = {
  __typename?: 'OffsetPageInfo';
  currentPage: Scalars['Float']['output'];
  itemCount: Scalars['Float']['output'];
  itemsPerPage: Scalars['Float']['output'];
  totalItems: Scalars['Float']['output'];
  totalPages: Scalars['Float']['output'];
};

export type OffsetPaginationArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type Patient = {
  __typename?: 'Patient';
  address?: Maybe<Scalars['String']['output']>;
  allergies?: Maybe<Array<Scalars['String']['output']>>;
  bloodGroup?: Maybe<BloodGroup>;
  chronicConditions?: Maybe<Array<Scalars['String']['output']>>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currentMedications?: Maybe<Array<Scalars['String']['output']>>;
  emergencyContactName?: Maybe<Scalars['String']['output']>;
  emergencyContactPhone?: Maybe<Scalars['String']['output']>;
  emergencyContactRelationship?: Maybe<Scalars['String']['output']>;
  genotype?: Maybe<Genotype>;
  heightCm?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  maritalStatus?: Maybe<MaritalStatus>;
  state?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  weightKg?: Maybe<Scalars['Float']['output']>;
};

export type PatientEncounter = {
  __typename?: 'PatientEncounter';
  chiefComplaint: Scalars['String']['output'];
  consultationSession?: Maybe<ConsultationSession>;
  createdAt: Scalars['DateTime']['output'];
  diagnosis: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  notes: Scalars['String']['output'];
  treatmentPlan?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type PatientFavoriteDoctor = {
  __typename?: 'PatientFavoriteDoctor';
  createdAt: Scalars['DateTime']['output'];
  doctor: Doctor;
  id: Scalars['ID']['output'];
  patient: Patient;
  updatedAt: Scalars['DateTime']['output'];
};

export type PatientFilterInput = {
  query?: InputMaybe<Scalars['String']['input']>;
};

export type PatientPaginated = {
  __typename?: 'PatientPaginated';
  items?: Maybe<Array<Patient>>;
  metaData?: Maybe<Scalars['JSON']['output']>;
  pageInfo?: Maybe<OffsetPageInfo>;
};

export type PatientPaymentMethod = {
  __typename?: 'PatientPaymentMethod';
  brand?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  expiryMonth?: Maybe<Scalars['String']['output']>;
  expiryYear?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isDefault: Scalars['Boolean']['output'];
  lastFourDigits?: Maybe<Scalars['String']['output']>;
  methodType: PaymentMethodType;
  patient: Patient;
  provider: Scalars['String']['output'];
  providerCustomerId?: Maybe<Scalars['String']['output']>;
  providerPaymentMethodId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type PatientSupportEntry = {
  __typename?: 'PatientSupportEntry';
  assignedToUserId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  patient?: Maybe<Patient>;
  phone?: Maybe<Scalars['String']['output']>;
  resolutionNotes?: Maybe<Scalars['String']['output']>;
  resolvedAt?: Maybe<Scalars['DateTime']['output']>;
  status: SupportStatus;
  subject: Scalars['String']['output'];
  type: SupportType;
  updatedAt: Scalars['DateTime']['output'];
};

export type Payment = {
  __typename?: 'Payment';
  amount: Scalars['Float']['output'];
  appointment?: Maybe<Appointment>;
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  idempotencyKey?: Maybe<Scalars['String']['output']>;
  patient: Patient;
  provider: PaymentProvider;
  providerReference?: Maybe<Scalars['String']['output']>;
  providerResponse?: Maybe<Scalars['String']['output']>;
  status: PaymentStatus;
  type: PaymentType;
  updatedAt: Scalars['DateTime']['output'];
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
  webhookData?: Maybe<Scalars['String']['output']>;
};

/** The type of saved payment method */
export enum PaymentMethodType {
  BankTransfer = 'BANK_TRANSFER',
  Card = 'CARD',
  MobileMoney = 'MOBILE_MONEY'
}

/** The payment provider used */
export enum PaymentProvider {
  Flutterwave = 'FLUTTERWAVE',
  Paystack = 'PAYSTACK',
  Stripe = 'STRIPE'
}

/** The status of a payment */
export enum PaymentStatus {
  Failed = 'FAILED',
  Initialized = 'INITIALIZED',
  Pending = 'PENDING',
  Refunded = 'REFUNDED',
  Success = 'SUCCESS'
}

/** The type of payment */
export enum PaymentType {
  Appointment = 'APPOINTMENT',
  InstantConsultation = 'INSTANT_CONSULTATION'
}

export type Prescription = {
  __typename?: 'Prescription';
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  cancelledByUserId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  issuedAt?: Maybe<Scalars['DateTime']['output']>;
  patientEncounter: PatientEncounter;
  prescriptionItems: Array<PrescriptionItems>;
  status: PrescriptionStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type PrescriptionItemInput = {
  dosage: Scalars['String']['input'];
  durationInDays?: InputMaybe<Scalars['Int']['input']>;
  instructions: Scalars['String']['input'];
  medicationName: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
};

export type PrescriptionItems = {
  __typename?: 'PrescriptionItems';
  createdAt: Scalars['DateTime']['output'];
  dosage: Scalars['String']['output'];
  durationInDays?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  instructions: Scalars['String']['output'];
  medicationName: Scalars['String']['output'];
  prescription: Prescription;
  quantity: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** The status of a prescription */
export enum PrescriptionStatus {
  Cancelled = 'CANCELLED',
  Draft = 'DRAFT',
  Issued = 'ISSUED'
}

/** The publish status of lifestyle content */
export enum PublishStatus {
  Archived = 'ARCHIVED',
  Draft = 'DRAFT',
  Published = 'PUBLISHED'
}

export type Query = {
  __typename?: 'Query';
  appointment: Appointment;
  appointments: AppointmentPaginated;
  consultationHistory: Array<Appointment>;
  getActiveFaqItems: Array<FaqItem>;
  getAllBadges: Array<BadgeDefinition>;
  getChallenge?: Maybe<Challenge>;
  getChallengeLeaderboard: Scalars['JSON']['output'];
  getChallenges: ChallengePaginated;
  getCommonSymptom: CommonSymptom;
  getCommonSymptoms: Array<CommonSymptom>;
  getConsultationJoinUrl: Scalars['String']['output'];
  getConsultationSession?: Maybe<ConsultationSession>;
  getConsultationSessionByAppointment?: Maybe<ConsultationSession>;
  getContentComments: Array<ContentComment>;
  getConversation?: Maybe<Conversation>;
  getConversationsByDoctor: Array<Conversation>;
  getConversationsByPatient: Array<Conversation>;
  getCreatorContent?: Maybe<CreatorContent>;
  getCreatorContents: CreatorContentPaginated;
  getDepartment: Department;
  getDepartments: Array<Department>;
  getDoctor: Doctor;
  getDoctorAvailabilityByWeekday: Array<DoctorAvailability>;
  getDoctorCommonSymptom: DoctorCommonSymptom;
  getDoctorDetails: Doctor;
  getDoctorReviewByAppointment?: Maybe<DoctorReview>;
  getDoctorReviews: Array<DoctorReview>;
  getDoctorTimeSlot: DoctorTimeSlot;
  getDoctors: DoctorPaginated;
  getFaqItem?: Maybe<FaqItem>;
  getLifestyleCategories: Array<LifestyleCategory>;
  getLifestyleCategory?: Maybe<LifestyleCategory>;
  getLifestyleDashboard: LifestyleDashboard;
  getMealPlan?: Maybe<MealPlan>;
  getMealPlans: MealPlanPaginated;
  getMessagesByConversation: Array<Message>;
  getMyActiveEnrollments: Array<UserProgramEnrollment>;
  getMyActiveMealPlans: Array<UserMealPlan>;
  getMyActivityLog: Array<UserActivityLog>;
  getMyBadges: Array<UserBadge>;
  getMyChallengeProgress: Array<ChallengeProgress>;
  getMyCreatorContents: CreatorContentPaginated;
  getMyLatestWeight?: Maybe<WeightRecord>;
  getMyNotifications: Array<Notification>;
  getMySavedContent: Array<SavedContent>;
  getMyUnreadNotifications: Array<Notification>;
  getMyWeightHistory: Array<WeightRecord>;
  getMyWorkoutHistory: Array<UserWorkoutCompletion>;
  getOnlineDoctors: DoctorPaginated;
  getPatientFavoriteDoctors: Array<PatientFavoriteDoctor>;
  getPatientSupportEntries: Array<PatientSupportEntry>;
  getPatientSupportEntry?: Maybe<PatientSupportEntry>;
  getPayment?: Maybe<Payment>;
  getPaymentsByAppointment: Array<Payment>;
  getSpecialties: Array<Specialty>;
  getSpecialty?: Maybe<Specialty>;
  getUser: User;
  getViewUrl: Scalars['String']['output'];
  getWalletByDoctor?: Maybe<Wallet>;
  getWalletTransactions: Array<WalletTransaction>;
  getWellnessProgram?: Maybe<WellnessProgram>;
  getWellnessPrograms: WellnessProgramPaginated;
  getWithdrawalRequestsByDoctor: Array<WithdrawalRequest>;
  getWorkout?: Maybe<Workout>;
  getWorkouts: WorkoutPaginated;
  isFollowingCreator: Scalars['Boolean']['output'];
  me?: Maybe<Patient>;
  myAppointments: Array<Appointment>;
  /** List all confirmed medical record files for the authenticated user. */
  myMedicalRecords: Array<FileEntity>;
  myPatientEncounters: Array<PatientEncounter>;
  myPatientProfile: Patient;
  myPaymentMethods: Array<PatientPaymentMethod>;
  myPayments: Array<Payment>;
  myPrescriptions: Array<Prescription>;
  patient?: Maybe<Patient>;
  patientEncounter: PatientEncounter;
  patientEncounterByAppointment?: Maybe<PatientEncounter>;
  patients: PatientPaginated;
  prescription: Prescription;
};


export type QueryAppointmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAppointmentsArgs = {
  filter?: InputMaybe<AppointmentFilterInput>;
  paginationArgs: OffsetPaginationArgs;
};


export type QueryConsultationHistoryArgs = {
  filter?: InputMaybe<ConsultationHistoryFilter>;
};


export type QueryGetChallengeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetChallengeLeaderboardArgs = {
  challengeId: Scalars['ID']['input'];
};


export type QueryGetChallengesArgs = {
  paginationArgs: OffsetPaginationArgs;
};


export type QueryGetCommonSymptomArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetConsultationJoinUrlArgs = {
  sessionId: Scalars['ID']['input'];
};


export type QueryGetConsultationSessionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetConsultationSessionByAppointmentArgs = {
  appointmentId: Scalars['ID']['input'];
};


export type QueryGetContentCommentsArgs = {
  contentId: Scalars['ID']['input'];
};


export type QueryGetConversationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetConversationsByDoctorArgs = {
  doctorId: Scalars['ID']['input'];
};


export type QueryGetConversationsByPatientArgs = {
  patientId: Scalars['ID']['input'];
};


export type QueryGetCreatorContentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetCreatorContentsArgs = {
  filter?: InputMaybe<CreatorContentFilterInput>;
  paginationArgs: OffsetPaginationArgs;
};


export type QueryGetDepartmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetDoctorAvailabilityByWeekdayArgs = {
  dayOfWeek: Scalars['Int']['input'];
};


export type QueryGetDoctorCommonSymptomArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetDoctorDetailsArgs = {
  doctorId: Scalars['ID']['input'];
};


export type QueryGetDoctorReviewByAppointmentArgs = {
  appointmentId: Scalars['ID']['input'];
};


export type QueryGetDoctorReviewsArgs = {
  doctorId: Scalars['ID']['input'];
};


export type QueryGetDoctorTimeSlotArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetDoctorsArgs = {
  filter?: InputMaybe<DoctorFilterInput>;
  paginationArgs: OffsetPaginationArgs;
};


export type QueryGetFaqItemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetLifestyleCategoriesArgs = {
  activeOnly?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryGetLifestyleCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetMealPlanArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetMealPlansArgs = {
  paginationArgs: OffsetPaginationArgs;
};


export type QueryGetMessagesByConversationArgs = {
  conversationId: Scalars['ID']['input'];
};


export type QueryGetMyChallengeProgressArgs = {
  challengeId: Scalars['ID']['input'];
};


export type QueryGetMyCreatorContentsArgs = {
  paginationArgs: OffsetPaginationArgs;
};


export type QueryGetMyNotificationsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetMyUnreadNotificationsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetOnlineDoctorsArgs = {
  filter?: InputMaybe<DoctorFilterInput>;
  paginationArgs: OffsetPaginationArgs;
};


export type QueryGetPatientFavoriteDoctorsArgs = {
  patientId: Scalars['ID']['input'];
};


export type QueryGetPatientSupportEntryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPaymentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPaymentsByAppointmentArgs = {
  appointmentId: Scalars['ID']['input'];
};


export type QueryGetSpecialtyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetViewUrlArgs = {
  filename: Scalars['String']['input'];
};


export type QueryGetWalletByDoctorArgs = {
  doctorId: Scalars['ID']['input'];
};


export type QueryGetWalletTransactionsArgs = {
  walletId: Scalars['ID']['input'];
};


export type QueryGetWellnessProgramArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetWellnessProgramsArgs = {
  paginationArgs: OffsetPaginationArgs;
};


export type QueryGetWithdrawalRequestsByDoctorArgs = {
  doctorId: Scalars['ID']['input'];
};


export type QueryGetWorkoutArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetWorkoutsArgs = {
  filter?: InputMaybe<WorkoutFilterInput>;
  paginationArgs: OffsetPaginationArgs;
};


export type QueryIsFollowingCreatorArgs = {
  doctorId: Scalars['ID']['input'];
};


export type QueryMyAppointmentsArgs = {
  statuses?: InputMaybe<Array<AppointmentStatus>>;
};


export type QueryPatientArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPatientEncounterArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPatientEncounterByAppointmentArgs = {
  appointmentId: Scalars['ID']['input'];
};


export type QueryPatientsArgs = {
  filter?: InputMaybe<PatientFilterInput>;
  paginationArgs: OffsetPaginationArgs;
};


export type QueryPrescriptionArgs = {
  id: Scalars['ID']['input'];
};

/** The type of reaction on content */
export enum ReactionType {
  Helpful = 'HELPFUL',
  Like = 'LIKE',
  Love = 'LOVE'
}

export type RequestInstantConsultationInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  paymentMethodId?: InputMaybe<Scalars['ID']['input']>;
  provider?: InputMaybe<PaymentProvider>;
  specialtyId: Scalars['ID']['input'];
  symptomId?: InputMaybe<Scalars['ID']['input']>;
};

export type RescheduleAppointmentInput = {
  appointmentId: Scalars['ID']['input'];
  newDoctorTimeSlotId: Scalars['ID']['input'];
  rescheduleReason?: InputMaybe<Scalars['String']['input']>;
};

export type RespondToDoctorReviewInput = {
  response: Scalars['String']['input'];
  reviewId: Scalars['ID']['input'];
};

export type SavedContent = {
  __typename?: 'SavedContent';
  createdAt: Scalars['DateTime']['output'];
  creatorContent: CreatorContent;
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type Specialty = {
  __typename?: 'Specialty';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  department?: Maybe<Department>;
  description?: Maybe<Scalars['String']['output']>;
  doctorSpecialties?: Maybe<Array<DoctorSpecialty>>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  challengeEvent: LifestyleEvent;
  creatorContentEvent: LifestyleEvent;
  lifestyleCategoryEvent: LifestyleEvent;
  mealPlanEvent: LifestyleEvent;
  userProgressEvent: LifestyleEvent;
  weightTrackingEvent: LifestyleEvent;
  wellnessProgramEvent: LifestyleEvent;
  workoutEvent: LifestyleEvent;
};

/** The status of a support entry */
export enum SupportStatus {
  Closed = 'CLOSED',
  InProgress = 'IN_PROGRESS',
  Open = 'OPEN',
  Resolved = 'RESOLVED'
}

/** The type of support entry */
export enum SupportType {
  Complaint = 'COMPLAINT',
  ContactUs = 'CONTACT_US',
  SupportRequest = 'SUPPORT_REQUEST'
}

export type UpdateCreatorContentInput = {
  accessLevel?: InputMaybe<AccessLevel>;
  body?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  contentType?: InputMaybe<ContentType>;
  id: Scalars['ID']['input'];
  mediaFileIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  publishStatus?: InputMaybe<PublishStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateDepartmentInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['Float']['input']>;
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

export type UpdateLifestyleCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateMealPlanInput = {
  accessLevel?: InputMaybe<AccessLevel>;
  budgetLevel?: InputMaybe<BudgetLevel>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  coverImageFileId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  durationDays?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  publishStatus?: InputMaybe<PublishStatus>;
  targetGoal?: InputMaybe<GoalType>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePatientEncounterInput = {
  appointmentId?: InputMaybe<Scalars['ID']['input']>;
  chiefComplaint?: InputMaybe<Scalars['String']['input']>;
  consultationSessionId?: InputMaybe<Scalars['ID']['input']>;
  diagnosis?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  treatmentPlan?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePatientInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  allergies?: InputMaybe<Array<Scalars['String']['input']>>;
  bloodGroup?: InputMaybe<BloodGroup>;
  chronicConditions?: InputMaybe<Array<Scalars['String']['input']>>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  currentMedications?: InputMaybe<Array<Scalars['String']['input']>>;
  emergencyContactName?: InputMaybe<Scalars['String']['input']>;
  emergencyContactPhone?: InputMaybe<Scalars['String']['input']>;
  emergencyContactRelationship?: InputMaybe<Scalars['String']['input']>;
  genotype?: InputMaybe<Genotype>;
  heightCm?: InputMaybe<Scalars['Float']['input']>;
  maritalStatus?: InputMaybe<MaritalStatus>;
  state?: InputMaybe<Scalars['String']['input']>;
  weightKg?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdatePrescriptionInput = {
  id: Scalars['ID']['input'];
  items?: InputMaybe<Array<PrescriptionItemInput>>;
};

export type UpdateSpecialtyInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  departmentId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRoles>;
};

export type UpdateWellnessProgramInput = {
  accessLevel?: InputMaybe<AccessLevel>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  coverImageFileId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  difficulty?: InputMaybe<DifficultyLevel>;
  durationWeeks?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  publishStatus?: InputMaybe<PublishStatus>;
  targetAudience?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateWorkoutInput = {
  accessLevel?: InputMaybe<AccessLevel>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  coverImageFileId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  difficulty?: InputMaybe<DifficultyLevel>;
  durationMinutes?: InputMaybe<Scalars['Int']['input']>;
  equipmentRequired?: InputMaybe<Scalars['String']['input']>;
  estimatedCalories?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  instructions?: InputMaybe<Scalars['String']['input']>;
  publishStatus?: InputMaybe<PublishStatus>;
  targetArea?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  gender?: Maybe<GenderTypes>;
  id: Scalars['ID']['output'];
  isPremium: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  loginType: LoginTypes;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  premiumExpiresAt?: Maybe<Scalars['DateTime']['output']>;
  profilePhoto?: Maybe<Scalars['String']['output']>;
  role: UserRoles;
  updatedAt: Scalars['DateTime']['output'];
};

export type UserActivityLog = {
  __typename?: 'UserActivityLog';
  activityType: ActivityType;
  completedAt: Scalars['DateTime']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  referenceId?: Maybe<Scalars['String']['output']>;
  referenceType?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type UserBadge = {
  __typename?: 'UserBadge';
  badge: BadgeDefinition;
  createdAt: Scalars['DateTime']['output'];
  earnedAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type UserMealCompletion = {
  __typename?: 'UserMealCompletion';
  completedAt: Scalars['DateTime']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  mealPlanMeal: MealPlanMeal;
  updatedAt: Scalars['DateTime']['output'];
  userMealPlan: UserMealPlan;
};

export type UserMealPlan = {
  __typename?: 'UserMealPlan';
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  mealPlan: MealPlan;
  startedAt: Scalars['DateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type UserProgramEnrollment = {
  __typename?: 'UserProgramEnrollment';
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currentDay: Scalars['Int']['output'];
  enrolledAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  program: WellnessProgram;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type UserProgramTaskProgress = {
  __typename?: 'UserProgramTaskProgress';
  completedAt: Scalars['DateTime']['output'];
  createdAt: Scalars['DateTime']['output'];
  enrollment: UserProgramEnrollment;
  id: Scalars['ID']['output'];
  task: WellnessProgramTask;
  updatedAt: Scalars['DateTime']['output'];
};

/** The Type of roles a user can have */
export enum UserRoles {
  Doctor = 'DOCTOR',
  Patient = 'PATIENT'
}

export type UserWorkoutCompletion = {
  __typename?: 'UserWorkoutCompletion';
  caloriesBurned?: Maybe<Scalars['Int']['output']>;
  completedAt: Scalars['DateTime']['output'];
  createdAt: Scalars['DateTime']['output'];
  durationMinutes?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  workout: Workout;
};

export type VerifyPaymentInput = {
  idempotencyKey?: InputMaybe<Scalars['String']['input']>;
  providerReference: Scalars['String']['input'];
};

export type Wallet = {
  __typename?: 'Wallet';
  availableBalance: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  doctor: Doctor;
  id: Scalars['ID']['output'];
  pendingBalance: Scalars['Float']['output'];
  totalEarned: Scalars['Float']['output'];
  totalWithdrawn: Scalars['Float']['output'];
  transactions?: Maybe<Array<WalletTransaction>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type WalletTransaction = {
  __typename?: 'WalletTransaction';
  amount: Scalars['Float']['output'];
  balanceAfter: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  payment?: Maybe<Payment>;
  type: WalletTransactionType;
  updatedAt: Scalars['DateTime']['output'];
  wallet: Wallet;
};

/** The type of wallet transaction */
export enum WalletTransactionType {
  Credit = 'CREDIT',
  Debit = 'DEBIT',
  Refund = 'REFUND',
  Withdrawal = 'WITHDRAWAL'
}

export type WeightProgress = {
  __typename?: 'WeightProgress';
  currentWeight?: Maybe<Scalars['Float']['output']>;
  goalWeight?: Maybe<Scalars['Float']['output']>;
  startingWeight?: Maybe<Scalars['Float']['output']>;
  totalRecords: Scalars['Int']['output'];
};

export type WeightRecord = {
  __typename?: 'WeightRecord';
  createdAt: Scalars['DateTime']['output'];
  goalWeight?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  note?: Maybe<Scalars['String']['output']>;
  recordedAt: Scalars['DateTime']['output'];
  source?: Maybe<Scalars['String']['output']>;
  unit: WeightUnit;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  weight: Scalars['Float']['output'];
};

/** Unit of weight measurement */
export enum WeightUnit {
  Kg = 'KG',
  Lb = 'LB'
}

export type WellnessProgram = {
  __typename?: 'WellnessProgram';
  accessLevel: AccessLevel;
  category?: Maybe<LifestyleCategory>;
  coverImage?: Maybe<FileEntity>;
  createdAt: Scalars['DateTime']['output'];
  days?: Maybe<Array<WellnessProgramDay>>;
  description?: Maybe<Scalars['String']['output']>;
  difficulty: DifficultyLevel;
  doctor: Doctor;
  durationWeeks: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  publishStatus: PublishStatus;
  targetAudience?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type WellnessProgramDay = {
  __typename?: 'WellnessProgramDay';
  createdAt: Scalars['DateTime']['output'];
  dayNumber: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  program: WellnessProgram;
  tasks?: Maybe<Array<WellnessProgramTask>>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type WellnessProgramPaginated = {
  __typename?: 'WellnessProgramPaginated';
  items?: Maybe<Array<WellnessProgram>>;
  metaData?: Maybe<Scalars['JSON']['output']>;
  pageInfo?: Maybe<OffsetPageInfo>;
};

export type WellnessProgramTask = {
  __typename?: 'WellnessProgramTask';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  programDay: WellnessProgramDay;
  relatedMealPlan?: Maybe<MealPlan>;
  relatedWorkout?: Maybe<Workout>;
  sortOrder: Scalars['Int']['output'];
  taskType?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type WithdrawalRequest = {
  __typename?: 'WithdrawalRequest';
  amount: Scalars['Float']['output'];
  bankAccountName: Scalars['String']['output'];
  bankAccountNumber: Scalars['String']['output'];
  bankName: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  doctor: Doctor;
  id: Scalars['ID']['output'];
  processedAt?: Maybe<Scalars['DateTime']['output']>;
  processedByUserId?: Maybe<Scalars['String']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  status: WithdrawalStatus;
  updatedAt: Scalars['DateTime']['output'];
};

/** The status of a withdrawal request */
export enum WithdrawalStatus {
  Approved = 'APPROVED',
  Paid = 'PAID',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type Workout = {
  __typename?: 'Workout';
  accessLevel: AccessLevel;
  category?: Maybe<LifestyleCategory>;
  coverImage?: Maybe<FileEntity>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  difficulty: DifficultyLevel;
  doctor: Doctor;
  durationMinutes: Scalars['Int']['output'];
  equipmentRequired?: Maybe<Scalars['String']['output']>;
  estimatedCalories?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  instructions?: Maybe<Scalars['String']['output']>;
  publishStatus: PublishStatus;
  targetArea?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type WorkoutFilterInput = {
  accessLevel?: InputMaybe<AccessLevel>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  difficulty?: InputMaybe<DifficultyLevel>;
  query?: InputMaybe<Scalars['String']['input']>;
};

export type WorkoutPaginated = {
  __typename?: 'WorkoutPaginated';
  items?: Maybe<Array<Workout>>;
  metaData?: Maybe<Scalars['JSON']['output']>;
  pageInfo?: Maybe<OffsetPageInfo>;
};

export type BookAppointmentMutationVariables = Exact<{
  input: BookAppointmentInput;
}>;


export type BookAppointmentMutation = { __typename?: 'Mutation', bookAppointment: { __typename?: 'Appointment', id: string, status: AppointmentStatus, type: AppointmentType, startDate: any, endDate: any, notes?: string | null, paymentStatus: AppointmentPaymentStatus, isRescheduled: boolean, createdAt: any, updatedAt: any, doctor: { __typename?: 'Doctor', id: string, medicalSchool?: string | null, level?: DoctorLevel | null, user: { __typename?: 'User', firstName: string, lastName: string, profilePhoto?: string | null }, doctorsSpecialties?: Array<{ __typename?: 'DoctorSpecialty', specialty: { __typename?: 'Specialty', name: string } }> | null }, doctorTimeSlot?: { __typename?: 'DoctorTimeSlot', id: string, startDateTime: any, endDateTime: any } | null } };

export type RescheduleAppointmentMutationVariables = Exact<{
  input: RescheduleAppointmentInput;
}>;


export type RescheduleAppointmentMutation = { __typename?: 'Mutation', rescheduleAppointment: { __typename?: 'Appointment', id: string, status: AppointmentStatus, startDate: any, endDate: any, isRescheduled: boolean, rescheduleReason?: string | null, doctorTimeSlot?: { __typename?: 'DoctorTimeSlot', id: string, startDateTime: any, endDateTime: any } | null } };

export type GetAppointmentsQueryVariables = Exact<{
  filter?: InputMaybe<AppointmentFilterInput>;
  paginationArgs: OffsetPaginationArgs;
}>;


export type GetAppointmentsQuery = { __typename?: 'Query', appointments: { __typename?: 'AppointmentPaginated', metaData?: any | null, pageInfo?: { __typename?: 'OffsetPageInfo', currentPage: number, itemCount: number, itemsPerPage: number, totalItems: number, totalPages: number } | null, items?: Array<{ __typename?: 'Appointment', id: string, status: AppointmentStatus, type: AppointmentType, startDate: any, endDate: any, createdAt: any, updatedAt: any, isRescheduled: boolean, paymentStatus: AppointmentPaymentStatus, notes?: string | null, patient: { __typename?: 'Patient', id: string, user: { __typename?: 'User', firstName: string, lastName: string, profilePhoto?: string | null } }, doctor: { __typename?: 'Doctor', id: string, user: { __typename?: 'User', firstName: string, lastName: string } } }> | null } };

export type MyAppointmentsQueryVariables = Exact<{
  statuses?: InputMaybe<Array<AppointmentStatus> | AppointmentStatus>;
}>;


export type MyAppointmentsQuery = { __typename?: 'Query', myAppointments: Array<{ __typename?: 'Appointment', id: string, status: AppointmentStatus, type: AppointmentType, startDate: any, endDate: any, createdAt: any, updatedAt: any, isRescheduled: boolean, paymentStatus: AppointmentPaymentStatus, notes?: string | null, doctor: { __typename?: 'Doctor', id: string, medicalSchool?: string | null, level?: DoctorLevel | null, user: { __typename?: 'User', firstName: string, lastName: string, profilePhoto?: string | null }, doctorsSpecialties?: Array<{ __typename?: 'DoctorSpecialty', specialty: { __typename?: 'Specialty', name: string } }> | null } }> };

export type GetDoctorAvailableTimeSlotsQueryVariables = Exact<{
  doctorId: Scalars['ID']['input'];
}>;


export type GetDoctorAvailableTimeSlotsQuery = { __typename?: 'Query', getDoctorDetails: { __typename?: 'Doctor', id: string, doctorTimeSlots?: Array<{ __typename?: 'DoctorTimeSlot', id: string, startDateTime: any, endDateTime: any, slotDate: string, status: DoctorTimeSlotStatus }> | null } };

export type LoginMutationVariables = Exact<{
  loginInput: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginOutput', accessToken: string, refreshToken: string } };

export type SignUpMutationVariables = Exact<{
  signUpInput: CreateUserInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'LoginOutput', accessToken: string, refreshToken: string } };

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

export type VerifyResetOtpMutationVariables = Exact<{
  email: Scalars['String']['input'];
  otp: Scalars['String']['input'];
}>;


export type VerifyResetOtpMutation = { __typename?: 'Mutation', verifyResetOtp: string };

export type RefreshAccessTokenMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshAccessTokenMutation = { __typename?: 'Mutation', refreshAccessToken: { __typename?: 'LoginOutput', accessToken: string, refreshToken: string } };

export type UpdateDoctorMutationVariables = Exact<{
  updateDoctorInput: UpdateDoctorInput;
}>;


export type UpdateDoctorMutation = { __typename?: 'Mutation', updateDoctor: { __typename?: 'Doctor', id: string } };

export type CreateDoctorAvailabilityMutationVariables = Exact<{
  createDoctorAvailabilityInput: CreateDoctorAvailabilityInput;
}>;


export type CreateDoctorAvailabilityMutation = { __typename?: 'Mutation', createDoctorAvailability: { __typename?: 'DoctorAvailability', id: string, dayOfWeek: number, startTime: string, endTime: string, timezone: string, isActive: boolean, createdAt: any, updatedAt: any } };

export type RemoveDoctorAvailabilityMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveDoctorAvailabilityMutation = { __typename?: 'Mutation', removeDoctorAvailability: string };

export type GetDoctorDetailsQueryVariables = Exact<{
  doctorId: Scalars['ID']['input'];
}>;


export type GetDoctorDetailsQuery = { __typename?: 'Query', getDoctorDetails: { __typename?: 'Doctor', averageRating: number, bio?: string | null, clinicAddress?: string | null, clinicName?: string | null, consultationFee: number, createdAt: any, graduationYear?: number | null, id: string, identificationFile?: string | null, identificationNumber?: string | null, identificationType?: string | null, instantConsultationEnabled: boolean, instantConsultationFee: number, isOnline: boolean, isVerified: boolean, level?: DoctorLevel | null, medicalCertificateFile?: string | null, medicalLicenseFile?: string | null, medicalSchool?: string | null, totalReviews: number, updatedAt: any, yearsOfExperience?: number | null, doctorsSpecialties?: Array<{ __typename?: 'DoctorSpecialty', createdAt: any, id: string, updatedAt: any, specialty: { __typename?: 'Specialty', code: string, createdAt: any, description?: string | null, id: string, imageUrl?: string | null, name: string, updatedAt: any } }> | null, user: { __typename?: 'User', firstName: string, lastName: string, profilePhoto?: string | null } } };

export type GetDoctorQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDoctorQuery = { __typename?: 'Query', getDoctor: { __typename?: 'Doctor', clinicAddress?: string | null, clinicName?: string | null, createdAt: any, graduationYear?: number | null, id: string, identificationFile?: string | null, identificationNumber?: string | null, identificationType?: string | null, level?: DoctorLevel | null, medicalCertificateFile?: string | null, medicalLicenseFile?: string | null, medicalSchool?: string | null, updatedAt: any, availability?: Array<{ __typename?: 'DoctorAvailability', id: string, dayOfWeek: number, startTime: string, endTime: string, timezone: string, isActive: boolean }> | null, doctorsSpecialties?: Array<{ __typename?: 'DoctorSpecialty', createdAt: any, id: string, updatedAt: any, specialty: { __typename?: 'Specialty', code: string, createdAt: any, description?: string | null, id: string, imageUrl?: string | null, name: string, updatedAt: any } }> | null, user: { __typename?: 'User', firstName: string, lastName: string } } };

export type GetDoctorsQueryVariables = Exact<{
  filter?: InputMaybe<DoctorFilterInput>;
  paginationArgs: OffsetPaginationArgs;
}>;


export type GetDoctorsQuery = { __typename?: 'Query', getDoctors: { __typename?: 'DoctorPaginated', pageInfo?: { __typename?: 'OffsetPageInfo', currentPage: number, itemCount: number, itemsPerPage: number, totalItems: number, totalPages: number } | null, items?: Array<{ __typename?: 'Doctor', id: string, averageRating: number, totalReviews: number, consultationFee: number, instantConsultationEnabled: boolean, isOnline: boolean, level?: DoctorLevel | null, medicalSchool?: string | null, user: { __typename?: 'User', firstName: string, lastName: string, profilePhoto?: string | null }, doctorsSpecialties?: Array<{ __typename?: 'DoctorSpecialty', id: string, specialty: { __typename?: 'Specialty', id: string, name: string } }> | null }> | null } };

export type GetDepartmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDepartmentsQuery = { __typename?: 'Query', getDepartments: Array<{ __typename?: 'Department', id: string, code: string, name: string, imageUrl?: string | null, sortOrder: number, specialties?: Array<{ __typename?: 'Specialty', id: string, name: string }> | null }> };

export type GetSpecialtiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSpecialtiesQuery = { __typename?: 'Query', getSpecialties: Array<{ __typename?: 'Specialty', code: string, createdAt: any, description?: string | null, id: string, imageUrl?: string | null, name: string, updatedAt: any }> };

export type GetCommonSymptomsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCommonSymptomsQuery = { __typename?: 'Query', getCommonSymptoms: Array<{ __typename?: 'CommonSymptom', id: string, name: string, imageUrl?: string | null, isActive: boolean, createdAt: any, updatedAt: any }> };

export type GetCommonSymptomQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCommonSymptomQuery = { __typename?: 'Query', getCommonSymptom: { __typename?: 'CommonSymptom', id: string, name: string, imageUrl?: string | null, isActive: boolean, createdAt: any, updatedAt: any, doctorCommonSymptoms?: Array<{ __typename?: 'DoctorCommonSymptom', id: string, doctor: { __typename?: 'Doctor', id: string, averageRating: number, totalReviews: number, consultationFee: number, instantConsultationEnabled: boolean, isOnline: boolean, level?: DoctorLevel | null, medicalSchool?: string | null, user: { __typename?: 'User', firstName: string, lastName: string, profilePhoto?: string | null }, doctorsSpecialties?: Array<{ __typename?: 'DoctorSpecialty', id: string, specialty: { __typename?: 'Specialty', id: string, name: string } }> | null } }> | null } };

export type GetPatientsQueryVariables = Exact<{
  filter?: InputMaybe<PatientFilterInput>;
  paginationArgs: OffsetPaginationArgs;
}>;


export type GetPatientsQuery = { __typename?: 'Query', patients: { __typename?: 'PatientPaginated', items?: Array<{ __typename?: 'Patient', id: string, createdAt: any, updatedAt: any, user: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, profilePhoto?: string | null, dateOfBirth?: any | null, gender?: GenderTypes | null } }> | null, pageInfo?: { __typename?: 'OffsetPageInfo', currentPage: number, itemCount: number, itemsPerPage: number, totalItems: number, totalPages: number } | null } };

export type ConsultationHistoryQueryVariables = Exact<{
  filter?: InputMaybe<ConsultationHistoryFilter>;
}>;


export type ConsultationHistoryQuery = { __typename?: 'Query', consultationHistory: Array<{ __typename?: 'Appointment', id: string, status: AppointmentStatus, type: AppointmentType, startDate: any, endDate: any, notes?: string | null, paymentStatus: AppointmentPaymentStatus, patient: { __typename?: 'Patient', id: string, user: { __typename?: 'User', firstName: string, lastName: string, profilePhoto?: string | null } }, doctor: { __typename?: 'Doctor', id: string, medicalSchool?: string | null, level?: DoctorLevel | null, user: { __typename?: 'User', firstName: string, lastName: string, profilePhoto?: string | null }, doctorsSpecialties?: Array<{ __typename?: 'DoctorSpecialty', specialty: { __typename?: 'Specialty', name: string } }> | null }, consultationSession?: { __typename?: 'ConsultationSession', id: string, status: ConsultationSessionStatus, type: ConsultationSessionType } | null }> };

export type GetWalletByDoctorQueryVariables = Exact<{
  doctorId: Scalars['ID']['input'];
}>;


export type GetWalletByDoctorQuery = { __typename?: 'Query', getWalletByDoctor?: { __typename?: 'Wallet', id: string, availableBalance: number, pendingBalance: number, totalEarned: number, totalWithdrawn: number, createdAt: any, updatedAt: any, transactions?: Array<{ __typename?: 'WalletTransaction', id: string, amount: number, description?: string | null, type: WalletTransactionType, createdAt: any }> | null } | null };

export type GetDoctorReviewsQueryVariables = Exact<{
  doctorId: Scalars['ID']['input'];
}>;


export type GetDoctorReviewsQuery = { __typename?: 'Query', getDoctorReviews: Array<{ __typename?: 'DoctorReview', id: string, rating: number, text?: string | null, doctorResponse?: string | null, createdAt: any, updatedAt: any, patient: { __typename?: 'Patient', id: string, user: { __typename?: 'User', firstName: string, lastName: string, profilePhoto?: string | null } }, appointment: { __typename?: 'Appointment', id: string, startDate: any } }> };

export type GetActiveFaqItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveFaqItemsQuery = { __typename?: 'Query', getActiveFaqItems: Array<{ __typename?: 'FaqItem', id: string, question: string, answer: string, category: FaqCategory, isActive: boolean, sortOrder: number, createdAt: any, updatedAt: any }> };

export type InitiateUploadMutationVariables = Exact<{
  input: InitiateUploadInput;
}>;


export type InitiateUploadMutation = { __typename?: 'Mutation', initiateUpload: { __typename?: 'InitiateUploadOutput', presignedUrl: string, key: string, expiresAt: any } };

export type ConfirmUploadMutationVariables = Exact<{
  key: Scalars['String']['input'];
}>;


export type ConfirmUploadMutation = { __typename?: 'Mutation', confirmUpload: { __typename?: 'FileEntity', id: string, key: string, originalName?: string | null, mimeType: string, size?: number | null, type: FileTypeEnum, status: FileStatusEnum, createdAt: any } };

export type UpdateUserMutationVariables = Exact<{
  updateUserInput: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, dateOfBirth?: any | null, gender?: GenderTypes | null, phoneNumber?: string | null, profilePhoto?: string | null, role: UserRoles, loginType: LoginTypes, isPremium: boolean, premiumExpiresAt?: any | null, createdAt: any, updatedAt: any } };

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', getUser: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, dateOfBirth?: any | null, gender?: GenderTypes | null, loginType: LoginTypes, phoneNumber?: string | null, profilePhoto?: string | null, role: UserRoles, createdAt: any, updatedAt: any } };


export const BookAppointmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BookAppointment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BookAppointmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookAppointment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"isRescheduled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"doctor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"medicalSchool"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhoto"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doctorsSpecialties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"specialty"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"doctorTimeSlot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"endDateTime"}}]}}]}}]}}]} as unknown as DocumentNode<BookAppointmentMutation, BookAppointmentMutationVariables>;
export const RescheduleAppointmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RescheduleAppointment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RescheduleAppointmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rescheduleAppointment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"isRescheduled"}},{"kind":"Field","name":{"kind":"Name","value":"rescheduleReason"}},{"kind":"Field","name":{"kind":"Name","value":"doctorTimeSlot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"endDateTime"}}]}}]}}]}}]} as unknown as DocumentNode<RescheduleAppointmentMutation, RescheduleAppointmentMutationVariables>;
export const GetAppointmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAppointments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AppointmentFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationArgs"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appointments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"paginationArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metaData"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isRescheduled"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhoto"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"doctor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAppointmentsQuery, GetAppointmentsQueryVariables>;
export const MyAppointmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyAppointments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"statuses"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AppointmentStatus"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myAppointments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"statuses"},"value":{"kind":"Variable","name":{"kind":"Name","value":"statuses"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isRescheduled"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"doctor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"medicalSchool"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhoto"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doctorsSpecialties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"specialty"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<MyAppointmentsQuery, MyAppointmentsQueryVariables>;
export const GetDoctorAvailableTimeSlotsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDoctorAvailableTimeSlots"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"doctorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDoctorDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"doctorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"doctorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"doctorTimeSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"endDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"slotDate"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetDoctorAvailableTimeSlotsQuery, GetDoctorAvailableTimeSlotsQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"loginInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"loginInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"loginInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"signUpInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"signUpInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"signUpInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const ForgotPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ForgotPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"forgotPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const ChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"oldPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}}}]}]}}]} as unknown as DocumentNode<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const VerifyResetOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyResetOtp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyResetOtp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"otp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otp"}}}]}]}}]} as unknown as DocumentNode<VerifyResetOtpMutation, VerifyResetOtpMutationVariables>;
export const RefreshAccessTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshAccessToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshAccessToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RefreshAccessTokenMutation, RefreshAccessTokenMutationVariables>;
export const UpdateDoctorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDoctor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateDoctorInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDoctorInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDoctor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateDoctorInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateDoctorInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateDoctorMutation, UpdateDoctorMutationVariables>;
export const CreateDoctorAvailabilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDoctorAvailability"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createDoctorAvailabilityInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDoctorAvailabilityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDoctorAvailability"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createDoctorAvailabilityInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createDoctorAvailabilityInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dayOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateDoctorAvailabilityMutation, CreateDoctorAvailabilityMutationVariables>;
export const RemoveDoctorAvailabilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveDoctorAvailability"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeDoctorAvailability"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveDoctorAvailabilityMutation, RemoveDoctorAvailabilityMutationVariables>;
export const GetDoctorDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDoctorDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"doctorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDoctorDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"doctorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"doctorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"clinicAddress"}},{"kind":"Field","name":{"kind":"Name","value":"clinicName"}},{"kind":"Field","name":{"kind":"Name","value":"consultationFee"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"doctorsSpecialties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"specialty"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identificationFile"}},{"kind":"Field","name":{"kind":"Name","value":"identificationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"identificationType"}},{"kind":"Field","name":{"kind":"Name","value":"instantConsultationEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"instantConsultationFee"}},{"kind":"Field","name":{"kind":"Name","value":"isOnline"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"medicalCertificateFile"}},{"kind":"Field","name":{"kind":"Name","value":"medicalLicenseFile"}},{"kind":"Field","name":{"kind":"Name","value":"medicalSchool"}},{"kind":"Field","name":{"kind":"Name","value":"totalReviews"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"yearsOfExperience"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhoto"}}]}}]}}]}}]} as unknown as DocumentNode<GetDoctorDetailsQuery, GetDoctorDetailsQueryVariables>;
export const GetDoctorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDoctor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDoctor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clinicAddress"}},{"kind":"Field","name":{"kind":"Name","value":"clinicName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"availability"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dayOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doctorsSpecialties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"specialty"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identificationFile"}},{"kind":"Field","name":{"kind":"Name","value":"identificationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"identificationType"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"medicalCertificateFile"}},{"kind":"Field","name":{"kind":"Name","value":"medicalLicenseFile"}},{"kind":"Field","name":{"kind":"Name","value":"medicalSchool"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]} as unknown as DocumentNode<GetDoctorQuery, GetDoctorQueryVariables>;
export const GetDoctorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDoctors"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DoctorFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationArgs"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDoctors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"paginationArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"Field","name":{"kind":"Name","value":"totalReviews"}},{"kind":"Field","name":{"kind":"Name","value":"consultationFee"}},{"kind":"Field","name":{"kind":"Name","value":"instantConsultationEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"isOnline"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"medicalSchool"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhoto"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doctorsSpecialties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"specialty"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetDoctorsQuery, GetDoctorsQueryVariables>;
export const GetDepartmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDepartments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDepartments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"specialties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetDepartmentsQuery, GetDepartmentsQueryVariables>;
export const GetSpecialtiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSpecialties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSpecialties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetSpecialtiesQuery, GetSpecialtiesQueryVariables>;
export const GetCommonSymptomsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCommonSymptoms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCommonSymptoms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetCommonSymptomsQuery, GetCommonSymptomsQueryVariables>;
export const GetCommonSymptomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCommonSymptom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCommonSymptom"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"doctorCommonSymptoms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"doctor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"Field","name":{"kind":"Name","value":"totalReviews"}},{"kind":"Field","name":{"kind":"Name","value":"consultationFee"}},{"kind":"Field","name":{"kind":"Name","value":"instantConsultationEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"isOnline"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"medicalSchool"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhoto"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doctorsSpecialties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"specialty"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCommonSymptomQuery, GetCommonSymptomQueryVariables>;
export const GetPatientsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPatients"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PatientFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationArgs"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"paginationArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhoto"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}}]}}]}}]}}]} as unknown as DocumentNode<GetPatientsQuery, GetPatientsQueryVariables>;
export const ConsultationHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ConsultationHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ConsultationHistoryFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"consultationHistory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhoto"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"doctor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"medicalSchool"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhoto"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doctorsSpecialties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"specialty"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"consultationSession"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<ConsultationHistoryQuery, ConsultationHistoryQueryVariables>;
export const GetWalletByDoctorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWalletByDoctor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"doctorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWalletByDoctor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"doctorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"doctorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"availableBalance"}},{"kind":"Field","name":{"kind":"Name","value":"pendingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"totalEarned"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"transactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetWalletByDoctorQuery, GetWalletByDoctorQueryVariables>;
export const GetDoctorReviewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDoctorReviews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"doctorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDoctorReviews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"doctorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"doctorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"doctorResponse"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhoto"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"appointment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}}]}}]}}]}}]} as unknown as DocumentNode<GetDoctorReviewsQuery, GetDoctorReviewsQueryVariables>;
export const GetActiveFaqItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActiveFaqItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getActiveFaqItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetActiveFaqItemsQuery, GetActiveFaqItemsQueryVariables>;
export const InitiateUploadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InitiateUpload"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InitiateUploadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"initiateUpload"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"presignedUrl"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]} as unknown as DocumentNode<InitiateUploadMutation, InitiateUploadMutationVariables>;
export const ConfirmUploadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmUpload"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmUpload"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"originalName"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<ConfirmUploadMutation, ConfirmUploadMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateUserInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateUserInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateUserInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhoto"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"loginType"}},{"kind":"Field","name":{"kind":"Name","value":"isPremium"}},{"kind":"Field","name":{"kind":"Name","value":"premiumExpiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"loginType"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhoto"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;