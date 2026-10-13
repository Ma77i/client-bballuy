import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { useAuth } from '@/contexts/AuthContext';
import { backendScope, supabase } from '@/lib/backend/supabase';
import { accountQueryKey } from '@/lib/auth/account-cache';
import { createOrganizerRequestManager, loadOwnedSession, loadOwnedSessions, OrganizerError, type OrganizerInput } from '@/lib/pickup/organizer';

export function useOrganizedSessions() {
  const { session } = useAuth();
  const owner = session?.user.id ?? '';
  return useQuery({ queryKey: accountQueryKey(owner, 'organized-games'), enabled: Boolean(owner), retry: false,
    queryFn: ({ signal }) => loadOwnedSessions(supabase, owner, signal) });
}
export function useOrganizedSession(id: string) {
  const { session } = useAuth();
  const owner = session?.user.id ?? '';
  return useQuery({ queryKey: [...accountQueryKey(owner, 'organized-games'), id], enabled: Boolean(owner && id), retry: false,
    queryFn: ({ signal }) => loadOwnedSession(supabase, owner, id, signal) });
}
export function useOrganizerAction(scope: string) {
  const { session } = useAuth();
  const owner = session?.user.id ?? '';
  const cache = useQueryClient();
  const manager = useMemo(() => createOrganizerRequestManager({ client: supabase, storage: AsyncStorage,
    owner, backend: backendScope, scope, makeId: randomUUID }), [owner, scope]);
  const [loadedManager, setLoadedManager] = useState<typeof manager | null>(null);
  const ready = loadedManager === manager;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(manager.pending);
  const mounted = useRef(false);
  const lock = useRef(false);
  useFocusEffect(useCallback(() => {
    mounted.current = true;
    setLoadedManager(null);
    setBusy(manager.busy);
    let alive = true;
    void manager.load().then(value => {
      if (alive) { setPending(value); setLoadedManager(manager); }
    }).catch(() => { if (alive) setError('Unable to read saved requests. Reopen this screen to retry.'); });
    return () => { alive = false; mounted.current = false; };
  }, [manager]));
  async function run(input?: OrganizerInput) {
    if (!ready || lock.current) return null;
    lock.current = true; setBusy(true); setError(null);
    try {
      const result = await manager.send(input);
      if (!mounted.current) return null;
      await Promise.all(['organized-games', 'pickup-discovery', 'pickup-details', 'pickup-personal'].map(resource =>
        cache.invalidateQueries({ queryKey: accountQueryKey(owner, resource) })));
      return mounted.current ? result : null;
    } catch (cause) {
      if (mounted.current) setError(cause instanceof OrganizerError ? cause.message : 'Unable to save. Please retry.');
      return null;
    } finally {
      lock.current = false;
      if (mounted.current) { setPending(manager.pending); setBusy(false); }
    }
  }
  return { ready, busy, error, pending, run };
}
