import { registerRootComponent } from 'expo';
import { useState } from 'react';
import { useFonts } from 'expo-font';
import { View, useWindowDimensions } from 'react-native';
import { fontAssets } from '../../constants/font-assets';
import { PresentationProvider } from '../../components/foundation/PresentationProvider';
import { Button } from '../../components/foundation/Primitives';
import Text from '../../components/AppText';
import CourtDiscovery from '../../components/courts/CourtDiscovery';
import CourtPreview from '../../components/courts/CourtPreview';
import type { Court } from '../../lib/courts/catalog';
import { palette } from '../../constants/design';

// Exact seed catalog; no backend, auth, mutations or invented activity.
const courts: Court[] = [
  { id: '43fd5901-f3f6-4e5e-9ae6-d32c2dcc4764', name: 'Parque Rodo', latitude: -34.912341, longitude: -56.168726,
    half_court: true, lighting: 'si', surface: 'concreto', notes: '', created_at: '2025-12-02T20:22:44.763299-03:00' },
  { id: '61b2c883-d029-4725-9142-bc1af122b84f', name: 'Parque Rodó Court', latitude: -34.912415, longitude: -56.168732,
    half_court: false, lighting: 'outdoor', surface: 'concreto', notes: '1 aro solo - Dr. Luis Piera', created_at: '2025-10-11T00:31:01.33629-03:00' },
  { id: '9a63055d-e78b-460c-aab7-30cbb1d867d9', name: 'Palermo', latitude: -34.9135347, longitude: -56.1792215,
    half_court: false, lighting: null, surface: 'concreto', notes: '', created_at: '2025-12-02T20:22:51.047136-03:00' },
];
function Preview() {
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);
  const [detail, setDetail] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { height } = useWindowDimensions();
  return <View style={{ flex: 1, backgroundColor: palette.navy }}>
    <Text variant="caption" tone="dark">T03 · Revisión aislada con seed local. Navegación simulada.</Text>
    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
      <Button secondary label="Probar error" onPress={() => { setPending(false); setError(true); }} />
      <Button secondary label={pending ? 'Terminar carga' : 'Probar carga'} onPress={() => { setError(false); setPending(v => !v); }} />
      <Button secondary label="Probar hoja" onPress={() => { setExpanded(false); setSheet(true); }} />
    </View>
    <View style={{ flex: 1, display: detail ? 'none' : 'flex' }}>
      <CourtDiscovery courts={courts} focused={!detail} bottomInset={0} catalog={{ pending, error, retry: () => setError(false) }}
        activity={{ pending: false, error: false, retry: () => undefined, playingCourtIds: [], checkedAt: null }}
        location={null} locating={false} locationMessage={null} onLocate={() => undefined} onOpen={setDetail} />
    </View>
    {detail && <View style={{ padding: 16, gap: 16 }}>
      <Text variant="display" tone="dark">{courts.find(c => c.id === detail)?.name}</Text>
      <Text tone="dark">ID: {detail}</Text>
      <Button label="Volver a canchas" onPress={() => setDetail(null)} />
    </View>}
    {sheet && <CourtPreview court={courts[1]} expanded={expanded} onExpand={() => setExpanded(v => !v)}
      onClose={() => setSheet(false)} onOpen={() => { setSheet(false); setDetail(courts[1].id); }}
      focused={false} bottomInset={0} availableHeight={height} />}
  </View>;
}
function Root() {
  const [loaded, error] = useFonts(fontAssets);
  if (!loaded && !error) return null;
  return <PresentationProvider><Preview /></PresentationProvider>;
}
registerRootComponent(Root);

