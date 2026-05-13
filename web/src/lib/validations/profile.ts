import { z } from 'zod'

export const updateDisplayNameSchema = z.object({
  displayName: z.string()
    .transform(val => val.trim())
    .pipe(
      z.string()
        .min(3, 'Display name must be at least 3 characters')
        .max(50, 'Display name must not exceed 50 characters')
        .regex(/^[\p{L}\p{N}_\s'-]+$/u, 'Display name can only contain letters, numbers, spaces, hyphens, underscores, and apostrophes')
    ),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
})

export const updateDisplayNameApiSchema = z.object({
  displayName: z.string()
    .transform(val => val.trim())
    .pipe(
      z.string()
        .min(3, 'Display name must be at least 3 characters')
        .max(50, 'Display name must not exceed 50 characters')
        .regex(/^[\p{L}\p{N}_\s'-]+$/u, 'Display name can only contain letters, numbers, spaces, hyphens, underscores, and apostrophes')
    ),
})

export const changePasswordApiSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
})

export type UpdateDisplayNameFormData = z.infer<typeof updateDisplayNameSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>