import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Plus, Users as UsersIcon } from 'lucide-react-native';
import Colors from '@/constants/colors';
import HeaderMenu from '@/components/HeaderMenu';

export default function TeamsScreen() {
  const router = useRouter();

  const handleCreateTeam = () => {
    router.push('/create-team/step1');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Teams', headerStyle: { backgroundColor: Colors.surface }, headerTintColor: Colors.text, headerRight: () => <HeaderMenu /> }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Teams</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateTeam}>
            <Plus color={Colors.white} size={20} />
            <Text style={styles.createButtonText}>Create Team</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.teamsList}>
          {[
            { name: 'The Hoopers', members: 8, wins: 15, losses: 8, role: 'Member' },
            { name: 'Mission Ballers', members: 12, wins: 22, losses: 5, role: 'Captain' },
          ].map((team, index) => (
            <TouchableOpacity key={index} style={styles.teamCard}>
              <View style={styles.teamIcon}>
                <UsersIcon color={Colors.primary} size={32} />
              </View>
              <View style={styles.teamInfo}>
                <View style={styles.teamHeader}>
                  <Text style={styles.teamName}>{team.name}</Text>
                  <View style={[styles.roleBadge, team.role === 'Captain' && styles.captainBadge]}>
                    <Text style={styles.roleText}>{team.role}</Text>
                  </View>
                </View>
                <Text style={styles.teamStats}>
                  {team.members} members • {team.wins}W - {team.losses}L
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Discover Teams</Text>
            {[
              { name: 'Oakland Warriors', members: 15, wins: 18, losses: 10, isPublic: true },
              { name: 'SF Street Kings', members: 10, wins: 12, losses: 7, isPublic: true },
              { name: 'Bay Area Ballers', members: 20, wins: 25, losses: 12, isPublic: true },
            ].map((team, index) => (
              <TouchableOpacity key={index} style={styles.discoverCard}>
                <View style={styles.teamIcon}>
                  <UsersIcon color={Colors.secondary} size={28} />
                </View>
                <View style={styles.teamInfo}>
                  <Text style={styles.teamName}>{team.name}</Text>
                  <Text style={styles.teamStats}>
                    {team.members} members • {team.wins}W - {team.losses}L
                  </Text>
                </View>
                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>Join</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  createButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  createButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  teamsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  teamCard: {
    flexDirection: 'row' as const,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center' as const,
    gap: 16,
  },
  teamIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  teamInfo: {
    flex: 1,
    gap: 6,
  },
  teamHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  teamName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  roleBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  captainBadge: {
    backgroundColor: Colors.secondary,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  teamStats: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  discoverCard: {
    flexDirection: 'row' as const,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center' as const,
    gap: 12,
  },
  joinButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
