// import * as y from 'yup'
import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.email('please enter a valid email').min(1, 'required'),
  password: z.string().min(1, 'required'),
});
export type LoginFormType = z.infer<typeof loginFormSchema>;

export const signupFormSchema = z.object({
  firstName: z.string().min(1, 'required'),
  lastName: z.string().min(1, 'required'),
  email: z.email('please enter a valid email').min(1, 'required'),
  password: z.string().min(1, 'required'),
});
export type SignupFormType = z.infer<typeof signupFormSchema>;

export const changePasswordFormSchema = z.object({
  oldPassword: z.string().min(1, 'required'),
  newPassword: z.string().min(1, 'required'),
});
export type ChangePasswordFormType = z.infer<typeof changePasswordFormSchema>;
