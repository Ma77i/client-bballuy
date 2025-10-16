import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback } from 'react';
import { backend, Session, UserPublic, AppRole, supabase } from '@/lib/backend';
import { secureStorage } from '@/lib/utils/secureStorage';

interface AuthContextValue {
  session: Session | null;
  user: UserPublic | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: AppRole;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithOAuth: (provider: 'google' | 'apple' | 'facebook') => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const [AuthProvider, useAuth] = createContextHook<AuthContextValue>(() => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserPublic | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users_public')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserPublic;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!session?.user?.id) return;
    const profile = await fetchUserProfile(session.user.id);
    if (profile) {
      setUser(profile);
    }
  }, [session, fetchUserProfile]);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { session: currentSession } = await backend.auth.getSession();
        
        if (mounted) {
          setSession(currentSession);
          
          if (currentSession?.user?.id) {
            const profile = await fetchUserProfile(currentSession.user.id);
            if (mounted && profile) {
              setUser(profile);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    const { unsubscribe } = backend.auth.onAuthStateChange(async (newSession) => {
      if (mounted) {
        setSession(newSession);
        
        if (newSession?.user?.id) {
          const profile = await fetchUserProfile(newSession.user.id);
          if (mounted && profile) {
            setUser(profile);
          }
        } else {
          setUser(null);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [fetchUserProfile]);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    try {
      const { error } = await backend.auth.signUp(email, password, { display_name: displayName });
      
      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { session: newSession, error } = await backend.auth.signIn(email, password);
      
      if (error) {
        return { error };
      }

      if (newSession) {
        await secureStorage.saveTokens(newSession.access_token, newSession.refresh_token);
        await secureStorage.saveUserId(newSession.user.id);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const signInWithOAuth = useCallback(async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      const { error } = await backend.auth.signInWithOAuth(provider);
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await backend.auth.signOut();
      await secureStorage.clearAll();
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  return {
    session,
    user,
    isLoading,
    isAuthenticated: !!session && !!user,
    role: user?.app_role || 'player',
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    refreshUser,
  };
});
