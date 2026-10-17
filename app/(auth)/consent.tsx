import EntryFrame from '@/components/entry/EntryFrame';
import { Button, Panel, Notice } from '@/components/foundation/Primitives';
import { palette } from '@/constants/design';
import Text from '@/components/AppText';
import { Platform, Pressable, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { useRouter } from "expo-router";
import { useRef, useState, type KeyboardEvent } from "react";


import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveDevelopmentConsent } from '@/lib/auth/consent';

export default function ConsentScreen() {
  const router = useRouter();
  const [tosAccepted, setTosAccepted] = useState<boolean>(false);
  const [ppAccepted, setPpAccepted] = useState<boolean>(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false);
  const canContinue = tosAccepted && ppAccepted && !saving;

  const handleContinue = async () => {
    if (!canContinue || submitting.current) return;
    submitting.current = true;
    setSaving(true);
    setError(null);
    try {
      await saveDevelopmentConsent(AsyncStorage, tosAccepted, ppAccepted);
      router.push("/signup");
    } catch {
      setError('Unable to save your acknowledgements. Please retry.');
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  };
  const keyboard = Platform.OS === 'web' ? { onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== ' ' || !(event.target instanceof HTMLElement)) return;
    const label = event.target.closest('[role="checkbox"]')?.getAttribute('aria-label');
    if (!label) return;
    event.preventDefault();
    if (saving || event.repeat) return;
    if (label === 'Reconocer términos de desarrollo') setTosAccepted(value => !value);
    if (label === 'Reconocer aviso de privacidad de desarrollo') setPpAccepted(value => !value);
  } } : {};
  return <EntryFrame title="PRIVACIDAD Y TÉRMINOS" description="Versión de desarrollo: los términos y avisos de privacidad son provisionales. Las políticas aprobadas no están disponibles en esta versión.">
    <Text variant="body" tone="dark">Tocá cada casilla para marcar los dos reconocimientos y continuar.</Text>
    <View {...keyboard} style={{ gap: 16 }}>
    <Pressable accessibilityRole="checkbox" accessibilityLabel="Reconocer términos de desarrollo" aria-checked={tosAccepted} accessibilityState={{ checked: tosAccepted, disabled: saving }} disabled={saving}
      onPress={() => setTosAccepted(!tosAccepted)} style={({pressed}) => ({ minHeight: 48, flexDirection: 'row', gap: 12, alignItems: 'flex-start', borderWidth: 2, borderColor: tosAccepted ? palette.orange : palette.muted, borderRadius: 12, padding: 16, opacity: pressed ? .85 : 1 })}>
      <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: 28, height: 28, borderWidth: 2, borderRadius: 4, borderColor: tosAccepted ? palette.orange : palette.muted, backgroundColor: tosAccepted ? palette.orange : palette.navy, alignItems: 'center', justifyContent: 'center' }}>
        {tosAccepted && <Check size={22} color={palette.navy} aria-hidden />}
      </View>
      <Text variant="body" tone="dark" style={{ flex: 1 }}>Entiendo que esta es una versión de desarrollo con términos provisionales.</Text>
    </Pressable>
    <Pressable accessibilityRole="checkbox" accessibilityLabel="Reconocer aviso de privacidad de desarrollo" aria-checked={ppAccepted} accessibilityState={{ checked: ppAccepted, disabled: saving }} disabled={saving}
      onPress={() => setPpAccepted(!ppAccepted)} style={({pressed}) => ({ minHeight: 48, flexDirection: 'row', gap: 12, alignItems: 'flex-start', borderWidth: 2, borderColor: ppAccepted ? palette.orange : palette.muted, borderRadius: 12, padding: 16, opacity: pressed ? .85 : 1 })}>
      <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: 28, height: 28, borderWidth: 2, borderRadius: 4, borderColor: ppAccepted ? palette.orange : palette.muted, backgroundColor: ppAccepted ? palette.orange : palette.navy, alignItems: 'center', justifyContent: 'center' }}>
        {ppAccepted && <Check size={22} color={palette.navy} aria-hidden />}
      </View>
      <Text variant="body" tone="dark" style={{ flex: 1 }}>Entiendo que el aviso de privacidad es provisional y usaré información de prueba.</Text>
    </Pressable>
    </View>
    <Panel tone="light"><Text variant="body" tone="light">Usá información de prueba. Estos reconocimientos se registran para el recorrido de prueba; no constituyen aceptación de políticas legales definitivas. El registro público requiere políticas aprobadas.</Text></Panel>
    {error && <Notice>No pudimos guardar los reconocimientos. Reintentá.</Notice>}
    <Button label={error ? 'Reintentar' : 'Continuar'} disabled={!canContinue} busy={saving} onPress={() => void handleContinue()} />
    <Button secondary label="Volver" disabled={saving} onPress={() => router.back()} />
  </EntryFrame>;
}
