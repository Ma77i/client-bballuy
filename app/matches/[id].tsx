import { errorText } from '@/components/pickup/error-copy';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import Text from '@/components/pickup/GameText';
import { useAuth } from '@/contexts/AuthContext';
import { useCourtCatalog } from '@/hooks/catalog';
import { useMatch, useMatchAction } from '@/hooks/matches';
import { validateFinalScore } from '@/lib/pickup/matches';
import { dateText as dateLabel } from '@/components/pickup/presentation';
import { GameLoading as ActivityIndicator, GameButton, ArcadeField as GameField, ArcadeNotice as GameNotice, GamePanel, gameColors, kit } from '@/components/pickup/Kit';

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
    if (result) { setEditing(false); setNotice(`Resultado actual confirmado: ${result.game.score_a} – ${result.game.score_b}.`); }
  }
  return <KeyboardAvoidingView style={kit.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={96}>
    <Stack.Screen options={{ headerBackTitle: 'Volver', title: 'Resultado del partido', headerStyle: { backgroundColor: gameColors.ink }, headerTintColor: '#fff' }} />
    <ScrollView contentContainerStyle={kit.content} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={detail.isFetching && !detail.isPending} tintColor={gameColors.orange} onRefresh={() => void detail.refetch()} />}>
      {detail.isPending && <ActivityIndicator color={gameColors.orange} />}
      {detail.isError && <GamePanel tone="light"><GameNotice>{errorText(detail.error.message)} Los datos anteriores pueden estar desactualizados.</GameNotice><GameButton secondary label="Reintentar partido" onPress={() => void detail.refetch()} /></GamePanel>}
      {action.pending && <GamePanel tone="light"><GameNotice>El resultado guardado debe comprobarse antes de otro cambio.</GameNotice><GameButton label="Reintentar comprobación" busy={action.busy} disabled={!action.ready} onPress={() => void save()} /></GamePanel>}
      {action.error && <GameNotice>{action.error}</GameNotice>}
      {Boolean(notice) && <Text accessibilityLiveRegion="polite" style={kit.body}>{notice}</Text>}
      {game && <>
        <View style={{ gap: 8 }}><Text style={kit.kicker}>RESULTADO DECLARADO POR QUIEN ORGANIZA</Text><Text style={kit.title}>{game.format}{'\n'}{courts.data?.find(c => c.id === game.court_id)?.name ?? 'Cancha'}</Text><Text style={kit.body}>{game.state === 'completed' ? 'Partido finalizado' : 'Resultado final pendiente'} · Registrado {dateLabel(game.created_at)}</Text></View>
        <GamePanel tone="light"><Text style={kit.section}>Lado A · Lado B</Text><Text variant="display" style={{ color: gameColors.orange, fontSize: 48, lineHeight: 52 }}>{game.state === 'completed' ? `${game.score_a} – ${game.score_b}` : '— : —'}</Text>
          <Text style={kit.help}>{game.state === 'completed' ? `Revisión ${game.revision} · Finalizado ${dateLabel(game.closed_at!)}` : 'Quien organiza registra el resultado final después del juego.'}</Text>
        </GamePanel>
        {(['A','B'] as const).map(side => <GamePanel tone="light" key={side}><Text style={kit.section}>Lado {side}</Text>{detail.data?.players.filter(p => p.side === side).map(player => <View key={player.id} style={{ gap: 4 }}><Text style={kit.body}>{player.display_name || player.guest_label || 'Player'}</Text><Text style={kit.help}>{player.user_id ? 'Cuenta registrada' : 'Invitado sin cuenta'}</Text></View>)}</GamePanel>)}
        {isOwner && !action.pending && (!editing ? <GameButton label={game.state === 'completed' ? 'Corregir resultado' : 'Registrar resultado'} disabled={disabled} onPress={beginEdit} /> : <GamePanel tone="light">
          <Text style={kit.section}>{game.state === 'completed' ? 'CORREGIR RESULTADO DECLARADO' : 'REGISTRAR RESULTADO FINAL'}</Text>
          <GameField label="Resultado final del lado A" value={scoreA} editable={!disabled && !confirm} keyboardType="number-pad" maxLength={10} error={errors.scoreA} onChangeText={setA} />
          <GameField label="Resultado final del lado B" value={scoreB} editable={!disabled && !confirm} keyboardType="number-pad" maxLength={10} error={errors.scoreB} onChangeText={setB} />
          {errors.match && <GameNotice>{errors.match}</GameNotice>}
          {confirm && !action.busy && reviewRevision !== game.revision && <GameNotice>El resultado cambió desde tu revisión. Revisá el actual antes de confirmar.</GameNotice>}
          {confirm ? <><Text style={kit.body}>Guardar {scoreA} – {scoreB} sobre la revisión actual {game.revision}? {game.state === 'completed' ? `Resultado actual: ${game.score_a} – ${game.score_b}. Se conserva el historial.` : 'Finaliza el partido y la convocatoria activa vinculada.'}</Text>
            <GameButton label="Confirmar resultado final" busy={action.busy} disabled={disabled || reviewRevision !== game.revision} onPress={() => void save()} /><GameButton secondary label="Revisar resultados" disabled={action.busy} onPress={() => setConfirm(false)} /></> : <GameButton label="Revisar resultado final" disabled={disabled} onPress={review} />}
          <GameButton secondary label="Conservar resultado actual" disabled={action.busy} onPress={() => { setEditing(false); setConfirm(false); }} />
        </GamePanel>)}
        <GamePanel tone="light"><Text style={kit.section}>HISTORIAL DE RESULTADOS</Text>{!detail.data?.history.length && <Text style={kit.body}>Todavía no hay resultado final registrado.</Text>}
          {detail.data?.history.map(change => <View key={change.revision} style={{ gap: 5 }}><Text style={kit.section}>Revisión {change.revision}: {change.score_a} – {change.score_b}</Text><Text style={kit.help}>{change.previous_a === null ? 'Primer resultado final' : `Anterior: ${change.previous_a} – ${change.previous_b}`} · {dateLabel(change.changed_at)}</Text></View>)}
        </GamePanel>
        <Text style={kit.help}>Declarado por quien organiza. No confirma asistencia ni otorga puntos individuales o de ranking.</Text>
      </>}
    </ScrollView>
  </KeyboardAvoidingView>;
}
export default function MatchRoute() { const { id } = useLocalSearchParams<{ id: string }>(); return <MatchScreen key={id} id={id} />; }
