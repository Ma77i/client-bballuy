import { useEffect } from 'react';
import { AccessibilityInfo, View } from 'react-native';
import Text from '@/components/AppText';
import { Button, Notice, Panel, StateView } from '@/components/foundation/Primitives';
import { palette, spacing } from '@/constants/design';

// Presentation observes the existing hook; only server/readback decides membership.
export type MembershipPanelProps = {
  embedded?: boolean;
  joined: boolean; saving: boolean; saveError: boolean; loading: boolean; readError: boolean;
  onChange(): void; onRetryChange(): void; onRetryRead(): void;
};
export default function MembershipPanel(props: MembershipPanelProps) {
  useEffect(() => {
    if (props.saving) AccessibilityInfo.announceForAccessibility('Guardando cambios en Mis canchas.');
  }, [props.saving]);
  const Container = props.embedded ? View : Panel;
  const tone = props.embedded ? 'light' : 'dark';
  return <Container style={{ gap: props.embedded ? spacing.sm : spacing.md }}>
    {!props.embedded && <Text variant="display" tone={tone} accessibilityRole="header">MIS CANCHAS</Text>}
    {!props.embedded && <Text variant="body" tone="dark">Guardá esta cancha para encontrarla fácilmente.</Text>}
    {props.saving ? <Button secondary tone={tone}
      style={props.embedded ? { borderColor: palette.muted } : undefined}
      label={props.joined ? 'Quitar de mis canchas' : 'Agregar a mis canchas'}
      accessibilityHint="Guardando cambios en Mis canchas." busy onPress={props.onChange} /> : props.saveError ? <>
      <Notice>No pudimos confirmar el cambio. Reintentá la misma acción para comprobar el cambio.</Notice>
      <Button secondary label="Reintentar cambio" onPress={props.onRetryChange} />
    </> : props.loading ? <StateView title="Consultando Mis canchas" loading />
      : props.readError ? <>
        <Notice>No pudimos consultar Mis canchas.</Notice>
        <Button secondary label="Reintentar consulta" onPress={props.onRetryRead} />
      </> : <View style={{ gap: spacing.sm }}>
        {!props.embedded && <Text variant="label" tone={tone} accessibilityLiveRegion="polite">{props.joined ? 'Agregada a Mis canchas' : 'Todavía no agregaste esta cancha'}</Text>}
        <Button secondary style={props.embedded ? { borderColor: palette.muted } : undefined} label={props.embedded ? props.joined ? 'Quitar de mis canchas' : 'Agregar a mis canchas' : props.joined ? 'Quitar de Mis canchas' : 'Agregar a Mis canchas'}
          accessibilityHint={props.embedded && props.joined ? 'Activá para quitar esta cancha de Mis canchas.' : undefined} onPress={props.onChange} />
      </View>}
  </Container>;
}
