import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import Text from '@/components/AppText';
import { useAuth } from '@/contexts/AuthContext';
import { useCourtCatalog } from '@/hooks/catalog';
import { useMatch, useMatchAction } from '@/hooks/matches';
import { validateFinalScore } from '@/lib/pickup/matches';
import { dateLabel } from '@/lib/pickup/discovery';
import { GameButton, GameField, GameNotice, GamePanel, gameColors, kit } from '@/components/pickup/Kit';

function MatchScreen({ id }: { id: string }) {
  const detail = useMatch(id), action = useMatchAction(id), courts = useCourtCatalog(), owner = useAuth().session?.user.id;
  const [scoreA, setA] = useState(''), [scoreB, setB] = useState(''), [editing, setEditing] = useState(false), [confirm, setConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({}), [notice, setNotice] = useState('');
  const [reviewRevision, setReviewRevision] = useState<number | null>(null);
  const game = detail.data?.game, isOwner = game?.organizer_id === owner;
  const disabled = !action.ready || action.busy || detail.isFetching || detail.isError || Boolean(action.pending);
  function beginEdit() { setA(String(game?.score_a ?? '')); setB(String(game?.score_b ?? '')); setEditing(true); setConfirm(false); setNotice(''); setErrors({}); }
  function review() { if (!game) return; const validation = validateFinalScore(id, game.revision, scoreA, scoreB); setErrors(validation.errors); if (!Object.keys(validation.errors).length) { setReviewRevision(game.revision); setConfirm(true); } }
  async function save() {
    if (!game && !action.pending) return;
    if (!action.pending && reviewRevision !== game?.revision) { setErrors({ match: 'The current result changed. Review it before confirming again.' }); setConfirm(false); return; }
    const input = action.pending ? undefined : validateFinalScore(id, reviewRevision!, scoreA, scoreB);
    if (input && Object.keys(input.errors).length) { setErrors(input.errors); setConfirm(false); return; }
    const result = await action.run(input?.input);
    setConfirm(false);
    if (result) { setEditing(false); setNotice(`Current declared result confirmed: ${result.game.score_a} – ${result.game.score_b}.`); }
  }
  return <KeyboardAvoidingView style={kit.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={96}>
    <Stack.Screen options={{ title: 'Match result', headerStyle: { backgroundColor: gameColors.ink }, headerTintColor: '#fff' }} />
    <ScrollView contentContainerStyle={kit.content} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={detail.isFetching && !detail.isPending} tintColor={gameColors.orange} onRefresh={() => void detail.refetch()} />}>
      {detail.isPending && <ActivityIndicator color={gameColors.orange} />}
      {detail.isError && <GamePanel><GameNotice>{detail.error.message} Previous details may be outdated.</GameNotice><GameButton secondary label="Retry match" onPress={() => void detail.refetch()} /></GamePanel>}
      {action.pending && <GamePanel><GameNotice>A saved result needs confirmation before another change.</GameNotice><GameButton label="Retry saved result" busy={action.busy} disabled={!action.ready} onPress={() => void save()} /></GamePanel>}
      {action.error && <GameNotice>{action.error}</GameNotice>}
      {Boolean(notice) && <Text accessibilityLiveRegion="polite" style={kit.body}>{notice}</Text>}
      {game && <>
        <View style={{ gap: 8 }}><Text style={kit.kicker}>ORGANIZER-DECLARED RESULT</Text><Text style={kit.title}>{game.format}{'\n'}{courts.data?.find(c => c.id === game.court_id)?.name ?? 'Court'}</Text><Text style={kit.body}>{game.state === 'completed' ? 'Match closed' : 'Awaiting a final score'} · Recorded {dateLabel(game.created_at)}</Text></View>
        <GamePanel><Text style={kit.section}>Side A · Side B</Text><Text style={{ color: gameColors.orange, fontSize: 44, fontFamily: 'Lexend-Bold' }}>{game.state === 'completed' ? `${game.score_a} – ${game.score_b}` : '— : —'}</Text>
          <Text style={kit.help}>{game.state === 'completed' ? `Revision ${game.revision} · Closed ${dateLabel(game.closed_at!)}` : 'The organizer saves the final score after play.'}</Text>
        </GamePanel>
        {(['A','B'] as const).map(side => <GamePanel key={side}><Text style={kit.section}>Side {side}</Text>{detail.data?.players.filter(p => p.side === side).map(player => <View key={player.id} style={{ gap: 4 }}><Text style={kit.body}>{player.display_name || player.guest_label || 'Player'}</Text><Text style={kit.help}>{player.user_id ? 'Registered account' : 'Guest without an account'}</Text></View>)}</GamePanel>)}
        {isOwner && !action.pending && (!editing ? <GameButton label={game.state === 'completed' ? 'Correct final score' : 'Enter final score'} disabled={disabled} onPress={beginEdit} /> : <GamePanel>
          <Text style={kit.section}>{game.state === 'completed' ? 'Correct the declared result' : 'Enter the final result'}</Text>
          <GameField label="Side A final score" value={scoreA} editable={!disabled && !confirm} keyboardType="number-pad" maxLength={10} error={errors.scoreA} onChangeText={setA} />
          <GameField label="Side B final score" value={scoreB} editable={!disabled && !confirm} keyboardType="number-pad" maxLength={10} error={errors.scoreB} onChangeText={setB} />
          {errors.match && <GameNotice>{errors.match}</GameNotice>}
          {confirm && !action.busy && reviewRevision !== game.revision && <GameNotice>The result changed since your review. Review the latest score before confirming.</GameNotice>}
          {confirm ? <><Text style={kit.body}>Save {scoreA} – {scoreB} against current revision {game.revision}? {game.state === 'completed' ? `Current result: ${game.score_a} – ${game.score_b}. History will be preserved.` : 'This closes the match and any linked active invitation.'}</Text>
            <GameButton label="Confirm final result" busy={action.busy} disabled={disabled || reviewRevision !== game.revision} onPress={() => void save()} /><GameButton secondary label="Review scores" disabled={action.busy} onPress={() => setConfirm(false)} /></> : <GameButton label="Review final result" disabled={disabled} onPress={review} />}
          <GameButton secondary label="Keep current result" disabled={action.busy} onPress={() => { setEditing(false); setConfirm(false); }} />
        </GamePanel>)}
        <GamePanel><Text style={kit.section}>Result history</Text>{!detail.data?.history.length && <Text style={kit.body}>No final result recorded yet.</Text>}
          {detail.data?.history.map(change => <View key={change.revision} style={{ gap: 5 }}><Text style={kit.section}>Revision {change.revision}: {change.score_a} – {change.score_b}</Text><Text style={kit.help}>{change.previous_a === null ? 'First final result' : `Previous: ${change.previous_a} – ${change.previous_b}`} · {dateLabel(change.changed_at)}</Text></View>)}
        </GamePanel>
        <Text style={kit.help}>Declared by the organizer. No verified attendance, individual points or ranking credit.</Text>
      </>}
    </ScrollView>
  </KeyboardAvoidingView>;
}
export default function MatchRoute() { const { id } = useLocalSearchParams<{ id: string }>(); return <MatchScreen key={id} id={id} />; }
