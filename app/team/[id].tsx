import Text from '@/components/AppText';
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import Colors from "@/constants/colors";
import { supabase } from "@/lib/backend/supabase";
import { getSignedUrl } from "@/lib/backend/storage";

type TabKey = "roster" | "stats" | "schedule";

interface Team {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null; // storage path
  captain_id: string;
  is_public: boolean;
  requires_approval: boolean;
  created_at: string;
}

interface Member {
  id: string;
  display_name: string;
  avatar_url: string | null; // storage path
  role: string;
  status: string;
}

interface MatchRow {
  id: string;
  home_team_id: string;
  away_team_id: string;
  score_home: number | null;
  score_away: number | null;
  scheduled_at: string;
  status: "scheduled" | "pending" | "finished" | string;
  court_id: string | null;
}

type Membership = {
  team_id: string;
  user_id: string;
  role: string | null;
  status: "active" | "pending" | null;
};

type TeamLite = { id: string; name: string; logo_url: string | null };
type CourtLite = { id: string; name: string };

export default function TeamProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [team, setTeam] = useState<Team | null>(null);
  const [teamLogoSigned, setTeamLogoSigned] = useState<string | null>(null);

  const [members, setMembers] = useState<Member[]>([]);
  const [memberAvatarMap, setMemberAvatarMap] = useState<
    Record<string, string | null>
  >({});

  const [myUid, setMyUid] = useState<string | null>(null);
  const [myMembership, setMyMembership] = useState<Membership | null>(null);

  const isCaptain = !!(team && myUid && team.captain_id === myUid);

  // STATS
  const [finishedMatches, setFinishedMatches] = useState<MatchRow[]>([]);
  // SCHEDULE
  const [upcomingMatches, setUpcomingMatches] = useState<MatchRow[]>([]);
  const [recentMatches, setRecentMatches] = useState<MatchRow[]>([]);

  // Helpers de nombres para schedule
  const [teamsMap, setTeamsMap] = useState<Record<string, TeamLite>>({});
  const [courtsMap, setCourtsMap] = useState<Record<string, CourtLite>>({});

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("roster");
  const [deletingTeam, setDeletingTeam] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      // user actual
      const { data: udata } = await supabase.auth.getUser();
      const uid = udata.user?.id ?? null;
      setMyUid(uid);

      // datos del team + resto
      await fetchTeamData(id);

      // tu membership (si estás logueado)
      if (uid) {
        await fetchMyMembership(id, uid);
      } else {
        setMyMembership(null);
      }
    })();
  }, [id]);

  async function fetchTeamData(teamId: string) {
    try {
      setLoading(true);

      // --- TEAM
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("*")
        .eq("id", teamId)
        .single();
      if (teamError) throw teamError;

      setTeam(teamData as Team);

      // Firma logo si existe
      if (teamData?.logo_url) {
        const signed = await getSignedUrl(teamData.logo_url, 3600);
        setTeamLogoSigned(signed);
      } else {
        setTeamLogoSigned(null);
      }

      // --- MEMBERS (+ users_public)
      const { data: membersData, error: membersError } = await supabase
        .from("team_members")
        .select(
          `
          user_id,
          role,
          status,
          users_public (
            id,
            display_name,
            avatar_url
          )
        `
        )
        .eq("team_id", teamId)
        .order("role", { ascending: true });
      if (membersError) throw membersError;

      const formatted: Member[] =
        (membersData ?? []).map((m: any) => ({
          id: m.users_public.id,
          display_name: m.users_public.display_name,
          avatar_url: m.users_public.avatar_url,
          role: m.role,
          status: m.status,
        })) ?? [];

      setMembers(formatted);

      // Firma avatares en paralelo
      const avatarPairs = await Promise.all(
        formatted.map(async (m) => {
          if (!m.avatar_url) return [m.id, null] as const;
          const signed = await getSignedUrl(m.avatar_url, 3600);
          return [m.id, signed] as const;
        })
      );
      const avMap: Record<string, string | null> = {};
      avatarPairs.forEach(([mid, url]) => (avMap[mid] = url));
      setMemberAvatarMap(avMap);

      // --- MATCHES (para stats y schedule)
      const nowIso = new Date().toISOString();

      // Terminados (para stats)
      const { data: finished, error: fErr } = await supabase
        .from("matches")
        .select(
          `
          id,home_team_id,away_team_id,
          score_home,score_away,
          scheduled_at,status,court_id
        `
        )
        .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
        .eq("status", "finished")
        .order("scheduled_at", { ascending: false });

      if (fErr) throw fErr;

      setFinishedMatches((finished ?? []) as MatchRow[]);
      setRecentMatches(((finished ?? []) as MatchRow[]).slice(0, 10)); // <- derivado

      // Próximos (schedule futuro)
      const { data: upc, error: uErr } = await supabase
        .from("matches")
        .select(
          `
          id,home_team_id,away_team_id,
          score_home,score_away,
          scheduled_at,status,court_id
        `
        )
        .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
        .in("status", ["scheduled", "playing"])
        .gte("scheduled_at", nowIso)
        .order("scheduled_at", { ascending: true });

      if (uErr) throw uErr;

      setUpcomingMatches((upc ?? []) as MatchRow[]);

      // // Recientes (últimos terminados para mostrar debajo)
      // const { data: rec, error: rErr } = await supabase
      //   .from("matches")
      //   .select(
      //     "id,home_team_id,away_team_id,score_home,score_away,scheduled_at,status,court_id"
      //   )
      //   .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
      //   .eq("status", "finished")
      //   .order("scheduled_at", { ascending: false })
      //   .limit(10);
      // if (rErr) throw rErr;
      // setRecentMatches((rec ?? []) as MatchRow[]);

      // Resolver nombres de equipos y canchas usados en schedule
      const teamIds = new Set<string>();
      const courtIds = new Set<string>();

      [...(upc ?? []), ...(finished ?? [])].forEach((m: any) => {
        teamIds.add(m.home_team_id);
        teamIds.add(m.away_team_id);
        if (m.court_id) courtIds.add(m.court_id);
      });

      if (teamIds.size) {
        const { data: tData, error: tErr } = await supabase
          .from("teams")
          .select("id,name,logo_url")
          .in("id", Array.from(teamIds));
        if (tErr) throw tErr;
        const tMap: Record<string, TeamLite> = {};
        (tData ?? []).forEach((t) => (tMap[t.id] = t as TeamLite));
        setTeamsMap(tMap);
      } else {
        setTeamsMap({});
      }

      if (courtIds.size) {
        const { data: cData, error: cErr } = await supabase
          .from("courts")
          .select("id,name")
          .in("id", Array.from(courtIds));
        if (cErr) throw cErr;
        const cMap: Record<string, CourtLite> = {};
        (cData ?? []).forEach((c) => (cMap[c.id] = c));
        setCourtsMap(cMap);
      } else {
        setCourtsMap({});
      }

      if (fErr) console.error("finished error", fErr);
      if (uErr) console.error("upcoming error", uErr);
    } catch (err) {
      console.error("Error fetching team data:", err);
    } finally {
      setLoading(false);
    }
  };

  async function fetchMyMembership(teamId: string, uid: string) {
    const { data, error } = await supabase
      .from("team_members")
      .select("team_id,user_id,role,status")
      .eq("team_id", teamId)
      .eq("user_id", uid)
      .maybeSingle();

    if (!error) setMyMembership((data as any) ?? null);
  };

  // --------- Stats ----------
  const stats = useMemo(() => {
    if (!team) return null;
    let games = 0;
    let wins = 0;
    let losses = 0;
    let pf = 0; // points for
    let pa = 0; // points against

    finishedMatches.forEach((m) => {
      games += 1;
      const isHome = m.home_team_id === team.id;
      const mine = isHome ? m.score_home ?? 0 : m.score_away ?? 0;
      const opp = isHome ? m.score_away ?? 0 : m.score_home ?? 0;
      pf += mine;
      pa += opp;
      if (mine > opp) wins += 1;
      else if (mine < opp) losses += 1;
    });

    const winRate = games ? Math.round((wins / games) * 100) : 0;

    // streak (últimos partidos)
    let streak = 0;
    for (const m of finishedMatches) {
      const isHome = m.home_team_id === team.id;
      const mine = isHome ? m.score_home ?? 0 : m.score_away ?? 0;
      const opp = isHome ? m.score_away ?? 0 : m.score_home ?? 0;
      const won = mine > opp;
      if (streak === 0) {
        streak = won ? 1 : -1;
      } else if ((streak > 0 && won) || (streak < 0 && !won)) {
        streak += won ? 1 : -1;
      } else {
        break;
      }
    }

    return { games, wins, losses, pf, pa, winRate, streak };
  }, [finishedMatches, team]);

  // --------- Schedule helpers ----------
  const fmtDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString();
  };

  const opponentOf = useCallback(
    (m: MatchRow, teamId: string) => {
      const oppId = m.home_team_id === teamId ? m.away_team_id : m.home_team_id;
      return teamsMap[oppId];
    },
    [teamsMap]
  );

  // ADD: acciones para unirse / pedir / cancelar / salir
  const handleJoinNow = async () => {
    if (!team || !myUid) return;
    const { error } = await supabase.from("team_members").insert({
      team_id: team.id,
      user_id: myUid,
      role: "player",
      status: "active", // público + sin aprobación
    });
    if (!error) await fetchMyMembership(team.id, myUid);
  };

  const handleRequestJoin = async () => {
    console.log("handleRequestJoin");
    if (!team || !myUid) return;
    const { data, error } = await supabase.from("team_members").insert({
      team_id: team.id,
      user_id: myUid,
      role: "player",
      status: "pending", // requiere aprobación o equipo no público
    });
    if (error) console.error("join-now insert error", error, { data });
    if (!error) await fetchMyMembership(team.id, myUid);
  };

  const handleCancelRequest = async () => {
    if (!team || !myUid) return;
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("team_id", team.id)
      .eq("user_id", myUid)
      .eq("status", "pending");
    if (!error) await fetchMyMembership(team.id, myUid);
  };

  const handleLeaveTeam = async () => {
    if (!team || !myUid) return;
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("team_id", team.id)
      .eq("user_id", myUid)
      .eq("status", "active");
    if (!error) await fetchMyMembership(team.id, myUid);
  };

  const handleDeleteTeam = () => {
    if (!team || !myUid || !isCaptain || deletingTeam) return;

    Alert.alert(
      "Delete team",
      "This action cannot be undone. All members and matches linked to this team may be removed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingTeam(true);

              // Si hay FKs sin ON DELETE CASCADE, esto puede fallar con error de constraint:
              const { error } = await supabase
                .from("teams")
                .delete()
                .eq("id", team.id);

              if (error) {
                console.error("delete team error", error);
                Alert.alert(
                  "Error",
                  error.message ?? "Could not delete team. Please try again."
                );
                setDeletingTeam(false);
                return;
              }

              // Volvés a la lista de equipos
              router.push("/teams");
            } catch (e) {
              console.error("delete team exception", e);
              Alert.alert("Error", "Unexpected error deleting team.");
              setDeletingTeam(false);
            }
          },
        },
      ]
    );
  };

  // --------- UI ----------
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!team) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Team not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const rosterData = activeTab === "roster" ? members : [];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Team Profile",
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ padding: 8 }}
            >
              <ArrowLeft color={Colors.text} size={24} />
            </TouchableOpacity>
          ),
        }}
      />

      <FlatList
        style={styles.container}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                {teamLogoSigned ? (
                  <Image source={{ uri: teamLogoSigned }} style={styles.logo} />
                ) : (
                  <View style={styles.logoPlaceholder}>
                    <Text style={styles.logoText}>{team.name[0]}</Text>
                  </View>
                )}
              </View>

              <Text style={styles.teamName}>{team.name}</Text>
              <Text style={styles.teamDesc}>
                {team.description || "No description provided"}
              </Text>
              <Text style={styles.established}>
                Est. {new Date(team.created_at).getFullYear()}
              </Text>

              {/* CTA de membresía */}
              {!isCaptain && myUid && (
                <View style={{ marginTop: 16, gap: 8, alignItems: "center" }}>
                  {!myMembership &&
                    (team.is_public && !team.requires_approval ? (
                      <TouchableOpacity
                        style={styles.followButton}
                        onPress={handleJoinNow}
                      >
                        <Text style={styles.followText}>Join team</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.followButton}
                        onPress={handleRequestJoin}
                      >
                        <Text style={styles.followText}>Request to join</Text>
                      </TouchableOpacity>
                    ))}

                  {myMembership?.status === "pending" && (
                    <>
                      <View
                        style={[
                          styles.followButton,
                          { backgroundColor: Colors.surface },
                        ]}
                      >
                        <Text style={[{ color: Colors.textSecondary }]}>
                          Pending approval
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.followButton,
                          { backgroundColor: Colors.error },
                        ]}
                        onPress={handleCancelRequest}
                      >
                        <Text style={[styles.followText, { color: "white" }]}>
                          Cancel request
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {myMembership?.status === "active" && (
                    <TouchableOpacity
                      style={[
                        styles.followButton,
                        { backgroundColor: Colors.error },
                      ]}
                      onPress={handleLeaveTeam}
                    >
                      <Text style={[styles.followText, { color: "white" }]}>
                        Leave team
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {isCaptain && myUid && (
                <View style={{ marginTop: 16, gap: 8, alignItems: "center" }}>
                  <TouchableOpacity
                    style={[
                      styles.followButton,
                      { backgroundColor: Colors.error },
                    ]}
                    onPress={handleDeleteTeam}
                    disabled={deletingTeam}
                  >
                    {deletingTeam ? (
                      <ActivityIndicator size="small" color={Colors.white} />
                    ) : (
                      <Text style={[styles.followText, { color: "white" }]}>
                        Delete team
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* Tabs */}
              <View style={styles.tabs}>
                {(["roster", "stats", "schedule"] as const).map((tab) => (
                  <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === tab && styles.tabTextActive,
                      ]}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Text>
                    {activeTab === tab && <View style={styles.tabUnderline} />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sections header per tab */}
            {activeTab === "roster" && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Team Members</Text>
              </View>
            )}

            {activeTab === "stats" && (
              <View style={[styles.section, { gap: 12 }]}>
                <Text style={styles.sectionTitle}>Team Stats</Text>

                <View style={styles.statsRow}>
                  <StatBox label="Games" value={stats?.games ?? 0} />
                  <StatBox label="Wins" value={stats?.wins ?? 0} />
                  <StatBox label="Losses" value={stats?.losses ?? 0} />
                </View>

                <View style={styles.statsRow}>
                  <StatBox label="Win Rate" value={`${stats?.winRate ?? 0}%`} />
                  <StatBox label="PF" value={stats?.pf ?? 0} />
                  <StatBox label="PA" value={stats?.pa ?? 0} />
                </View>

                <View style={styles.statsRow}>
                  <StatBox
                    label="Streak"
                    value={
                      !stats?.streak
                        ? "—"
                        : stats.streak > 0
                        ? `W${stats.streak}`
                        : `L${Math.abs(stats.streak)}`
                    }
                  />
                </View>
              </View>
            )}

            {activeTab === "schedule" && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Upcoming</Text>
                </View>
                {upcomingMatches.length === 0 && (
                  <Text style={styles.emptyText}>No upcoming matches.</Text>
                )}
              </>
            )}
          </>
        }
        data={
          activeTab === "roster"
            ? rosterData
            : activeTab === "schedule"
            ? upcomingMatches
            : []
        }
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => {
          if (activeTab === "roster") {
            const mem = item as Member;
            const signedAvatar = memberAvatarMap[mem.id];
            const isMe = myUid === mem.id;
            return (
              <TouchableOpacity
                style={styles.memberCard}
                activeOpacity={isMe ? 1 : 0.7}
                onPress={() => {
                  if (!isMe)
                    router.push({
                      pathname: "/player/[id]",
                      params: { id: mem.id },
                    });
                }}
              >
                <View style={styles.memberRow}>
                  <Image
                    source={{
                      uri:
                        signedAvatar ||
                        "https://placehold.co/120x120.png?text=%F0%9F%91%A4",
                    }}
                    style={styles.avatar}
                  />
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {isMe ? "You" : mem.display_name}
                    </Text>
                    <Text style={styles.memberRole}>{mem.role}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }

          if (activeTab === "schedule") {
            const m = item as MatchRow;
            const opp = opponentOf(m, team.id);
            const court = m.court_id ? courtsMap[m.court_id] : undefined;

            return (
              <View style={styles.matchCard}>
                <View style={styles.matchRow}>
                  {/* Rival (solo inicial si no hay logo; opcional: firmar logo si lo necesitás) */}
                  <View style={styles.opponentLogo}>
                    {opp?.logo_url ? (
                      <Image
                        source={{ uri: opp.logo_url }} // si es storage path, podés firmarlo con getSignedUrl si querés mostrar el logo real
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <View style={styles.logoPlaceholderMini}>
                        <Text
                          style={{ color: Colors.textMuted, fontWeight: "700" }}
                        >
                          {opp?.name?.[0] ?? "?"}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.matchOpponent}>
                      vs {opp?.name ?? "TBD"}
                    </Text>
                    <Text style={styles.matchMeta}>
                      {fmtDateTime(m.scheduled_at)}
                    </Text>
                    {court?.name && (
                      <Text style={styles.matchMeta}>
                        {court.name}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text
                      style={[
                        styles.matchStatus,
                        m.status === "scheduled" || m.status === "pending"
                          ? { color: Colors.primary }
                          : { color: Colors.textSecondary },
                      ]}
                    >
                      {m.status}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }

          return null;
        }}
        ListFooterComponent={
          activeTab === "schedule" && recentMatches.length > 0 ? (
            <>
              <View style={[styles.section, { marginTop: 8 }]}>
                <Text style={styles.sectionTitle}>Recent Results</Text>
              </View>
              {recentMatches.map((m) => {
                const opp = opponentOf(m, team.id);
                const isHome = m.home_team_id === team.id;
                const mine = isHome ? m.score_home ?? 0 : m.score_away ?? 0;
                const oppScore = isHome ? m.score_away ?? 0 : m.score_home ?? 0;
                const outcome =
                  mine > oppScore ? "W" : mine < oppScore ? "L" : "D";

                return (
                  <View key={m.id} style={styles.resultCard}>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultOpponent}>
                        {isHome ? "Home" : "Away"} vs {opp?.name ?? "TBD"}
                      </Text>
                      <Text
                        style={[
                          styles.resultScore,
                          outcome === "W"
                            ? { color: Colors.success }
                            : outcome === "L"
                            ? { color: Colors.error }
                            : { color: Colors.textSecondary },
                        ]}
                      >
                        {outcome} {mine}-{oppScore}
                      </Text>
                    </View>
                    <Text style={styles.matchMetaSmall}>
                      {fmtDateTime(m.scheduled_at)}
                    </Text>
                  </View>
                );
              })}
            </>
          ) : null
        }
      />
    </>
  );
}

function StatBox({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  errorText: { color: Colors.error, fontSize: 18, fontWeight: "600" },
  backText: { color: Colors.primary, marginTop: 8 },

  header: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  logo: { width: "100%", height: "100%", resizeMode: "cover" },
  logoPlaceholder: {
    backgroundColor: Colors.surfaceLight,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: { fontSize: 40, fontWeight: "700", color: Colors.textMuted },
  teamName: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 4,
  },
  teamDesc: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  established: { fontSize: 14, color: Colors.textMuted, marginTop: 4 },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabText: { fontSize: 16, color: Colors.textSecondary, paddingBottom: 8 },
  tabTextActive: { color: Colors.primary, fontWeight: "700" },
  tabUnderline: {
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginTop: -3,
  },

  section: { paddingHorizontal: 24, paddingTop: 24 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },

  // Roster
  memberCard: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  memberRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 16 },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 18, fontWeight: "600", color: Colors.text },
  memberRole: { fontSize: 14, color: Colors.textSecondary },

  emptyText: {
    textAlign: "center",
    color: Colors.textSecondary,
    marginVertical: 20,
  },

  // Stats
  statsRow: { flexDirection: "row", gap: 12, paddingHorizontal: 16 },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 6,
  },
  statValue: { fontSize: 20, fontWeight: "700", color: Colors.text },
  statLabel: { fontSize: 12, color: Colors.textSecondary },

  // Schedule
  matchCard: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  matchRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  opponentLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: Colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  logoPlaceholderMini: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  matchOpponent: { fontSize: 16, fontWeight: "600", color: Colors.text },
  matchMeta: { fontSize: 12, color: Colors.textSecondary },
  matchStatus: { fontSize: 12, fontWeight: "700" },

  resultCard: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultOpponent: { fontSize: 14, color: Colors.text },
  resultScore: { fontSize: 14, fontWeight: "700" },
  matchMetaSmall: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },

  followButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 16,
  },
  followText: { color: Colors.white, fontWeight: "600", fontSize: 16 },
});
