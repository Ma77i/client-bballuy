//lib/backend/storage.ts
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/backend/supabase';

export async function pickImageFromGallery(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') throw new Error('Gallery permission denied');

  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.9,
  });
  if (res.canceled || !res.assets?.length) return null;
  return res.assets[0].uri;
}

export async function takePhoto(): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') throw new Error('Camera permission denied');

  const res = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.9,
  });
  if (res.canceled || !res.assets?.length) return null;
  return res.assets[0].uri;
}

export async function uploadAvatar(userId: string, localUri: string) {
  // 1) Blob real para MIME correcto
  const res = await fetch(localUri);
  const blob = await res.blob();

  // 2) Extensión desde MIME (no desde la URI)
  const mime = blob.type || 'image/jpeg';
  const ext = (mime.split('/')[1]?.toLowerCase() || 'jpg').replace('jpeg', 'jpg');

  // 3) Path definitivo
  const path = `${userId}/${Date.now()}.${ext}`;

  // 4) Upload al bucket 'avatars'
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(path, blob, { cacheControl: '3600', upsert: false, contentType: mime });

  if (error) throw error;

  // 👉 Guardamos SIEMPRE "bucket/key"
  return `avatars/${data.path}`;
}

export function parseStoragePath(storagePath?: string | null) {
  if (!storagePath) return null;
  const [bucket, ...rest] = storagePath.split('/');
  if (!bucket || rest.length === 0) return null;
  return { bucket, key: rest.join('/') };
}

export async function getSignedUrl(path?: string | null, ttl = 3600): Promise<string | null> {
  try {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;

    // Soportar "bucket/key" o solo "key"
    const parsed = parseStoragePath(path);
    const bucket = parsed?.bucket ?? 'avatars'; // fallback avatars si vino solo la key
    const key = parsed?.key ?? path;

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(key, ttl);

    if (error) {
      console.error('createSignedUrl error:', error);
      return null;
    }
    return data?.signedUrl ?? null;
  } catch (e) {
    console.error('getSignedUrl unexpected error:', e);
    return null;
  }
}

export async function getSignedAvatarUrl(rawPath: string | null, expiresIn = 60 * 60) {
  const path = normalizeStoragePath(rawPath);
  if (!path) return null;
  const { data, error } = await supabase.storage
    .from('avatars')
    .createSignedUrl(path, expiresIn);
  if (error) {
    console.warn('createSignedUrl error', { rawPath, normalized: path, error });
    return null;
  }
  return data?.signedUrl ?? null;
}

export async function uploadImageToBucket(bucket: 'avatars'|'team_logos', userId: string, localUri: string) {
  const res = await fetch(localUri);
  const blob = await res.blob();
  const mime = blob.type || 'image/jpeg';
  const ext = mime.split('/')[1]?.replace('jpeg','jpg') || 'jpg';
  const path = `${userId}/${Date.now()}.${ext}`;
  const { data, error } = await supabase.storage.from(bucket).upload(path, blob, { contentType: mime, upsert: true });
  if (error) throw error;
  return data.path; // siempre path, nunca URL firmada
}

function normalizeStoragePath(p: string | null | undefined) {
  if (!p) return null;
  // si ya es URL completa, devolver tal cual
  if (/^https?:\/\//i.test(p)) return p;
  // quitar prefijo de bucket si viene incluido
  return p.replace(/^avatars\//i, '').replace(/^\/+/, '');
}

