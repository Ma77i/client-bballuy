import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { useAuth } from '@/contexts/AuthContext';
import { backendScope, supabase } from '@/lib/backend/supabase';
import { accountQueryKey } from '@/lib/auth/account-cache';
import { createMatchManager, loadMatch, loadOwnedMatches, MatchError, searchMatchPlayers, type MatchInput } from '@/lib/pickup/matches';
import { useActiveScreen } from './pickup';

export function useRecordedMatches() {
  const owner = useAuth().session?.user.id ?? '', active = useActiveScreen();
  return useQuery({ queryKey: accountQueryKey(owner, 'recorded-matches'), enabled: Boolean(owner && active), retry: false,
    queryFn: ({ signal }) => loadOwnedMatches(supabase, owner, signal), refetchInterval: active ? 30_000 : false });
}
export function useMatch(id: string) {
  const owner = useAuth().session?.user.id ?? '', active = useActiveScreen();
  return useQuery({ queryKey: [...accountQueryKey(owner, 'match-detail'), id], enabled: Boolean(owner && active && id), retry: false,
    queryFn: ({ signal }) => loadMatch(supabase, owner, id, signal), refetchInterval: active ? 30_000 : false });
}
export function useMatchPlayerSearch(search: string) {
  const owner = useAuth().session?.user.id ?? '', active = useActiveScreen();
  return useQuery({ queryKey: [...accountQueryKey(owner, 'match-player-search'), search], enabled: Boolean(owner && active && search.trim().length >= 2), retry: false,
    queryFn: ({ signal }) => searchMatchPlayers(supabase, owner, search, signal) });
}
export function useMatchAction(scope: string) {
  const owner = useAuth().session?.user.id ?? '', cache = useQueryClient();
  const manager = useMemo(() => createMatchManager({ client: supabase, storage: AsyncStorage, owner, backend: backendScope, scope, makeId: randomUUID }), [owner, scope]);
  const [loaded, setLoaded] = useState<typeof manager | null>(null), [pending, setPending] = useState(manager.pending);
  const [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null);
  const mounted = useRef(false), lock = useRef(false);
  useFocusEffect(useCallback(() => {
    mounted.current = true; setLoaded(null); setBusy(manager.busy); let alive = true;
    void manager.load().then(value => { if (alive) { setPending(value); setLoaded(manager); } }).catch(() => { if (alive) setError('Unable to read saved match requests. Reopen to retry.'); });
    return () => { alive = false; mounted.current = false; };
  }, [manager]));
  async function run(input?: MatchInput) {
    if (loaded !== manager || lock.current) return null;
    lock.current = true; setBusy(true); setError(null);
    try {
      const result = await manager.send(input);
      if (!mounted.current) return null;
      cache.setQueryData([...accountQueryKey(owner, 'match-detail'), result.game.id], result);
      await Promise.all(['recorded-matches','match-detail','organized-games','pickup-personal','pickup-discovery','pickup-details'].map(resource => cache.invalidateQueries({ queryKey: accountQueryKey(owner, resource) })));
      return mounted.current ? result : null;
    } catch (cause) {
      if (mounted.current) {
        setError(cause instanceof MatchError ? cause.message : 'Unable to confirm your account or match. Retry.');
        if (cause instanceof MatchError && cause.rejected) await cache.invalidateQueries({ queryKey: accountQueryKey(owner, 'match-detail') });
      } return null;
    } finally { lock.current = false; if (mounted.current) { setPending(manager.pending); setBusy(false); } }
  }
  return { ready: loaded === manager, pending, busy, error, run };
}
