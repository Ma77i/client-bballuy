-- Storage policies for team_logos bucket
-- These policies allow authenticated users to upload/manage images in their own folders

-- Create the team_logos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team_logos',
  'team_logos', 
  false, -- private bucket
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Policy 1: Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload to their own folder" ON storage.objects
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'team_logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Allow authenticated users to view their own files
CREATE POLICY "Users can view their own files" ON storage.objects
FOR SELECT 
TO authenticated
USING (
  bucket_id = 'team_logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: Allow authenticated users to update their own files
CREATE POLICY "Users can update their own files" ON storage.objects
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'team_logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'team_logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: Allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'team_logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Alternative: More permissive policy for development (uncomment if needed)
-- WARNING: This allows any authenticated user to access any file in the bucket
/*
CREATE POLICY "Allow all authenticated users full access" ON storage.objects
FOR ALL 
TO authenticated
USING (bucket_id = 'team_logos')
WITH CHECK (bucket_id = 'team_logos');
*/
