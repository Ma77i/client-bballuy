import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../backend/database.types';

export async function loadMyCourts(client: SupabaseClient<Database>, owner: string, signal?: AbortSignal) {
  if (!owner) throw new Error('Not authenticated');
  let query = client.from('court_memberships')
    .select('court_id,joined_at,court_catalog(id,name)')
    .eq('user_id', owner).order('joined_at', { ascending: false });
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
