import CourtMembership from '@/components/courts/CourtMembership';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { MapPin, CalendarDays, Layers, Lightbulb, RectangleHorizontal } from 'lucide-react-native';
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
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, 680) - spacing.md * 2;
  return <ScrollView style={{ flex: 1, backgroundColor: palette.cream }} contentContainerStyle={{ padding: spacing.md, gap: spacing.md, paddingBottom: spacing.section, maxWidth: 680, width: '100%', alignSelf: 'center' }}>
    <Stack.Screen options={{ title: 'Canchas', headerBackButtonDisplayMode: 'minimal', headerTitleAlign: 'center', headerStyle: { backgroundColor: palette.cream }, headerTintColor: palette.navy, headerShadowVisible: false }} />
    {catalog.isPending ? <Panel tone="light"><StateView title="Cargando cancha" loading /></Panel> : catalog.isError ?
      <Panel tone="light"><StateView title="No pudimos cargar esta cancha" kind="error" action={<Button label="Reintentar" onPress={() => void catalog.refetch()} />} /></Panel>
      : court ? <>
        <View style={{ gap: spacing.xs }}>
          <Text variant="display" tone="light" accessibilityRole="header" accessibilityHint="Ilustración genérica de básquet; no es una fotografía ni representa esta cancha.">{court.name}</Text>
          <GenericMedia size={contentWidth} height={Math.min(190, contentWidth * .52)} showCaption={false} imageBackground={palette.navy} />
        </View>
        <Panel style={{ backgroundColor: palette.navy, borderColor: palette.navy, padding: spacing.md, gap: spacing.sm }}>
          <Text variant="display" tone="dark" style={{ fontSize: 26, lineHeight: 34 }} accessibilityRole="header">Sobre la cancha</Text>
          {[
            { label: 'Superficie', value: court.surface || 'Sin registrar', Icon: Layers },
            { label: 'Tamaño', value: court.half_court === null ? 'Sin registrar' : court.half_court ? 'Media cancha' : 'Cancha completa', Icon: RectangleHorizontal },
            { label: 'Iluminación', value: court.lighting || 'Sin registrar', Icon: Lightbulb },
          ].map(({ label, value, Icon }) => <View key={label} style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center' }}>
            <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><Icon size={22} color={palette.cream} /></View>
            <View style={{ flex: 1, minWidth: 0, backgroundColor: palette.surface, paddingVertical: spacing.sm, paddingHorizontal: spacing.sm, borderRadius: 8 }}>
              <Text variant="caption" style={{ color: palette.muted, lineHeight: 24 }}>{label}: <Text variant="label" style={{ fontSize: 14, lineHeight: 24, color: palette.text }}>{value}</Text></Text>
            </View>
          </View>)}
          {Boolean(court.notes) && <Text variant="caption" tone="dark">{court.notes}</Text>}
          <Button quiet tone="dark" style={{ alignSelf: 'flex-start' }} icon={<MapPin size={18} color={palette.text} />} label="Ver ubicación en el mapa" onPress={() => router.dismissTo({ pathname: '/map', params: { focusCourtId: court.id, focusCourtRequest: String(Date.now()) } })} />
        </Panel>
        <Panel tone="light" style={{ borderColor: palette.muted, padding: spacing.md, gap: spacing.sm }}>
          <Button tone="light" foregroundColor={palette.navy} style={{ backgroundColor: palette.orange, borderColor: palette.orange }} label="Armar partido" icon={<CalendarDays size={20} color={palette.navy} />} onPress={() => router.push({ pathname: '/organize/create', params: { courtId: court.id } })} />
          <CourtMembership key={court.id} courtId={court.id} embedded />
        </Panel>
        <Panel style={{ backgroundColor: palette.navy, borderColor: palette.navy, padding: spacing.md, gap: spacing.sm }}>
          <CourtActivity courtId={court.id} courtName={court.name} arcade />
        </Panel>
      </> : <Panel tone="light"><StateView title="Cancha no encontrada" /></Panel>}
  </ScrollView>;
}
