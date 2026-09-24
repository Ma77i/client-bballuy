import { processLock } from '@supabase/supabase-js';

export type SessionStorage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

// Shared by the native client and local integration tests. Web uses SDK storage.
export function sessionOptions(storage?: SessionStorage) {
  return { storage, persistSession: true, autoRefreshToken: true,
    detectSessionInUrl: false, lock: processLock };
}
