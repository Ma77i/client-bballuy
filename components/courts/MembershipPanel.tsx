import { View } from 'react-native';
import Text from '@/components/AppText';
import { Button, Notice, Panel, StateView } from '@/components/foundation/Primitives';
import { spacing } from '@/constants/design';

// Presentation observes the existing hook; only server/readback decides membership.
export type MembershipPanelProps = {
  joined: boolean; saving: boolean; saveError: boolean; loading: boolean; readError: boolean;
  onChange(): void; onRetryChange(): void; onRetryRead(): void;
};
export default function MembershipPanel(props: MembershipPanelProps) {
  return <Panel style={{ gap: spacing.md }}>
    <Text variant="display" tone="dark" accessibilityRole="header">MIS CANCHAS</Text>
    <Text variant="body" tone="dark">Guardá esta cancha para encontrarla fácilmente.</Text>
    {props.saving ? <>
      <StateView title="Confirmando cambio" message="Esperando la confirmación del servidor." loading />
      <Button label="Confirmando cambio" busy onPress={props.onChange} />
    </> : props.saveError ? <>
      <Notice>No pudimos confirmar el cambio. Reintentá la misma acción para comprobar el cambio.</Notice>
      <Button secondary label="Reintentar cambio" onPress={props.onRetryChange} />
    </> : props.loading ? <StateView title="Consultando Mis canchas" loading />
      : props.readError ? <>
        <Notice>No pudimos consultar Mis canchas.</Notice>
        <Button secondary label="Reintentar consulta" onPress={props.onRetryRead} />
      </> : <View style={{ gap: spacing.sm }}>
        <Text variant="label" tone="dark" accessibilityLiveRegion="polite">{props.joined ? 'Agregada a Mis canchas' : 'Todavía no agregaste esta cancha'}</Text>
        <Button secondary label={props.joined ? 'Quitar de Mis canchas' : 'Agregar a Mis canchas'} onPress={props.onChange} />
      </View>}
  </Panel>;
}
