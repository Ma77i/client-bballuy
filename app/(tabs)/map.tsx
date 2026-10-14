import { useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useIsFocused } from 'expo-router/react-navigation';
import * as Location from 'expo-location';
import HeaderMenu from '@/components/HeaderMenu';
import CourtDiscovery from '@/components/courts/CourtDiscovery';
import { palette } from '@/constants/design';
import { useCourtCatalog } from '@/hooks/catalog';
import type { Coordinate } from '@/lib/courts/catalog';
import { locateUser } from '@/lib/courts/location';
import { usePublicSessions } from '@/hooks/pickup';
import { sessionGroups } from '@/lib/pickup/discovery';

export default function MapScreen() {
  const router = useRouter();
  const { focusCourtId, focusCourtRequest } = useLocalSearchParams<{ focusCourtId?: string | string[]; focusCourtRequest?: string | string[] }>();
  const catalog = useCourtCatalog();
  const activity = usePublicSessions();
  const focused = useIsFocused();
  const [location, setLocation] = useState<Coordinate | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  async function findLocation() {
    if (locating) return;
    setLocating(true);
    const result = await locateUser(Location.requestForegroundPermissionsAsync,
      () => Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
    setLocation(result.point);
    setLocationMessage(result.message ? 'No pudimos obtener tu ubicación. Podés seguir explorando todas las canchas.' : null);
    setLocating(false);
  }
  return <>
    <Stack.Screen options={{ title: 'Canchas', headerShown: true, headerStyle: { backgroundColor: palette.navy },
      headerTintColor: palette.text, headerRight: () => <HeaderMenu /> }} />
    {/* The tab navigator already reserves the bottom safe area. */}
    <CourtDiscovery courts={catalog.data ?? []} focused={focused} bottomInset={0}
      focusCourtId={typeof focusCourtId === 'string' ? focusCourtId : undefined}
      focusCourtRequest={typeof focusCourtRequest === 'string' ? focusCourtRequest : undefined}
      onFocusHandled={() => router.setParams({ focusCourtId: undefined, focusCourtRequest: undefined })}
      catalog={{ pending: catalog.isPending, error: catalog.isError, retry: () => void catalog.refetch() }}
      activity={{ pending: activity.isPending, error: activity.isError, retry: () => void activity.refetch(),
        playingCourtIds: sessionGroups(activity.data ?? []).playing.map(game => game.court_id),
        checkedAt: activity.data ? new Date(activity.dataUpdatedAt).toLocaleString('es-UY', { dateStyle: 'medium', timeStyle: 'short' }) : null }}
      location={location} locating={locating} locationMessage={locationMessage} onLocate={() => void findLocation()}
      onOpen={id => router.push({ pathname: '/court/[id]', params: { id } })} />
  </>;
}
