import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import {
  Settings,
  TrendingUp,
  Users as UsersIcon,
  LogOut,
  Clock,
  Edit,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useMe, useMyTeams, useUpdateMe } from "@/hooks/profile";
import AvatarUploader from "@/components/AvatarUploader";
import TeamListItem from "@/components/TeamListItem";

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { data: me } = useMe();
  const { data: teams } = useMyTeams();
  const updateMe = useUpdateMe();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/signin"); // va a splash -> routing tuyo
  };

  console.log("MY TEAMS: ", teams)

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Profile",
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View style={styles.header}>
          {me && (
            <AvatarUploader
              userId={me.id}
              avatarPath={me.avatar_url}
              onUploaded={(path) => updateMe.mutate({ avatar_url: path })}
              size={112}
            />
          )}
          <Text style={styles.name}>{me?.display_name || "User"}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Level {me?.level ?? 1}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <Stat value={me?.games_played ?? 0} label="Games" />
          <Stat value={me?.points_total ?? 0} label="Points" />
          <Stat value={me?.assists_total ?? 0} label="Assists" />
        </View>

        {/* My Teams */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Teams</Text>

          {teams && teams.length > 0 ? (
            teams.map((t: any) => <TeamListItem key={t.id} team={t} />)
          ) : (
            <Text style={{ color: Colors.textSecondary }}>
              You are not in any team yet.
            </Text>
          )}

          <MenuItem
            icon={<UsersIcon color={Colors.primary} size={20} />}
            text="Manage Teams"
            onPress={() => router.push('/teams')}
          />
        </View>

        {/* Mis estadisticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My statistics</Text>
          <MenuItem
            icon={<TrendingUp color={Colors.primary} size={20} />}
            text="View Detailed Statistics"
            onPress={() => Alert.alert("Coming soon")}
          />
        </View>

        {/* Historial de juegos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game History</Text>
          <MenuItem
            icon={<Clock color={Colors.primary} size={20} />}
            text="View Game History"
            onPress={() => Alert.alert("Coming soon")}
          />
        </View>

        {/* Configuraciones y logout */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <MenuItem
            icon={<Edit color={Colors.primary} size={20} />}
            text="Edit profile"
            onPress={() => Alert.alert("Coming soon")}
          />
          <MenuItem
            icon={<Settings color={Colors.primary} size={20} />}
            text="App Settings"
            onPress={() => Alert.alert("Coming soon")}
          />
          <MenuItem
            icon={<LogOut color={Colors.error} size={20} />}
            text="Logout"
            destructive
            onPress={handleSignOut}
          />
        </View>
      </ScrollView>
    </>
  );
}

function Stat({
  value,
  label,
  suffix = "",
}: {
  value: number | string;
  label: string;
  suffix?: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>
        {value}
        {suffix}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuItem({ icon, text, onPress, destructive }: any) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        {icon}
        <Text
          style={[styles.menuItemText, destructive && { color: Colors.error }]}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { alignItems: "center", padding: 24, gap: 12 },
  name: { fontSize: 24, fontWeight: "700" as const, color: Colors.text },
  bio: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center" as const,
  },
  levelBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: { fontSize: 14, fontWeight: "600" as const, color: Colors.white },
  statsGrid: {
    flexDirection: "row" as const,
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: "center" as const,
    gap: 8,
  },
  statValue: { fontSize: 28, fontWeight: "700" as const, color: Colors.text },
  statLabel: { fontSize: 14, color: Colors.textSecondary },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  cardText: { color: Colors.text, fontSize: 16 },
  menuItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
  },
  menuItemText: { fontSize: 16, color: Colors.text },
  teamRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  teamLogoWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: Colors.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
  },
  teamLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  teamLogoPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
