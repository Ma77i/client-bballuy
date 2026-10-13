import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useIsFocused } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/backend/supabase';
import { accountQueryKey } from '@/lib/auth/account-cache';
import { loadPublicSession, loadPublicSessions } from '@/lib/pickup/discovery';
import { loadPersonalSessions } from '@/lib/pickup/participation';

export function useActiveScreen() {
  const focused = useIsFocused();
  const [active, setActive] = useState(AppState.currentState === 'active' || AppState.currentState === null);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => setActive(state === 'active'));
    return () => subscription.remove();
  }, []);
  return focused && active;
}
export function usePublicSessions() {
  const owner = useAuth().session?.user.id ?? '';
  const active = useActiveScreen();
  return useQuery({ queryKey: accountQueryKey(owner, 'pickup-discovery'), enabled: Boolean(owner && active),
    queryFn: ({ signal }) => loadPublicSessions(supabase, owner, signal), retry: false,
    staleTime: 0, refetchInterval: active ? 30_000 : false, refetchIntervalInBackground: false });
}
export function usePublicSession(id: string) {
  const owner = useAuth().session?.user.id ?? '';
  const active = useActiveScreen();
  return useQuery({ queryKey: [...accountQueryKey(owner, 'pickup-details'), id], enabled: Boolean(owner && id && active),
    queryFn: ({ signal }) => loadPublicSession(supabase, owner, id, signal), retry: false,
    staleTime: 0, refetchInterval: active ? 30_000 : false, refetchIntervalInBackground: false });
}
export function usePersonalSessions() {
  const owner = useAuth().session?.user.id ?? '';
  const active = useActiveScreen();
  return useQuery({ queryKey: accountQueryKey(owner, 'pickup-personal'), enabled: Boolean(owner && active),
    queryFn: ({ signal }) => loadPersonalSessions(supabase, owner, signal), retry: false,
    staleTime: 0, refetchInterval: active ? 30_000 : false, refetchIntervalInBackground: false });
}
