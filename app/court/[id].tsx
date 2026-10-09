import CourtMembership from '@/components/courts/CourtMembership';
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import Text from '@/components/AppText';
import Colors from '@/constants/colors';
import { useCourtCatalog } from '@/hooks/catalog';
export default function CourtDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const catalog = useCourtCatalog();
  const court = catalog.data?.find(row => row.id === id);
  return <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ padding: 24, gap: 20 }}>
    <Stack.Screen options={{ title: court?.name ?? 'Court details', headerStyle: { backgroundColor: Colors.surface }, headerTintColor: Colors.text }} />
    {catalog.isPending ? <ActivityIndicator accessibilityLabel="Loading court" color={Colors.primary} /> : catalog.isError ? <>
      <Text style={{ color: Colors.text }}>Unable to load this court.</Text>
      <TouchableOpacity accessibilityRole="button" onPress={() => void catalog.refetch()}><Text style={{ color: Colors.primary }}>Retry</Text></TouchableOpacity>
    </> : court ? <>
      <Text style={{ color: Colors.text, fontSize: 26 }}>{court.name}</Text>
      <Text style={{ color: Colors.textSecondary }}>Location: {court.latitude.toFixed(6)}, {court.longitude.toFixed(6)}</Text>
      <Text style={{ color: Colors.text }}>Court size: {court.half_court === null ? 'Not recorded' : court.half_court ? 'Half court' : 'Full court'}</Text>
      <Text style={{ color: Colors.text }}>Surface: {court.surface || 'Not recorded'}</Text>
      <Text style={{ color: Colors.text }}>Lighting: {court.lighting || 'Not recorded'}</Text>
      <CourtMembership key={court.id} courtId={court.id} />
      {court.notes && <Text style={{ color: Colors.text }}>{court.notes}</Text>}
    </> : <Text style={{ color: Colors.text }}>Court not found.</Text>}
  </ScrollView>;
}
