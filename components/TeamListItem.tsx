import Text from '@/components/AppText';
// components/TeamListItem.tsx
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Users as UsersIcon } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useSignedUrl } from '@/hooks/use-signed-url';

export default function TeamListItem({ team }: { team: any }) {
  const router = useRouter();
  const signedLogo = useSignedUrl(team.logo_url); // firma team_logos/...
  console.log("Signed Logo", signedLogo)
  return (
    <TouchableOpacity
      style={styles.teamCard}
      onPress={() =>
        router.push({ pathname: '/team/[id]', params: { id: String(team.id) } })
      }
    >
      <View style={styles.row}>
        <View style={styles.logoWrapper}>
          {signedLogo ? (
            <Image source={{ uri: signedLogo }} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <UsersIcon color={Colors.textMuted} size={24} />
            </View>
          )}
        </View>
        <Text style={styles.name}>{team.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  teamCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoWrapper: {
    width: 48, height: 48, borderRadius: 24, overflow: 'hidden',
    backgroundColor: Colors.surfaceLight, justifyContent: 'center', alignItems: 'center',
  },
  logo: { width: '100%', height: '100%', resizeMode: 'cover' },
  logoPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '600', color: Colors.text },
});
