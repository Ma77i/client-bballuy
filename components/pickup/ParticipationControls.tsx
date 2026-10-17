import { palette } from '@/constants/design';
import { detailErrorText } from './detail-copy';
import { useState } from 'react';
import { Animated, View } from 'react-native';
import { useDecorativeFeedback } from '@/components/foundation/useDecorativeMotion';
import { StateView } from '@/components/foundation/Primitives';
import Text from '@/components/pickup/GameText';
import { useAuth } from '@/contexts/AuthContext';
import { useParticipation } from '@/hooks/participation';
import { participationState } from '@/lib/pickup/participation';
import type { loadPublicSession } from '@/lib/pickup/discovery';
import { GameLoading as ActivityIndicator, GameButton, ArcadeNotice as GameNotice, GamePanel, gameColors, kit } from './Kit';

export default function ParticipationControls({ sessionId, detail, readable }: {
  sessionId: string; detail?: Awaited<ReturnType<typeof loadPublicSession>>; readable: boolean;
}) {
  const owner = useAuth().session?.user.id ?? '';
  const action = useParticipation(sessionId);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [message, setMessage] = useState('');
  const feedback = useDecorativeFeedback(message, Boolean(message));
  const current = detail ? participationState(detail, owner) : null;
  const disabled = !action.ready || action.busy || !readable || Boolean(detail?.rosterChanged);
  async function run(choice?: 'join' | 'leave') {
    setMessage(''); setConfirmLeave(false);
    const result = await action.run(choice);
    if (result) setMessage(participationState(result, owner).joined
      ? 'Tu inscripción está confirmada.' : 'No tenés una inscripción registrada.');
  }
  return <GamePanel tone="light" style={{ gap: 10 }}>
    <Text style={kit.section}>Tu inscripción</Text>
    {!action.ready && <ActivityIndicator accessibilityLabel="Consultando inscripción guardada" color={gameColors.orange} />}
    {action.pending ? <>
      <GameNotice>Una solicitud guardada de {action.pending.action === 'join' ? 'inscripción' : 'salida'} necesita confirmación. Comprobala antes de cambiar tu inscripción.</GameNotice>
      <GameButton label="Reintentar comprobación" busy={action.busy} disabled={!action.ready} onPress={() => void run()} />
    </> : detail && current ? <>
      {current.joined && <Text style={kit.badge}>INSCRIPCIÓN CONFIRMADA</Text>}
      {detail.game.state !== 'open' ? <Text style={kit.body}>Este partido no permite cambios de inscripción.</Text> : confirmLeave ? <View style={{ gap: 12 }}>
        <Text style={kit.body}>¿Liberar tu lugar? Podés volver mientras el partido esté abierto y haya lugares.</Text>
        <GameButton danger label="Confirmar salida" disabled={disabled || !current.canLeave} busy={action.busy} onPress={() => void run('leave')} />
        <GameButton secondary label="Conservar mi lugar" disabled={action.busy} onPress={() => setConfirmLeave(false)} />
      </View> : current.joined ? <GameButton secondary label="Salir del partido" disabled={disabled || !current.canLeave} busy={action.busy} onPress={() => setConfirmLeave(true)} /> :
        <GameButton foregroundColor={palette.navy} style={{ backgroundColor: palette.orange, borderColor: palette.orange }} label={detail.game.available_places === 0 ? 'Partido completo' : 'Inscribirme'} disabled={disabled || !current.canJoin} busy={action.busy} onPress={() => void run('join')} />}
    </> : <Text style={kit.help}>Consultá los datos actualizados para comprobar tu inscripción.</Text>}
    {action.error && <GameNotice>{detailErrorText(action.error)}</GameNotice>}
    {action.busy && <StateView title="Comprobando inscripción" message="Esperando la confirmación real de tu cuenta." loading />}
    {Boolean(message) && <Animated.View style={feedback}><Text accessibilityLiveRegion="polite" style={kit.body}>{message}</Text></Animated.View>}
    <Text style={kit.help}>Podés salir hasta que se inicie el juego. La inscripción no confirma asistencia.</Text>
  </GamePanel>;
}
