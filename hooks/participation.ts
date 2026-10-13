import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { useAuth } from '@/contexts/AuthContext';
import { backendScope, supabase } from '@/lib/backend/supabase';
import { accountQueryKey } from '@/lib/auth/account-cache';
import { createParticipationManager, ParticipationError } from '@/lib/pickup/participation';

export function useParticipation(sessionId: string) {
  const owner = useAuth().session?.user.id ?? '';
  const cache = useQueryClient();
  const manager = useMemo(() => createParticipationManager({ client: supabase, storage: AsyncStorage,
    owner, backend: backendScope, sessionId, makeId: randomUUID }), [owner, sessionId]);
  const [loaded, setLoaded] = useState<typeof manager | null>(null);
  const [pending, setPending] = useState(manager.pending);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(false), lock = useRef(false);
  useFocusEffect(useCallback(() => {
    mounted.current = true;
    setLoaded(null); setBusy(manager.busy);
    let alive = true;
    void manager.load().then(value => {
      if (alive) { setPending(value); setLoaded(manager); }
    }).catch(() => { if (alive) setError('Unable to read saved registration requests. Reopen this screen to retry.'); });
    return () => { alive = false; mounted.current = false; };
  }, [manager]));
  async function run(action?: 'join' | 'leave') {
    if (loaded !== manager || lock.current) return null;
    lock.current = true; setBusy(true); setError(null);
    try {
      const result = await manager.send(action);
      if (!mounted.current) return null;
      cache.setQueryData([...accountQueryKey(owner, 'pickup-details'), sessionId], result);
      await Promise.all(['pickup-details', 'pickup-discovery', 'pickup-personal', 'organized-games'].map(resource =>
        cache.invalidateQueries({ queryKey: accountQueryKey(owner, resource) })));
      return mounted.current ? result : null;
    } catch (cause) {
      if (mounted.current) {
        setError(cause instanceof ParticipationError ? cause.message : 'Unable to confirm your account or registration. Retry.');
        if (cause instanceof ParticipationError && cause.rejected) {
          await Promise.all(['pickup-details', 'pickup-discovery', 'pickup-personal'].map(resource =>
            cache.invalidateQueries({ queryKey: accountQueryKey(owner, resource) })));
        }
      }
      return null;
    } finally {
      lock.current = false;
      if (mounted.current) { setPending(manager.pending); setBusy(false); }
    }
  }
  return { ready: loaded === manager, pending, busy, error, run };
}
