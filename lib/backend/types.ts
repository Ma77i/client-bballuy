export type AppRole = 'player' | 'team_captain' | 'moderator' | 'admin';
export type ProfileVisibility = 'public' | 'friends' | 'private';
export type LocationMode = 'precise' | 'approx';
export type MatchStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type ReportReason = 'spam' | 'harassment' | 'inappropriate_content' | 'fake_profile' | 'cheating' | 'other';
export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';
export type ThreadType = 'team' | 'direct' | 'match';
export type ConsentType = 'tos' | 'privacy_policy' | 'age_verification';

export interface UserPublic {
  id: string;
  display_name: string;
  avatar_url: string | null;
  app_role: AppRole;
  discoverable: boolean;
  profile_visibility: ProfileVisibility;
  location_mode: LocationMode;
  bio: string | null;
  city: string | null;
  level: number;
  xp: number;
  games_played: number;
  games_won: number;
  points_total: number;
  assists_total: number;
  rebounds_total: number;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  captain_id: string;
  logo_url: string | null;
  is_public: boolean;
  description: string | null;
  home_court_id: string | null;
  wins: number;
  losses: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  team_id: string;
  user_id: string;
  role: 'captain' | 'member';
  position: string | null;
  jersey_number: number | null;
  joined_at: string;
}

export interface Court {
  id: string;
  name: string;
  coords: { lat: number; lng: number };
  address: string | null;
  surface: 'concrete' | 'asphalt' | 'wood' | 'rubber' | 'other' | null;
  lighting: boolean;
  indoor: boolean;
  hoops_count: number;
  notes: string | null;
  rating_avg: number;
  rating_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  home_team_id: string | null;
  away_team_id: string | null;
  court_id: string;
  scheduled_at: string;
  status: MatchStatus;
  score_home: number | null;
  score_away: number | null;
  duration_minutes: number | null;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  content: string;
  is_system: boolean;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: 'user' | 'team' | 'message' | 'court' | 'photo';
  target_id: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  moderator_id: string | null;
  moderator_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  app_metadata: {
    provider?: string;
    [key: string]: unknown;
  };
  user_metadata: {
    display_name?: string;
    avatar_url?: string;
    [key: string]: unknown;
  };
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: AuthUser;
}

export type QueryBuilder<T> = {
  select: (columns?: string) => Promise<{ data: T[] | null; error: Error | null }>;
  insert: (data: Partial<T> | Partial<T>[]) => Promise<{ data: T | null; error: Error | null }>;
  update: (data: Partial<T>) => Promise<{ data: T | null; error: Error | null }>;
  delete: () => Promise<{ error: Error | null }>;
  eq: (column: string, value: unknown) => QueryBuilder<T>;
  single: () => Promise<{ data: T | null; error: Error | null }>;
};

export interface BackendProvider {
  auth: {
    signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<{ user: AuthUser | null; session: Session | null; error: Error | null }>;
    signIn: (email: string, password: string) => Promise<{ user: AuthUser | null; session: Session | null; error: Error | null }>;
    signInWithOAuth: (provider: 'google' | 'apple' | 'facebook') => Promise<{ error: Error | null }>;
    signOut: () => Promise<{ error: Error | null }>;
    getSession: () => Promise<{ session: Session | null; error: Error | null }>;
    refreshSession: () => Promise<{ session: Session | null; error: Error | null }>;
    onAuthStateChange: (callback: (session: Session | null) => void) => { unsubscribe: () => void };
  };
  db: {
    from: <T = unknown>(table: string) => QueryBuilder<T>;
  };
  storage: {
    upload: (bucket: string, path: string, file: File | Blob) => Promise<{ data: { path: string } | null; error: Error | null }>;
    getSignedUrl: (bucket: string, path: string, expiresIn?: number) => Promise<{ data: { signedUrl: string } | null; error: Error | null }>;
    delete: (bucket: string, paths: string[]) => Promise<{ error: Error | null }>;
  };
}
