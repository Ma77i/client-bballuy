// hooks/profile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/backend/supabase';
import type { Tables } from '@/lib/backend/database.types';

export type Me = Tables<'users_public'>;
export type ProfilePatch = Pick<Me, 'display_name' | 'avatar_url'>;

export type TeamLite = {
  id: string;
  name: string;
  logo_url: string | null;
  is_public: boolean | null;
  captain_id: string;
};

/** PUBLIC USER BY ID */
export type PublicUser = Pick<Me,
  'id' | 'display_name' | 'avatar_url' | 'level' | 'games_played' |
  'points_total' | 'assists_total' | 'rebounds_total'
>;

export function useUserById(id?: string) {
  return useQuery<PublicUser | null>({
    queryKey: ['user', id],
    enabled: !!id, // no corras la query hasta tener id
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users_public')
        .select(
          'id, display_name, avatar_url, level, games_played, points_total, assists_total, rebounds_total'
        )
        .eq('id', id!)
        .maybeSingle();

      if (error) throw error;
      return data ?? null;
    },
  });
}

async function getUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) throw new Error('Not authenticated');
  return data.user.id;
}

/** ME */
export function useMe() {
  return useQuery<Me | null>({
    queryKey: ['me'],
    queryFn: async () => {
      const uid = await getUserId();
      const { data, error } = await supabase
        .from('users_public')
        .select('*')
        .eq('id', uid)
        .single();

      if (error) {
        // Si aún no hay fila en users_public, devolvemos null (evitá crashear)
        if (error.code === 'PGRST116' /* row not found */) return null;
        throw error;
      }
      return data;
    },
  });
}

/** UPDATE ME */
export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<ProfilePatch>) => {
      const uid = await getUserId();
      const { data, error } = await supabase
        .from('users_public')
        .update(patch)
        .eq('id', uid)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

/** MY TEAMS (merge capitán + miembro activo) */
export function useMyTeams() {
  return useQuery<TeamLite[]>({
    queryKey: ['my-teams'],
    queryFn: async () => {
      const uid = await getUserId();

      // 1) Equipos donde soy capitán
      const { data: captainTeams, error: e1 } = await supabase
        .from('teams')
        .select('id,name,logo_url,is_public,captain_id')
        .eq('captain_id', uid);
      if (e1) throw e1;

      // 2) IDs de equipos donde soy miembro (activo o null)
      const { data: memberships, error: e2 } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', uid)
        .or('status.is.null,status.eq.active');
      if (e2) throw e2;

      const memberTeamIds = (memberships ?? []).map((m) => m.team_id);
      let memberTeams: TeamLite[] = [];

      // 3) Traer esos equipos (si hay)
      if (memberTeamIds.length) {
        const { data, error: e3 } = await supabase
          .from('teams')
          .select('id,name,logo_url,is_public,captain_id')
          .in('id', memberTeamIds);
        if (e3) throw e3;
        memberTeams = (data ?? []) as TeamLite[];
      }

      // 4) Fusionar sin duplicados y ordenar
      const map = new Map<string, TeamLite>();
      for (const t of [...(captainTeams ?? []), ...memberTeams]) {
        map.set(t.id, t as TeamLite);
      }
      return Array.from(map.values()).sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    },
  });
}
