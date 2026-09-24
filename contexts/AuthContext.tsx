import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { AppState, Platform } from 'react-native';
import { supabase } from '@/lib/backend';
import { consentSync } from '@/lib/backend/supabase';
import { secureStorage } from '@/lib/utils/secureStorage';
import { createAuthController } from '@/lib/auth/controller';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [controller] = useState(() => createAuthController(supabase.auth, async (id, email) => {
    await consentSync.sync(id, email);
    const { data, error } = await supabase.from('users_public').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }, () => secureStorage.clearAll()));
  const state = useSyncExternalStore(controller.subscribe, controller.snapshot, controller.snapshot);

  useEffect(() => controller.start(), [controller]);
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const update = (status: string) => {
      if (status === 'active') void supabase.auth.startAutoRefresh();
      else void supabase.auth.stopAutoRefresh();
    };
    update(AppState.currentState);
    const subscription = AppState.addEventListener('change', update);
    return () => { subscription.remove(); void supabase.auth.stopAutoRefresh(); };
  }, []);

  const refreshUser = useCallback(async () => {
    await controller.retry();
    if (controller.snapshot().error) throw new Error(controller.snapshot().error!);
  }, [controller]);

  return {
    ...state,
    isAuthenticated: Boolean(state.session),
    role: state.user?.app_role ?? 'player',
    signUp: async (email: string, password: string, displayName: string) => {
      try {
        await consentSync.prepare(email);
        return await controller.signUp(email, password, displayName);
      } catch (error) {
        return { error: error instanceof Error ? error : new Error('Unable to prepare signup. Please retry.'), requiresConfirmation: false };
      }
    },
    signIn: controller.signIn,
    signOut: controller.signOut,
    refreshUser,
    retry: controller.retry,
  };
});
