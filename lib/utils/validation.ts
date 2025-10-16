import { z } from 'zod';

const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', '1234567',
  'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
  'ashley', 'bailey', 'passw0rd', 'shadow', '123123', '654321', 'superman',
  'qazwsx', 'michael', 'football', 'password1', 'welcome', 'jesus', 'ninja',
];

export const passwordSchema = z
  .string()
  .min(10, 'Password must be at least 10 characters')
  .refine(
    (password) => !COMMON_PASSWORDS.includes(password.toLowerCase()),
    'This password is too common. Please choose a stronger password.'
  )
  .refine(
    (password) => /[A-Z]/.test(password),
    'Password must contain at least one uppercase letter'
  )
  .refine(
    (password) => /[a-z]/.test(password),
    'Password must contain at least one lowercase letter'
  )
  .refine(
    (password) => /[0-9]/.test(password),
    'Password must contain at least one number'
  );

export const emailSchema = z.string().email('Invalid email address');

export const displayNameSchema = z
  .string()
  .min(2, 'Display name must be at least 2 characters')
  .max(50, 'Display name must be less than 50 characters')
  .regex(/^[a-zA-Z0-9_\s]+$/, 'Display name can only contain letters, numbers, underscores, and spaces');

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const result = passwordSchema.safeParse(password);
  if (result.success) {
    return { valid: true, errors: [] };
  }
  return {
    valid: false,
    errors: result.error.issues.map((e: { message: string }) => e.message),
  };
}

export function validateEmail(email: string): { valid: boolean; error?: string } {
  const result = emailSchema.safeParse(email);
  if (result.success) {
    return { valid: true };
  }
  return {
    valid: false,
    error: result.error.issues[0]?.message || 'Invalid email',
  };
}

export function validateDisplayName(name: string): { valid: boolean; error?: string } {
  const result = displayNameSchema.safeParse(name);
  if (result.success) {
    return { valid: true };
  }
  return {
    valid: false,
    error: result.error.issues[0]?.message || 'Invalid display name',
  };
}

export function calculatePasswordStrength(password: string): {
  score: number;
  label: 'weak' | 'fair' | 'good' | 'strong';
} {
  let score = 0;
  
  if (password.length >= 10) score += 1;
  if (password.length >= 14) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  if (!COMMON_PASSWORDS.includes(password.toLowerCase())) score += 1;

  const labels: ('weak' | 'fair' | 'good' | 'strong')[] = ['weak', 'fair', 'good', 'strong'];
  const labelIndex = Math.min(Math.floor(score / 2), 3);
  
  return {
    score: Math.min(score, 7),
    label: labels[labelIndex] as 'weak' | 'fair' | 'good' | 'strong',
  };
}
