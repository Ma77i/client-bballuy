import type { Session, SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables } from '../backend/database.types';

type Profile = Tables<'users_public'>;
type Gateway = Pick<SupabaseClient<Database>['auth'],
  'getSession' | 'getUser' | 'onAuthStateChange' | 'signUp' | 'signInWithPassword' | 'signOut'>;
export type AuthState = {
  session: Session | null;
  user: Profile | null;
  isLoading: boolean;
  error: string | null;
};

export function authDestination(state: AuthState) {
  if (state.isLoading || state.error) return null;
  if (!state.session) return '/(auth)/signin' as const;
  if (!state.user || (state.user.display_name?.trim().length ?? 0) < 2) return '/(auth)/profile-setup' as const;
  return '/(tabs)/map' as const;
}

function message(error: unknown) {
  return error instanceof Error ? error : new Error('Unable to complete authentication. Please try again.');
}
function invalidSession(error: unknown) {
  if (!error || typeof error !== 'object') return false;
  return ('status' in error && [401, 403].includes(Number(error.status))) ||
    ('code' in error && ['refresh_token_not_found', 'refresh_token_already_used', 'session_not_found', 'user_not_found'].includes(String(error.code)));
}

export function createAuthController(auth: Gateway, loadProfile: (id: string, email?: string) => Promise<Profile>, clearLegacy: () => Promise<void>) {
  let state: AuthState = { session: null, user: null, isLoading: true, error: null };
  let active = false;
  let revision = 0;
  const listeners = new Set<() => void>();
  const publish = (next: AuthState) => { state = next; listeners.forEach(listener => listener()); };
  const current = (version: number) => active && version === revision;

  async function hydrate(session: Session, version: number) {
    try {
      const { data, error } = await auth.getUser();
      if (!current(version)) return;
      if (error) throw error;
      if (!data.user || data.user.id !== session.user.id) throw Object.assign(new Error('Session is no longer valid.'), { status: 401 });
      const profile = await loadProfile(session.user.id, data.user.email);
      if (current(version)) publish({ session: state.session, user: profile, isLoading: false, error: null });
    } catch (error) {
      if (!current(version)) return;
      if (invalidSession(error)) {
        try {
          const { error: signOutError } = await auth.signOut({ scope: 'local' });
          if (current(version)) publish({ session: null, user: null, isLoading: false,
            error: signOutError ? 'Unable to clear the expired session. Please retry.' : null });
        } catch {
          if (current(version)) publish({ session: null, user: null, isLoading: false,
            error: 'Unable to clear the expired session. Please retry.' });
        }
      } else {
        publish({ session: state.session, user: null, isLoading: false,
          error: error instanceof Error && error.name === 'ConsentSyncError'
            ? 'Unable to save your consent. Check your connection and retry. Your account is already created.'
            : 'Unable to load your profile. Check your connection and retry.' });
      }
    }
  }
  // Never await another Supabase operation from onAuthStateChange.
  function accept(session: Session | null) {
    if (!active) return;
    if (session && state.session?.access_token === session.access_token && (state.isLoading || state.user)) return;
    const version = ++revision;
    if (!session) {
      publish({ session: null, user: null, isLoading: false, error: null });
    } else if (state.user?.id === session.user.id) {
      publish({ ...state, session, isLoading: false, error: null });
    } else {
      publish({ session, user: null, isLoading: true, error: null });
      // Deferral also prevents session validation from executing inside an auth lock.
      void Promise.resolve().then(() => hydrate(session, version));
    }
  }
  async function restore() {
    const version = revision;
    try {
      const { data, error } = await auth.getSession();
      if (!current(version)) return;
      if (error && !invalidSession(error)) throw error;
      accept(error ? null : data.session);
    } catch {
      if (current(version)) publish({ session: null, user: null, isLoading: false,
        error: 'Unable to restore your session. Please retry.' });
    }
  }
  return {
    snapshot: () => state,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    start() {
      active = true;
      publish({ session: null, user: null, isLoading: true, error: null });
      const { data: { subscription } } = auth.onAuthStateChange((_event, session) => accept(session));
      void restore();
      return () => { active = false; revision++; subscription.unsubscribe(); };
    },
    async retry() {
      if (state.session) {
        const version = ++revision;
        const session = state.session;
        publish({ ...state, isLoading: true, error: null });
        await hydrate(session, version);
      } else {
        revision++;
        publish({ ...state, isLoading: true, error: null });
        await restore();
      }
    },
    async signUp(email: string, password: string, displayName: string) {
      try {
        const { data, error } = await auth.signUp({ email: email.trim(), password,
          options: { data: { display_name: displayName.trim() } } });
        if (error) return { error, requiresConfirmation: false };
        if (data.session) accept(data.session);
        return { error: null, requiresConfirmation: !data.session };
      } catch (error) { return { error: message(error), requiresConfirmation: false }; }
    },
    async signIn(email: string, password: string) {
      try {
        const { data, error } = await auth.signInWithPassword({ email: email.trim(), password });
        if (error) return { error };
        if (!data.session) return { error: new Error('No session was returned. Please sign in again.') };
        accept(data.session);
        return { error: null };
      } catch (error) { return { error: message(error) }; }
    },
    async signOut() {
      try {
        const { error } = await auth.signOut({ scope: 'local' });
        if (error) return { error };
        accept(null);
        await clearLegacy();
        return { error: null };
      } catch (error) { return { error: message(error) }; }
    },
  };
}
