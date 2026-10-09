import { useRef } from 'react';
import { setCourtMembership } from '@/lib/courts/membership';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/backend/supabase';
import { accountQueryKey } from '@/lib/auth/account-cache';
import { loadMyCourts } from '@/lib/auth/my-courts';

export function useMyCourts() {
  const { session } = useAuth();
  const owner = session?.user.id ?? null;
  return useQuery({
    queryKey: accountQueryKey(owner, 'my-courts'),
    enabled: Boolean(owner),
    queryFn: ({ signal }) => {
      if (!owner) throw new Error('Not authenticated');
      return loadMyCourts(supabase, owner, signal);
    },
  });
}

export function useCourtMembership(courtId: string) {
  const { session } = useAuth();
  const owner = session?.user.id ?? null;
  const queryClient = useQueryClient();
  const membership = useMyCourts();
  const locked = useRef(false);
  const key = accountQueryKey(owner, 'my-courts');
  const mutation = useMutation({
    mutationKey: [...key, courtId],
    mutationFn: async (joined: boolean) => {
      if (!owner) throw new Error('Not authenticated');
      await queryClient.cancelQueries({ queryKey: key });
      await setCourtMembership(supabase, owner, courtId, joined);
      return loadMyCourts(supabase, owner);
    },
    onSuccess: async rows => {
      await queryClient.cancelQueries({ queryKey: key });
      queryClient.setQueryData(key, rows);
    },
    onError: () => { void queryClient.invalidateQueries({ queryKey: key }); },
    retry: false,
  });
  async function change(joined: boolean) {
    if (locked.current) return;
    locked.current = true;
    try { await mutation.mutateAsync(joined); }
    catch { /* The screen renders a safe retry message from mutation.isError. */ }
    finally { locked.current = false; }
  }
  return { membership, mutation, change,
    joined: membership.data?.some(row => row.court_id === courtId) ?? false };
}
