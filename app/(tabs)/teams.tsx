import { useAuth } from '@/contexts/AuthContext';
import { accountQueryKey } from '@/lib/auth/account-cache';
import Text from '@/components/AppText';
import { useCallback, useState } from "react";
import {
  Alert,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Plus, Users as UsersIcon } from "lucide-react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Colors from "@/constants/colors";
import HeaderMenu from "@/components/HeaderMenu";
import { supabase } from "@/lib/backend/supabase";

type Team = {
  id: string;
  name: string;
  logo_url: string | null;
  is_public: boolean;
  requires_approval: boolean;
  captain_id: string;
  created_at?: string;
};

async function fetchTeamsBuckets(uid: string) {

  const { data: captainTeams, error: e1 } = await supabase
    .from("teams")
    .select(
      "id,name,logo_url,is_public,requires_approval,captain_id,created_at"
    )
    .eq("captain_id", uid);
  if (e1) throw e1;

  const { data: memberships, error: e2 } = await supabase
    .from("team_members")
    .select("team_id,status")
    .eq("user_id", uid);
  if (e2) throw e2;

  const activeIds = (memberships ?? [])
    .filter((m) => m.status === "active" || m.status === null)
    .map((m) => m.team_id);
  const pendingIds = (memberships ?? [])
    .filter((m) => m.status === "pending")
    .map((m) => m.team_id);

  let memberActiveTeams: Team[] = [];
  if (activeIds.length) {
    const { data, error } = await supabase
      .from("teams")
      .select(
        "id,name,logo_url,is_public,requires_approval,captain_id,created_at"
      )
      .in("id", activeIds);
    if (error) throw error;
    memberActiveTeams = (data ?? []) as Team[];
  }

  let pendingTeams: Team[] = [];
  if (pendingIds.length) {
    const { data, error } = await supabase
      .from("teams")
      .select(
        "id,name,logo_url,is_public,requires_approval,captain_id,created_at"
      )
      .in("id", pendingIds);
    if (error) throw error;
    pendingTeams = (data ?? []) as Team[];
  }

  const excludeIds = new Set([
    ...(captainTeams ?? []).map((t) => t.id),
    ...activeIds,
    ...pendingIds,
  ]);

  const { data: discoverRaw, error: e3 } = await supabase
    .from("teams")
    .select(
      "id,name,logo_url,is_public,requires_approval,captain_id,created_at"
    )
    .eq("is_public", true);
  if (e3) throw e3;
  const discover = (discoverRaw ?? []).filter(
    (t) => !excludeIds.has(t.id)
  ) as Team[];

  const map = new Map<string, Team>();
  for (const t of [...(captainTeams ?? []), ...memberActiveTeams])
    map.set(t.id, t as Team);
  const myTeams = Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return { myTeams, pendingTeams, discover, uid };
}

async function joinOrRequest(team: Team, uid: string) {
  const { error } = await supabase.from("team_members").insert({
    team_id: team.id,
    user_id: uid,
    role: "player",
  });
  if (error) throw error;
}

async function cancelRequest(teamId: string, uid: string) {
  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("team_id", teamId)
    .eq("user_id", uid)
    .eq("status", "pending");
  if (error) throw error;
}

async function leaveTeam(teamId: string, uid: string) {
  // Borra tu membership activa (status active o null)
  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("team_id", teamId)
    .eq("user_id", uid);
  if (error) throw error;
}

export default function TeamsScreen() {
  const router = useRouter();
  const qc = useQueryClient();
  const { session } = useAuth();
  const owner = session?.user.id ?? null;
  const [refreshing, setRefreshing] = useState(false);

  // loading granulares por teamId
  const [joining, setJoining] = useState<Record<string, boolean>>({});
  const [canceling, setCanceling] = useState<Record<string, boolean>>({});
  const [leaving, setLeaving] = useState<Record<string, boolean>>({});

  const { data, isLoading, isError, error } = useQuery({
    queryKey: accountQueryKey(owner, "teams-buckets"),
    enabled: Boolean(owner),
    queryFn: () => { if (!owner) throw new Error("Not authenticated"); return fetchTeamsBuckets(owner); },
    staleTime: 30_000,
  });

  const myTeams = data?.myTeams ?? [];
  const pendingTeams = data?.pendingTeams ?? [];
  const discover = data?.discover ?? [];
  const uid = data?.uid;

  const handleCreateTeam = () => router.push("/create-team/step1");
  const goTeamProfile = (id: string) =>
    router.push({ pathname: "/team/[id]", params: { id } });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await qc.invalidateQueries({ queryKey: accountQueryKey(owner, "teams-buckets") });
    } finally {
      setRefreshing(false);
    }
  }, [qc, owner]);

  const handleTapJoin = async (t: Team) => {
    if (!uid || joining[t.id]) return;
    setJoining((s) => ({ ...s, [t.id]: true }));
    try {
      await joinOrRequest(t, uid);
      await qc.invalidateQueries({ queryKey: accountQueryKey(owner, "teams-buckets") });
    } catch (e) {
      console.error("join/request error", e);
    } finally {
      setJoining((s) => ({ ...s, [t.id]: false }));
    }
  };

  const handleCancelPending = async (t: Team) => {
    if (!uid || canceling[t.id]) return;
    setCanceling((s) => ({ ...s, [t.id]: true }));
    try {
      await cancelRequest(t.id, uid);
      await qc.invalidateQueries({ queryKey: accountQueryKey(owner, "teams-buckets") });
    } catch (e) {
      console.error("cancel request error", e);
    } finally {
      setCanceling((s) => ({ ...s, [t.id]: false }));
    }
  };

const handleLeave = async (t: Team) => {
  if (!uid || leaving[t.id]) return;

  // Si sos capitán, no puede salir
  if (t.captain_id === uid) {
    Alert.alert(
      "No permitido",
      "El capitán no puede abandonar su equipo. Transferí la capitanía antes de salir."
    );
    return;
  }

  // Confirmación
  Alert.alert(
    "Salir del equipo",
    `¿Seguro que querés salir de "${t.name}"?`,
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          setLeaving((s) => ({ ...s, [t.id]: true }));
          try {
            await leaveTeam(t.id, uid);
            await qc.invalidateQueries({ queryKey: accountQueryKey(owner, "teams-buckets") });
          } catch (e) {
            console.error("leave team error", e);
            Alert.alert("Error", "No se pudo salir del equipo. Intentalo de nuevo.");
          } finally {
            setLeaving((s) => ({ ...s, [t.id]: false }));
          }
        },
      },
    ]
  );
};


  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Teams",
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
          headerRight: () => <HeaderMenu />,
        }}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Teams</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateTeam}
          >
            <Plus color={Colors.white} size={20} />
            <Text style={styles.createButtonText}>Create Team</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : isError ? (
          <View style={{ padding: 16 }}>
            <Text style={{ color: Colors.error, fontWeight: "600" }}>
              Error cargando equipos
            </Text>
            <Text style={{ color: Colors.textSecondary }}>
              {(error as any)?.message ?? "Intenta nuevamente."}
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scroll}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {/* My Teams */}
            <View style={{ paddingHorizontal: 16 }}>
              {myTeams.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>
                    No estás en ningún equipo
                  </Text>
                  <Text style={styles.emptyText}>
                    Creá un equipo nuevo o uníte a uno público.
                  </Text>
                </View>
              ) : (
                myTeams.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={styles.teamCard}
                    activeOpacity={0.85}
                    onPress={() => goTeamProfile(t.id)} // ← tocar la caja abre el perfil
                  >
                    <View style={styles.teamIcon}>
                      <UsersIcon color={Colors.primary} size={32} />
                    </View>

                    <View style={[styles.teamInfo, { flex: 1 }]}>
                      <View style={styles.teamHeader}>
                        <Text style={styles.teamName}>{t.name}</Text>
                        {t.captain_id === uid ? (
                          <View style={[styles.roleBadge, styles.captainBadge]}>
                            <Text style={styles.roleText}>Captain</Text>
                          </View>
                        ) : (
                          <View style={styles.roleBadge}>
                            <Text style={styles.roleText}>Member</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.teamStats}>
                        {t.is_public ? "Public" : "Private"}
                        {t.requires_approval ? " • Approval required" : ""}
                      </Text>
                    </View>

                    {/* Leave team (solo si no sos capitán) */}
                    {t.captain_id !== uid && (
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation(); // evita que dispare el onPress del card
                          handleLeave(t);
                        }}
                        disabled={!!leaving[t.id]}
                        style={[
                          styles.smallBtn,
                          {
                            backgroundColor: Colors.error,
                            opacity: leaving[t.id] ? 0.6 : 1,
                          },
                        ]}
                      >
                        {leaving[t.id] ? (
                          <ActivityIndicator
                            size="small"
                            color={Colors.white}
                          />
                        ) : (
                          <Text style={styles.smallBtnText}>Leave</Text>
                        )}
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </View>

            {/* Pending requests */}
            {pendingTeams.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Requests Pendientes</Text>
                {pendingTeams.map((t) => (
                  <View key={t.id} style={styles.discoverCard}>
                    <View style={styles.teamIconSmall}>
                      <UsersIcon color={Colors.textSecondary} size={24} />
                    </View>
                    <View style={[styles.teamInfo, { flex: 1 }]}>
                      <Text style={styles.teamName}>{t.name}</Text>
                      <Text style={styles.teamStats}>Pending approval</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => goTeamProfile(t.id)}
                      style={[
                        styles.smallBtn,
                        {
                          backgroundColor: Colors.surfaceLight,
                          marginRight: 8,
                        },
                      ]}
                    >
                      <Text
                        style={[styles.smallBtnText, { color: Colors.text }]}
                      >
                        View
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleCancelPending(t)}
                      disabled={!!canceling[t.id]}
                      style={[
                        styles.smallBtn,
                        {
                          backgroundColor: Colors.error,
                          opacity: canceling[t.id] ? 0.6 : 1,
                        },
                      ]}
                    >
                      {canceling[t.id] ? (
                        <ActivityIndicator size="small" color={Colors.white} />
                      ) : (
                        <Text style={styles.smallBtnText}>Cancel</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Discover */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Discover Teams</Text>
              {discover.length === 0 ? (
                <Text style={[styles.teamStats, { paddingHorizontal: 16 }]}>
                  No hay equipos públicos disponibles por ahora.
                </Text>
              ) : (
                discover.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={styles.discoverCard}
                    activeOpacity={0.85}
                    onPress={() => goTeamProfile(t.id)} // Tocar la caja abre el perfil
                  >
                    <View style={styles.teamIconSmall}>
                      <UsersIcon color={Colors.secondary} size={24} />
                    </View>
                    <View style={[styles.teamInfo, { flex: 1 }]}>
                      <Text style={styles.teamName}>{t.name}</Text>
                      <Text style={styles.teamStats}>
                        {t.is_public ? "Public" : "Private"}
                        {t.requires_approval
                          ? " • Approval required"
                          : " • Instant join"}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleTapJoin(t);
                      }}
                      disabled={!!joining[t.id]}
                      style={[
                        styles.joinButton,
                        { opacity: joining[t.id] ? 0.6 : 1 },
                      ]}
                    >
                      {joining[t.id] ? (
                        <ActivityIndicator size="small" color={Colors.white} />
                      ) : (
                        <Text style={styles.joinButtonText}>
                          {t.requires_approval ? "Request" : "Join"}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: { fontSize: 24, fontWeight: "700", color: Colors.text },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  createButtonText: { color: Colors.white, fontSize: 14, fontWeight: "600" },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  scroll: { flex: 1 },

  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  emptyTitle: {
    color: Colors.text,
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },
  emptyText: { color: Colors.textSecondary },

  teamCard: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    gap: 16,
  },
  teamIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
  },
  teamIconSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
  },
  teamInfo: { gap: 6 },
  teamHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  teamName: { fontSize: 18, fontWeight: "600", color: Colors.text },
  roleBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  captainBadge: { backgroundColor: Colors.secondary },
  roleText: { fontSize: 12, fontWeight: "600", color: Colors.text },
  teamStats: { fontSize: 14, color: Colors.textSecondary },

  section: { marginTop: 24, marginBottom: 16, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },

  discoverCard: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    gap: 12,
  },
  joinButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  smallBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  smallBtnText: { color: Colors.white, fontSize: 14, fontWeight: "600" },
  joinButtonText: { color: Colors.white, fontSize: 14, fontWeight: "600" },
});
