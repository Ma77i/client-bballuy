import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { BackendProvider, Session, AuthUser } from './types';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

function mapSupabaseUser(user: any): AuthUser | null {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    app_metadata: user.app_metadata || {},
    user_metadata: user.user_metadata || {},
  };
}

function mapSupabaseSession(session: any): Session | null {
  if (!session) return null;
  return {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    user: mapSupabaseUser(session.user)!,
  };
}

export const supabaseProvider: BackendProvider = {
  auth: {
    async signUp(email: string, password: string, metadata?: Record<string, unknown>) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      return {
        user: mapSupabaseUser(data.user),
        session: mapSupabaseSession(data.session),
        error: error as Error | null,
      };
    },

    async signIn(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return {
        user: mapSupabaseUser(data.user),
        session: mapSupabaseSession(data.session),
        error: error as Error | null,
      };
    },

    async signInWithOAuth(provider: 'google' | 'apple' | 'facebook') {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: Constants.expoConfig?.scheme ? `${Constants.expoConfig.scheme}://auth/callback` : undefined,
        },
      });
      return { error: error as Error | null };
    },

    async signOut() {
      const { error } = await supabase.auth.signOut();
      return { error: error as Error | null };
    },

    async getSession() {
      const { data, error } = await supabase.auth.getSession();
      return {
        session: mapSupabaseSession(data.session),
        error: error as Error | null,
      };
    },

    async refreshSession() {
      const { data, error } = await supabase.auth.refreshSession();
      return {
        session: mapSupabaseSession(data.session),
        error: error as Error | null,
      };
    },

    onAuthStateChange(callback: (session: Session | null) => void) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(mapSupabaseSession(session));
      });
      return {
        unsubscribe: () => subscription.unsubscribe(),
      };
    },
  },

  db: {
    from<T = unknown>(table: string) {
      const query = supabase.from(table);
      
      return {
        select: async (columns?: string) => {
          const { data, error } = await query.select(columns || '*');
          return { data: data as T[] | null, error: error as Error | null };
        },
        insert: async (insertData: Partial<T> | Partial<T>[]) => {
          const { data, error } = await query.insert(insertData as any).select().single();
          return { data: data as T | null, error: error as Error | null };
        },
        update: async (updateData: Partial<T>) => {
          const { data, error } = await query.update(updateData as any).select().single();
          return { data: data as T | null, error: error as Error | null };
        },
        delete: async () => {
          const { error } = await query.delete();
          return { error: error as Error | null };
        },
        eq: (column: string, value: unknown) => {
          return supabaseProvider.db.from<T>(table);
        },
        single: async () => {
          const { data, error } = await query.select('*').single();
          return { data: data as T | null, error: error as Error | null };
        },
      };
    },
  },

  storage: {
    async upload(bucket: string, path: string, file: File | Blob) {
      const { data, error } = await supabase.storage.from(bucket).upload(path, file);
      return { data: data as { path: string } | null, error: error as Error | null };
    },

    async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600) {
      const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
      return { data: data as { signedUrl: string } | null, error: error as Error | null };
    },

    async delete(bucket: string, paths: string[]) {
      const { error } = await supabase.storage.from(bucket).remove(paths);
      return { error: error as Error | null };
    },
  },
};