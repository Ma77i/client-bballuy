import Constants from 'expo-constants';
import { BackendProvider } from './types';
import { supabaseProvider } from './supabase';

const provider = Constants.expoConfig?.extra?.provider || process.env.EXPO_PUBLIC_PROVIDER || 'supabase';

export const backend: BackendProvider = (() => {
  switch (provider) {
    case 'supabase':
      return supabaseProvider;
    case 'firebase':
      throw new Error('Firebase provider not yet implemented. Set EXPO_PUBLIC_PROVIDER=supabase');
    default:
      console.warn(`Unknown provider: ${provider}. Falling back to Supabase.`);
      return supabaseProvider;
  }
})();

export * from './types';
export { supabase } from './supabase';
