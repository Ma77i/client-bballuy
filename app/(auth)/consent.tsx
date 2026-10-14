import EntryFrame from '@/components/entry/EntryFrame';
import { Button, Panel, Notice } from '@/components/foundation/Primitives';
import { palette } from '@/constants/design';
import Text from '@/components/AppText';
import { Pressable } from 'react-native';
import { useRouter } from "expo-router";
import { useRef, useState } from "react";


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
  return <EntryFrame title="PRIVACIDAD Y TÉRMINOS" description="Versión de desarrollo: los términos y avisos de privacidad son provisionales. Las políticas aprobadas no están disponibles en esta versión.">
    <Pressable accessibilityRole="checkbox" accessibilityLabel="Reconocer términos de desarrollo" aria-checked={tosAccepted} accessibilityState={{ checked: tosAccepted, disabled: saving }} disabled={saving}
      onPress={() => setTosAccepted(!tosAccepted)} style={({pressed}) => ({ minHeight: 48, borderWidth: 2, borderColor: tosAccepted ? palette.orange : palette.muted, borderRadius: 12, padding: 16, opacity: pressed ? .85 : 1 })}>
      <Text variant="body" tone="dark">{tosAccepted ? '✓ ' : ''}Entiendo que esta es una versión de desarrollo con términos provisionales.</Text>
    </Pressable>
    <Pressable accessibilityRole="checkbox" accessibilityLabel="Reconocer aviso de privacidad de desarrollo" aria-checked={ppAccepted} accessibilityState={{ checked: ppAccepted, disabled: saving }} disabled={saving}
      onPress={() => setPpAccepted(!ppAccepted)} style={({pressed}) => ({ minHeight: 48, borderWidth: 2, borderColor: ppAccepted ? palette.orange : palette.muted, borderRadius: 12, padding: 16, opacity: pressed ? .85 : 1 })}>
      <Text variant="body" tone="dark">{ppAccepted ? '✓ ' : ''}Entiendo que el aviso de privacidad es provisional y usaré información de prueba.</Text>
    </Pressable>
    <Panel tone="light"><Text variant="body" tone="light">Usá información de prueba. Estos reconocimientos se registran para el recorrido de prueba; no constituyen aceptación de políticas legales definitivas. El registro público requiere políticas aprobadas.</Text></Panel>
    {error && <Notice>No pudimos guardar los reconocimientos. Reintentá.</Notice>}
    <Button label={error ? 'Reintentar' : 'Continuar'} disabled={!canContinue} busy={saving} onPress={() => void handleContinue()} />
    <Button secondary label="Volver" disabled={saving} onPress={() => router.back()} />
  </EntryFrame>;
}
