import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Settings, Trophy, TrendingUp, Users as UsersIcon, LogOut } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Profile', headerStyle: { backgroundColor: Colors.surface }, headerTintColor: Colors.text }} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.display_name?.charAt(0) || 'U'}</Text>
          </View>
          <Text style={styles.name}>{user?.display_name || 'User'}</Text>
          <Text style={styles.bio}>{user?.bio || 'Basketball enthusiast'}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Level {user?.level || 1}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user?.games_played || 0}</Text>
            <Text style={styles.statLabel}>Games</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user?.games_won || 0}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {user?.games_played ? Math.round(((user?.games_won || 0) / user.games_played) * 100) : 0}%
            </Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stats</Text>
          <View style={styles.statRow}>
            <Text style={styles.statRowLabel}>Points Per Game</Text>
            <Text style={styles.statRowValue}>
              {user?.games_played ? ((user?.points_total || 0) / user.games_played).toFixed(1) : '0.0'}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statRowLabel}>Assists</Text>
            <Text style={styles.statRowValue}>
              {user?.games_played ? ((user?.assists_total || 0) / user.games_played).toFixed(1) : '0.0'}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statRowLabel}>Rebounds</Text>
            <Text style={styles.statRowValue}>
              {user?.games_played ? ((user?.rebounds_total || 0) / user.games_played).toFixed(1) : '0.0'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.achievementCard}>
                <Trophy color={Colors.secondary} size={32} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <TrendingUp color={Colors.primary} size={20} />
              <Text style={styles.menuItemText}>View Detailed Statistics</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <UsersIcon color={Colors.primary} size={20} />
              <Text style={styles.menuItemText}>My Teams</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Settings color={Colors.primary} size={20} />
              <Text style={styles.menuItemText}>App Settings</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
            <View style={styles.menuItemLeft}>
              <LogOut color={Colors.error} size={20} />
              <Text style={[styles.menuItemText, { color: Colors.error }]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center' as const,
    padding: 24,
    gap: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  name: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  bio: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center' as const,
  },
  levelBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  statsGrid: {
    flexDirection: 'row' as const,
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center' as const,
    gap: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  statRowLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  statRowValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  achievementsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
  },
  achievementCard: {
    width: 80,
    height: 80,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  menuItem: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.text,
  },
});
