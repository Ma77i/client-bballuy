import { useState } from 'react';
import { registerRootComponent } from 'expo';
import { useFonts } from 'expo-font';
import { ScrollView, View } from 'react-native';
import Text from '../../components/AppText';
import { fontAssets } from '../../constants/font-assets';
import { palette } from '../../constants/design';
import { capacities, pickupFormats } from '../../lib/pickup/organizer';
import { PresentationProvider, useReducedMotion } from '../../components/foundation/PresentationProvider';
import { Button, Choice, ChoiceGroup, Field, Notice, Panel, StateView } from '../../components/foundation/Primitives';
import { GenericMedia } from '../../components/foundation/GenericMedia';

// Standalone Metro entry for local component verification. Never a router screen.
function Preview() {
  const [selected, setSelected] = useState('2v2');
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [presses, setPresses] = useState(0);
  const reduced = useReducedMotion();
  return <ScrollView style={{ flex: 1, backgroundColor: palette.navy }} contentContainerStyle={{ padding: 24, gap: 24 }}>
    <Text variant="display" style={{ color: palette.text }}>bballuy · Primitivas T02</Text>
    <Text style={{ color: palette.muted }}>Pruebas aisladas de componentes. No es una pantalla de la app.</Text>
    <Text testID="motion-preference" style={{ color: palette.text }}>Movimiento reducido: {reduced ? 'sí' : 'no'}</Text>
    <Panel>
      <Text variant="section" tone="dark">Superficie azul noche</Text>
      <Button testID="action" label="Acción de prueba" busy={busy} onPress={() => setPresses(n => n + 1)} />
      <Text testID="activation-count" style={{ color: palette.text }}>Activaciones de prueba: {presses}</Text>
      <Button testID="busy-toggle" secondary label={busy ? 'Quitar ocupado' : 'Probar ocupado'} onPress={() => setBusy(v => !v)} />
      <Button testID="disabled" disabled label="Acción no disponible" onPress={() => setPresses(n => n + 100)} />
      <Button danger label="Acción de advertencia" onPress={() => setPresses(n => n + 1)} />
      <Field testID="field" label="Texto de prueba" help="El contenido pertenece al componente padre."
        value={value} onChangeText={setValue} />
      <Field label="Campo con error" error="Revisá este campo de prueba." value="" editable={false} />
      <ChoiceGroup label="Formato de prueba">
        {pickupFormats.map(format => <Choice key={format} testID={`format-${format}`} emphasis="format"
          label={format} detail={`${capacities[format]} lugares en total`} selected={selected === format}
          onPress={() => setSelected(format)} />)}
      </ChoiceGroup>
      <StateView title="Cargando componentes…" loading />
      <Notice>Ejemplo de error visible y recuperable.</Notice>
      <Notice kind="success">Ejemplo visual de estado confirmado, sin operación real.</Notice>
    </Panel>
    <Panel tone="light">
      <Text variant="section" tone="light">Superficie crema</Text>
      <Button secondary label="Acción secundaria" onPress={() => setPresses(n => n + 1)} />
      <Button danger label="Advertencia en crema" onPress={() => setPresses(n => n + 1)} />
      <Field label="Texto sobre crema" placeholder="ÁÉÍÓÚÜÑ · ¿¡ áéíóúüñ" value={value} onChangeText={setValue} />
      <ChoiceGroup label="Opción de prueba"><Choice label="Opción seleccionada" selected onPress={() => {}} /></ChoiceGroup>
      <Notice kind="warning">Ejemplo visual de advertencia.</Notice>
      <StateView title="Ejemplo de error" kind="error" message="Conservá el contenido al reintentar."
        action={<Button label="Reintentar prueba" onPress={() => setPresses(n => n + 1)} />} />
    </Panel>
    <Panel>
      <Text variant="section" tone="dark">Medios genéricos y fallback</Text>
      <View testID="fallback" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
        <GenericMedia />
        <GenericMedia source={{ uri: 'data:image/png;base64,AA==' }} />
        <GenericMedia source={{ uri: '' }} />
        <GenericMedia asset="player" />
      </View>
    </Panel>
  </ScrollView>;
}
function FoundationPreview() {
  const [loaded, error] = useFonts(fontAssets);
  if (!loaded && !error) return <Text>Cargando fuentes de prueba…</Text>;
  return <PresentationProvider><Preview /></PresentationProvider>;
}
registerRootComponent(FoundationPreview);
