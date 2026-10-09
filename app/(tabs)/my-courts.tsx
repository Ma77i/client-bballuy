import { ActivityIndicator, ScrollView, RefreshControl, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Text from '@/components/AppText';
import Colors from '@/constants/colors';
import { useMyCourts } from '@/hooks/courts';
export default function MyCourtsScreen() {
  const router = useRouter(); const membership = useMyCourts();
  return <>
    <Stack.Screen options={{ title: 'My Courts', headerShown: true, headerStyle: { backgroundColor: Colors.surface }, headerTintColor: Colors.text }} />
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ padding: 20, gap: 16 }}
      refreshControl={<RefreshControl refreshing={membership.isFetching && !membership.isPending} onRefresh={() => void membership.refetch()} tintColor={Colors.primary} />}>
      <Text style={{ color: Colors.textSecondary }}>The court communities you belong to. Your membership stays until you leave.</Text>
      <TouchableOpacity accessibilityRole="button" onPress={() => void membership.refetch()}><Text style={{ color: Colors.primary }}>Refresh</Text></TouchableOpacity>
      {membership.isPending ? <ActivityIndicator accessibilityLabel="Loading my courts" color={Colors.primary} /> : membership.isError ? <View style={{ gap: 12 }}>
        <Text accessibilityRole="alert" style={{ color: Colors.text }}>Unable to load your courts.</Text>
        <TouchableOpacity accessibilityRole="button" onPress={() => void membership.refetch()}><Text style={{ color: Colors.primary }}>Retry</Text></TouchableOpacity>
      </View> : !membership.data?.length ? <>
        <Text style={{ color: Colors.text }}>You have not joined any courts yet.</Text>
        <TouchableOpacity accessibilityRole="button" onPress={() => router.navigate('/(tabs)/map')}><Text style={{ color: Colors.primary }}>Explore courts</Text></TouchableOpacity>
      </> : membership.data.map(row => <TouchableOpacity accessibilityRole="button" key={row.court_id}
        accessibilityLabel={`Open ${row.court_catalog?.name ?? 'court'}`}
        onPress={() => router.push({ pathname: '/court/[id]', params: { id: row.court_id } })}
        style={{ backgroundColor: Colors.surface, borderRadius: 12, padding: 18, gap: 8 }}>
        <Text style={{ color: Colors.text, fontSize: 20 }}>{row.court_catalog?.name ?? 'Court details unavailable'}</Text>
        <Text style={{ color: Colors.primary }}>View your court</Text>
      </TouchableOpacity>)}
    </ScrollView>
  </>;
}
