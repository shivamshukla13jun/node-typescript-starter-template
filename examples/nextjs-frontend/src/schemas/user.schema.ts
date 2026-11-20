import { z } from 'zod';
import { ROLES } from './auth.schema';

// Mirrors src/microservices/user-service/user.validate.ts

export const createUserSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must be at most 50 characters long'),
  email: z
    .string()
    .email('Email must be a valid email address')
    .max(100, 'Email must be at most 100 characters long'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z.enum(ROLES),
  avatar: z.any().optional(),
});
export type CreateUserValues = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  email: z.string().email().max(100).optional(),
  password: z.string().min(8).optional(),
  role: z.enum(ROLES).optional(),
  avatar: z.any().optional(),
});
export type UpdateUserValues = z.infer<typeof updateUserSchema>;

export const searchUsersSchema = z.object({
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});
