import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../backend/database.types';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function setCourtMembership(client: SupabaseClient<Database>, owner: string, courtId: string, joined: boolean) {
  if (!uuid.test(owner) || !uuid.test(courtId)) throw new Error('Invalid membership request.');
  const user = await client.auth.getUser();
  if (user.error || user.data.user?.id !== owner) throw new Error('Your session changed. Please sign in again.');
  if (joined) {
    const { error } = await client.from('court_memberships').insert({ user_id: owner, court_id: courtId });
    // A retry/concurrent insert may hit the unique key. Verify the actual row below;
    // never use UPDATE/upsert to rewrite the server-managed join timestamp.
    if (error && error.code !== '23505') throw error;
  } else {
    const { error } = await client.from('court_memberships').delete().eq('user_id', owner).eq('court_id', courtId);
    if (error) throw error;
  }
  const { data, error } = await client.from('court_memberships').select('court_id')
    .eq('user_id', owner).eq('court_id', courtId).maybeSingle();
  if (error) throw error;
  if (Boolean(data) !== joined) throw new Error('Membership could not be confirmed. Retry the same action.');
}
