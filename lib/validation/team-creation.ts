import { z } from 'zod';

export const teamDetailsSchema = z.object({
  name: z.string()
    .min(1, 'Team name is required')
    .min(3, 'Team name must be at least 3 characters')
    .max(50, 'Team name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Team name can only contain letters, numbers, spaces, hyphens, and underscores'),
  logo: z.string().nullable().optional(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  type: z.enum(['Casual', 'Competitive']).default('Casual'),
  homeCourt: z.string().nullable().optional(),
  homeCourtId: z.string().nullable().optional(),
});

export const teamPrivacySchema = z.object({
  isPublic: z.boolean().default(true),
  requiresApproval: z.boolean().default(false),
  minimumPlayers: z.number()
    .min(2, 'Minimum players must be at least 2')
    .max(20, 'Maximum players cannot exceed 20')
    .nullable()
    .optional(),
});

export const invitedMemberSchema = z.object({
  id: z.string(),
  display_name: z.string(),
  avatar_url: z.string().nullable(),
  email: z.string().email(),
});

export const teamCreationSchema = z.object({
  teamDetails: teamDetailsSchema,
  invitedMembers: z.array(invitedMemberSchema).default([]),
  privacy: teamPrivacySchema,
});

export type TeamDetailsInput = z.infer<typeof teamDetailsSchema>;
export type TeamPrivacyInput = z.infer<typeof teamPrivacySchema>;
export type InvitedMemberInput = z.infer<typeof invitedMemberSchema>;
export type TeamCreationInput = z.infer<typeof teamCreationSchema>;

// Validation helpers
export const validateTeamDetails = (data: any) => {
  try {
    return { success: true, data: teamDetailsSchema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return { success: false, errors: [{ field: 'general', message: 'Unknown validation error' }] };
  }
};

export const validateTeamCreation = (data: any) => {
  try {
    return { success: true, data: teamCreationSchema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return { success: false, errors: [{ field: 'general', message: 'Unknown validation error' }] };
  }
};
