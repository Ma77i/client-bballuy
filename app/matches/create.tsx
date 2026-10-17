import { PlayArt } from '@/components/pickup/PlayArt';
import { palette } from '@/constants/design';
import { errorText } from '@/components/pickup/error-copy';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Text from '@/components/pickup/GameText';
import { useAuth } from '@/contexts/AuthContext';
import { useCourtCatalog } from '@/hooks/catalog';
import { usePublicSession } from '@/hooks/pickup';
import { useMatchAction } from '@/hooks/matches';
import { matchPlayers, validateMatchDraft, type MatchDraft } from '@/lib/pickup/matches';
import { pickupFormats, type PickupFormat } from '@/lib/pickup/organizer';
import MatchPlayerSlot from '@/components/pickup/MatchPlayerSlot';
import FormatChoices from '@/components/pickup/FormatChoices';
import { GameLoading as ActivityIndicator, GameButton, GameChoice, ArcadeNotice as GameNotice, GamePanel, gameColors, kit } from '@/components/pickup/Kit';

export default function CreateMatchScreen() {
  const { courtId = '', format, sourceId = '' } = useLocalSearchParams<{ courtId?: string; format?: string; sourceId?: string }>();
  const courts = useCourtCatalog(), source = usePublicSession(sourceId), owner = useAuth().session?.user.id;
  const action = useMatchAction('create'), router = useRouter();
  const [draft, setDraft] = useState<MatchDraft>(() => { const selected = pickupFormats.find(value => value === format) ?? '1v1'; return { courtId, format: selected, sourceId, players: matchPlayers(selected) }; });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const disabled = action.busy || !action.ready || Boolean(action.pending);
  const eligibleSource = !sourceId || Boolean(source.data && source.data.game.organizer_id === owner && ['started','completed'].includes(source.data.game.state) && source.data.game.court_id === draft.courtId && source.data.game.format === draft.format);
  function chooseFormat(value: PickupFormat) { setDraft(old => ({ ...old, format: value, players: matchPlayers(value) })); setErrors({}); }
  async function submit() {
    if (!action.pending) {
      const validation = validateMatchDraft(draft);
      if (!courts.data?.some(court => court.id === draft.courtId)) validation.errors.courtId = 'Choose an available court.';
      if (!eligibleSource) validation.errors.sourceId = 'Load a started or closed invitation you organize.';
      setErrors(validation.errors); if (Object.keys(validation.errors).length) return;
      const result = await action.run(validation.input);
      if (result) router.replace({ pathname: '/matches/[id]', params: { id: result.game.id } });
    } else {
      const result = await action.run(); if (result) router.replace({ pathname: '/matches/[id]', params: { id: result.game.id } });
    }
  }
  return <KeyboardAvoidingView style={kit.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={96}>
    <Stack.Screen options={{ headerBackTitle: 'Volver', title: 'Registrar partido', headerStyle: { backgroundColor: gameColors.ink }, headerTintColor: '#fff' }} />
    <ScrollView contentContainerStyle={[kit.content, { padding: 12, gap: 12 }]} keyboardShouldPersistTaps="handled">
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1 }}><Text style={kit.kicker}>DOS LADOS · UN PARTIDO</Text><Text style={kit.body}>Elegí a quienes jugaron; después registrá el resultado.</Text></View>
        <PlayArt kind={draft.format} style={{ width: 88, height: 88, borderRadius: 12, overflow: 'hidden' }} />
      </View>
      {!action.ready && <ActivityIndicator color={gameColors.orange} />}
      {action.pending ? <GamePanel tone="light"><GameNotice>Hay un partido guardado sin confirmar. La cancha y los participantes quedan bloqueados hasta comprobarlo.</GameNotice>
        <GameButton label="Reintentar comprobación" busy={action.busy} disabled={!action.ready} onPress={() => void submit()} /></GamePanel> : <>
        {sourceId && <GamePanel tone="light"><Text style={kit.section}>Partido vinculado</Text><Text style={kit.body}>Cancha y formato vienen del partido vinculado. Elegí los participantes de ambos lados.</Text>
          {source.isPending && <ActivityIndicator color={gameColors.orange} />}
          {(source.isError || (!source.isPending && !eligibleSource)) && <><GameNotice>No pudimos usar este partido.</GameNotice><GameButton secondary label="Reintentar partido vinculado" onPress={() => void source.refetch()} /></>}
        </GamePanel>}
        <GamePanel tone="light"><Text style={kit.section}>CANCHA</Text>{courts.data?.map(court => <GameChoice compact key={court.id} label={court.name} selected={draft.courtId === court.id} disabled={disabled || Boolean(sourceId)} onPress={() => setDraft(old => ({ ...old, courtId: court.id }))} />)}
          {courts.isPending && <ActivityIndicator color={gameColors.orange} />}
          {courts.isError && <><GameNotice>No pudimos cargar las canchas.</GameNotice><GameButton secondary label="Reintentar canchas" onPress={() => void courts.refetch()} /></>}
          {errors.courtId && <GameNotice>{errorText(errors.courtId)}</GameNotice>}
        </GamePanel>
        <GamePanel tone="light"><Text style={kit.section}>FORMATO</Text><FormatChoices illustrated value={draft.format} disabled={disabled || Boolean(sourceId)} onChange={chooseFormat} /></GamePanel>
        {(['A','B'] as const).map(side => <GamePanel tone="light" key={side}><Text style={kit.section}>Lado {side}</Text>
          {draft.players.map((player, index) => player.side === side && <MatchPlayerSlot key={`${draft.format}:${index}`} player={player} index={draft.players.slice(0,index).filter(p => p.side === side).length}
            disabled={disabled} error={errors[`player${index}`]} change={value => { setDraft(old => ({ ...old, players: old.players.map((p,i) => i === index ? value : p) })); setErrors(old => ({ ...old, [`player${index}`]: '' })); }} />)}
        </GamePanel>)}
        {errors.players && <GameNotice>{errorText(errors.players)}</GameNotice>}{errors.sourceId && <GameNotice>{errorText(errors.sourceId)}</GameNotice>}
        <GameButton foregroundColor={palette.navy} style={{ backgroundColor: palette.orange, borderColor: palette.orange }} label="Registrar partido" busy={action.busy} disabled={disabled || courts.isPending || courts.isError || !eligibleSource || Boolean(sourceId && source.isError)} onPress={() => void submit()} />
      </>}
      {action.error && <GameNotice>{action.error}</GameNotice>}
      <Text style={kit.help}>Quien organiza declara participantes y resultado. El registro no confirma asistencia ni otorga puntos de ranking.</Text>
    </ScrollView>
  </KeyboardAvoidingView>;
}
