import { z } from 'zod';

// Mirrors the backend zod schemas — keep in sync with
// src/microservices/auth-service/auth.validation.ts and user.validate.ts

export const ROLES = ['admin', 'superadmin'] as const;

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

// ---- multi-step registration ----
export const registerStep1Schema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be at most 50 characters'),
  email: z
    .string()
    .email('Email must be a valid email address')
    .max(100, 'Email must be at most 100 characters'),
});

export const registerStep2Schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    role: z.enum(ROLES),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export const registerStep3Schema = z.object({
  avatar: z.any().optional(),
});

export const registerSchema = registerStep1Schema
  .merge(registerStep2Schema.innerType().omit({ confirmPassword: true }))
  .merge(registerStep3Schema);

export type RegisterValues = z.infer<typeof registerSchema> & {
  avatar?: File;
};
