import { useLocalSearchParams, Stack } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import Colors from '@/constants/colors';
import { useUserById } from '@/hooks/profile';
import { getSignedAvatarUrl } from '@/lib/backend/storage';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/backend/supabase';

type PlayerAchievement = {
  id: string;
  name: string;
};

export default function PlayerProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: player } = useUserById(id);
  const [avatar, setAvatar] = useState<string | null>(null);

  const [achievements, setAchievements] = useState<PlayerAchievement[]>([]);
  const [loadingAchievements, setLoadingAchievements] = useState(false);

  // Avatar firmado
  useEffect(() => {
    (async () => {
      const avatarUrl = await getSignedAvatarUrl(player?.avatar_url ?? null);
      setAvatar(avatarUrl);
    })();
  }, [player?.avatar_url]);

  // Achievements del jugador
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoadingAchievements(true);
        const { data, error } = await supabase
          .from('user_achievements')
          .select(`
            achievement_id,
            achievement:achievements (
              id,
              name
            )
          `)
          .eq('user_id', id);

        if (error) throw error;

        const mapped: PlayerAchievement[] =
          (data ?? []).map((row: any) => ({
            id: row.achievement.id,
            name: row.achievement.name,
          })) ?? [];

        setAchievements(mapped);
      } catch (e) {
        console.error('error loading achievements', e);
        setAchievements([]);
      } finally {
        setLoadingAchievements(false);
      }
    })();
  }, [id]);

  const level = player?.level ?? 1;
  const games = player?.games_played ?? 0;
  const points = player?.points_total ?? 0;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Player Profile',
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
        }}
      />
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                style={{ width: '100%', height: '100%' }}
              />
            ) : null}
          </View>
          <Text style={styles.name}>{player?.display_name ?? 'Player'}</Text>
          <Text style={styles.subtle}>Level {player?.level ?? 1}</Text>
        </View>

        {/* Fields present in the inspected profile contract. */}
        <View style={styles.topStatsRow}>
          <TopMetric label="Level" value={String(level)} />
          <TopMetric label="Games" value={String(games)} />
          <TopMetric label="Points" value={String(points)} />
        </View>

        {/* Stats (PPG, APG, RPG) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stats</Text>
          <View style={styles.stats}>
            <Metric title="Points Per Game" value={ppg(player)} />
            <Metric title="Assists" value={apg(player)} />
            <Metric title="Rebounds" value={rpg(player)} />
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>

          {loadingAchievements ? (
            <View style={styles.achievementsLoading}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.achievementsLoadingText}>Loading…</Text>
            </View>
          ) : achievements.length === 0 ? (
            <Text style={styles.noAchievementsText}>
              No achievements yet.
            </Text>
          ) : (
            <View style={styles.achievementsGrid}>
              {achievements.map((a) => (
                <View key={a.id} style={styles.achievementCard}>
                  <View style={styles.achievementIcon}>
                    <Text style={styles.achievementEmoji}>🏀</Text>
                  </View>
                  <Text style={styles.achievementName} numberOfLines={2}>
                    {a.name}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

// helpers de stats
function ppg(u: any) {
  return u?.games_played
    ? ((u?.points_total || 0) / u.games_played).toFixed(1)
    : '0.0';
}
function apg(u: any) {
  return u?.games_played
    ? ((u?.assists_total || 0) / u.games_played).toFixed(1)
    : '0.0';
}
function rpg(u: any) {
  return u?.games_played
    ? ((u?.rebounds_total || 0) / u.games_played).toFixed(1)
    : '0.0';
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function TopMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <View style={styles.topMetric}>
      <Text style={styles.topMetricValue}>{value}</Text>
      <Text style={styles.topMetricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: { alignItems: 'center', padding: 24, gap: 8 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
  },
  subtle: { color: Colors.textSecondary },

  // Rank / Games / Wins
  topStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  topMetric: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topMetricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  topMetricLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },

  stats: { gap: 12 },
  metric: { backgroundColor: Colors.surface, padding: 16, borderRadius: 12 },
  metricTitle: { color: Colors.textSecondary, marginBottom: 6 },
  metricValue: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '700',
  },

  // Achievements
  achievementsLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  achievementsLoadingText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  noAchievementsText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementIcon: {
    marginBottom: 8,
  },
  achievementEmoji: {
    fontSize: 32,
  },
  achievementName: {
    textAlign: 'center',
    color: Colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
});
