import { supabase } from '@/lib/backend/supabase';

/**
 * Get a signed URL from a storage path
 * @param path - The storage path (e.g., "team_logos/user_id/timestamp.jpg")
 * @param expiresIn - TTL in seconds (default: 3600 = 1 hour)
 * @returns Promise<string> - The signed URL
 */
export const getSignedUrlFromPath = async (path: string, expiresIn: number = 3600): Promise<string> => {
  // Remove bucket prefix if present
  const relative = path.replace(/^team_logos\//, '');
  
  const { data, error } = await supabase.storage
    .from('team_logos')
    .createSignedUrl(relative, expiresIn);
    
  if (error || !data) {
    throw new Error(`Failed to generate signed URL: ${error?.message || 'Unknown error'}`);
  }
  
  return data.signedUrl;
};

/**
 * Delete an image from storage
 * @param path - The storage path to delete
 */
export const deleteImageFromStorage = async (path: string): Promise<void> => {
  if (!path || !path.startsWith('team_logos/')) return;
  
  const relative = path.replace('team_logos/', '');
  
  const { error } = await supabase.storage
    .from('team_logos')
    .remove([relative]);
    
  if (error) {
    console.warn('Failed to delete image from storage:', error);
    // Don't throw - this is not critical
  }
};

/**
 * Validate image file
 * @param file - The file to validate
 * @returns boolean - Whether the file is valid
 */
export const validateImageFile = (file: File | Blob): { valid: boolean; error?: string } => {
  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  // Check if it's an image
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  return { valid: true };
};
