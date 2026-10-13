import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Text from '@/components/AppText';
import { useAuth } from '@/contexts/AuthContext';
import { useParticipation } from '@/hooks/participation';
import { participationState } from '@/lib/pickup/participation';
import type { loadPublicSession } from '@/lib/pickup/discovery';
import { GameButton, GameNotice, GamePanel, gameColors, kit } from './Kit';

export default function ParticipationControls({ sessionId, detail, readable }: {
  sessionId: string; detail?: Awaited<ReturnType<typeof loadPublicSession>>; readable: boolean;
}) {
  const owner = useAuth().session?.user.id ?? '';
  const action = useParticipation(sessionId);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [message, setMessage] = useState('');
  const current = detail ? participationState(detail, owner) : null;
  const disabled = !action.ready || action.busy || !readable || Boolean(detail?.rosterChanged);
  async function run(choice?: 'join' | 'leave') {
    setMessage(''); setConfirmLeave(false);
    const result = await action.run(choice);
    if (result) setMessage(participationState(result, owner).joined
      ? 'Your current player place is confirmed.' : 'You currently have no registered player place.');
  }
  return <GamePanel>
    <Text style={kit.section}>Your player place</Text>
    {!action.ready && <ActivityIndicator accessibilityLabel="Reading saved registration" color={gameColors.orange} />}
    {action.pending ? <>
      <GameNotice>A saved {action.pending.action} request needs confirmation. Retry it before changing your registration.</GameNotice>
      <GameButton label="Retry saved registration" busy={action.busy} disabled={!action.ready} onPress={() => void run()} />
    </> : detail && current ? <>
      {current.joined && <Text style={kit.badge}>YOU HAVE A PLAYER PLACE</Text>}
      {detail.game.state !== 'open' ? <Text style={kit.body}>Registration changes are closed for this invitation.</Text> : confirmLeave ? <View style={{ gap: 12 }}>
        <Text style={kit.body}>Leave this invitation and release your place? You can join again while it stays open and has room.</Text>
        <GameButton danger label="Confirm leave" disabled={disabled || !current.canLeave} busy={action.busy} onPress={() => void run('leave')} />
        <GameButton secondary label="Keep my place" disabled={action.busy} onPress={() => setConfirmLeave(false)} />
      </View> : current.joined ? <GameButton secondary label="Leave invitation" disabled={disabled || !current.canLeave} busy={action.busy} onPress={() => setConfirmLeave(true)} /> :
        <GameButton label={detail.game.available_places === 0 ? 'No places available' : 'Join invitation'} disabled={disabled || !current.canJoin} busy={action.busy} onPress={() => void run('join')} />}
    </> : <Text style={kit.help}>Load the latest game details to check your place.</Text>}
    {action.error && <GameNotice>{action.error}</GameNotice>}
    {Boolean(message) && <Text accessibilityLiveRegion="polite" style={kit.body}>{message}</Text>}
    <Text style={kit.help}>You can leave until the organizer starts play. A registration does not confirm attendance.</Text>
  </GamePanel>;
}
