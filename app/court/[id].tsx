import CourtMembership from '@/components/courts/CourtMembership';
import { ScrollView } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Text from '@/components/AppText';
import { Button, Panel, StateView } from '@/components/foundation/Primitives';
import { GenericMedia } from '@/components/foundation/GenericMedia';
import { palette, spacing } from '@/constants/design';
import { useCourtCatalog } from '@/hooks/catalog';
import CourtActivity from '@/components/pickup/CourtActivity';
export default function CourtDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const catalog = useCourtCatalog();
  const court = catalog.data?.find(row => row.id === id);
  return <ScrollView style={{ flex: 1, backgroundColor: palette.navy }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.section }}>
    <Stack.Screen options={{ title: court?.name ?? 'Detalle de cancha', headerBackTitle: 'Volver', headerStyle: { backgroundColor: palette.navy }, headerTintColor: palette.text }} />
    {catalog.isPending ? <StateView title="Cargando cancha" loading /> : catalog.isError ?
      <StateView title="No pudimos cargar esta cancha" kind="error" action={<Button label="Reintentar" onPress={() => void catalog.refetch()} />} />
      : court ? <>
        <Panel tone="light" style={{ borderLeftWidth: 5, borderLeftColor: palette.orange, gap: spacing.sm }}>
          <Text variant="display" tone="light" accessibilityRole="header">{court.name}</Text>
          <GenericMedia compact size={48} />
          <Text variant="body" tone="light">Tamaño: {court.half_court === null ? 'Sin registrar' : court.half_court ? 'Media cancha' : 'Cancha completa'}</Text>
          <Text variant="body" tone="light">Superficie: {court.surface || 'Sin registrar'}</Text>
          <Text variant="body" tone="light">Iluminación: {court.lighting || 'Sin registrar'}</Text>
          <Button secondary tone="light" label="Ver ubicación en el mapa" onPress={() => router.dismissTo({ pathname: '/map', params: { focusCourtId: court.id, focusCourtRequest: String(Date.now()) } })} />
          <Text variant="caption" tone="light">Coordenadas: {court.latitude.toFixed(6)}, {court.longitude.toFixed(6)}</Text>
          {Boolean(court.notes) && <Text variant="body" tone="light">{court.notes}</Text>}
        </Panel>
        <Button label="Organizar convocatoria" onPress={() => router.push({ pathname: '/organize/create', params: { courtId: court.id } })} />
        <CourtMembership key={court.id} courtId={court.id} />
        <CourtActivity courtId={court.id} courtName={court.name} arcade />
      </> : <StateView title="Cancha no encontrada" />}
  </ScrollView>;
}
