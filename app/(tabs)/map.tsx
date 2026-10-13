import { useState } from 'react';
import { ActivityIndicator, ScrollView, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import Text from '@/components/AppText';
import CourtMap from '@/components/courts/CourtMap';
import HeaderMenu from '@/components/HeaderMenu';
import Colors from '@/constants/colors';
import { useCourtCatalog } from '@/hooks/catalog';
import { filterCourts, type Coordinate } from '@/lib/courts/catalog';
import { locateUser } from '@/lib/courts/location';
import { usePublicSessions } from '@/hooks/pickup';
import { dateLabel, sessionGroups } from '@/lib/pickup/discovery';

export default function MapScreen() {
  const router = useRouter(); const catalog = useCourtCatalog();
  const activity = usePublicSessions();
  const playing = sessionGroups(activity.data ?? []).playing;
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState<Coordinate | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const courts = filterCourts(catalog.data ?? [], search);
  const openCourt = (id: string) => router.push({ pathname: '/court/[id]', params: { id } });
  async function findLocation() {
    if (locating) return;
    setLocating(true);
    const result = await locateUser(Location.requestForegroundPermissionsAsync,
      () => Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
    setLocation(result.point); setLocationMessage(result.message); setLocating(false);
  }
  return <>
    <Stack.Screen options={{ title: 'Courts', headerShown: true, headerStyle: { backgroundColor: Colors.surface }, headerTintColor: Colors.text, headerRight: () => <HeaderMenu /> }} />
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}>
      <TextInput accessibilityLabel="Search courts" placeholder="Search courts by name" placeholderTextColor={Colors.textMuted}
        value={search} onChangeText={setSearch} style={{ color: Colors.text, backgroundColor: Colors.surface, borderRadius: 12, padding: 16 }} />
      {Platform.OS !== 'web' && <TouchableOpacity accessibilityRole="button" disabled={locating} onPress={() => void findLocation()}>
        <Text style={{ color: Colors.primary }}>{locating ? 'Finding location...' : 'Use my location'}</Text>
      </TouchableOpacity>}
      {locationMessage && <Text accessibilityRole="alert" style={{ color: Colors.textSecondary }}>{locationMessage}</Text>}
      {catalog.isPending && <ActivityIndicator accessibilityLabel="Loading courts" color={Colors.primary} />}
      {catalog.isError && <View style={{ gap: 12 }}><Text accessibilityRole="alert" style={{ color: Colors.text }}>Unable to load courts. Please retry.</Text>
        <TouchableOpacity accessibilityRole="button" onPress={() => void catalog.refetch()}><Text style={{ color: Colors.primary }}>Retry</Text></TouchableOpacity></View>}
      {!catalog.isPending && !catalog.isError && <>
        <CourtMap courts={courts} location={location} onSelect={openCourt} />
        <Text style={{ color: Colors.text, fontSize: 22 }}>Court catalog ({courts.length})</Text>
        {activity.isPending && <ActivityIndicator accessibilityLabel="Checking reported games" color={Colors.primary} />}
        {activity.isError && <View style={{ gap: 8 }}><Text accessibilityRole="alert" style={{ color: Colors.text }}>Unable to check court activity. Previous reports may be outdated.</Text>
          <TouchableOpacity accessibilityRole="button" onPress={() => void activity.refetch()}><Text style={{ color: Colors.primary }}>Retry activity</Text></TouchableOpacity></View>}
        {activity.data && <Text style={{ color: Colors.textSecondary }}>Activity last checked {dateLabel(activity.dataUpdatedAt)}</Text>}
        {courts.length === 0 && <Text style={{ color: Colors.textSecondary }}>{catalog.data?.length ? 'No courts match your search.' : 'No courts are available yet.'}</Text>}
        {courts.map(court => <TouchableOpacity accessibilityRole="button" accessibilityLabel={`View ${court.name}`} key={court.id} onPress={() => openCourt(court.id)}
          style={{ backgroundColor: Colors.surface, padding: 18, borderRadius: 12, gap: 8 }}>
          <Text style={{ color: Colors.text, fontSize: 18 }}>{court.name}</Text>
          <Text style={{ color: Colors.textSecondary }}>{court.surface || 'Surface not recorded'}</Text>
          {playing.some(game => game.court_id === court.id) && <Text style={{ color: '#ff8a43' }}>Playing · reported by organizer{activity.isError ? ' · check failed' : ''}</Text>}
          <Text style={{ color: Colors.primary }}>View details</Text>
        </TouchableOpacity>)}
      </>}
    </ScrollView>
  </>;
}
