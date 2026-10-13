import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Text from '@/components/AppText';
import { useAuth } from '@/contexts/AuthContext';
import { useCourtCatalog } from '@/hooks/catalog';
import { usePublicSession } from '@/hooks/pickup';
import { useMatchAction } from '@/hooks/matches';
import { matchPlayers, validateMatchDraft, type MatchDraft } from '@/lib/pickup/matches';
import { pickupFormats, type PickupFormat } from '@/lib/pickup/organizer';
import MatchPlayerSlot from '@/components/pickup/MatchPlayerSlot';
import { GameButton, GameChoice, GameNotice, GamePanel, gameColors, kit } from '@/components/pickup/Kit';

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
    <Stack.Screen options={{ title: 'Record a match', headerStyle: { backgroundColor: gameColors.ink }, headerTintColor: '#fff' }} />
    <ScrollView contentContainerStyle={kit.content} keyboardShouldPersistTaps="handled">
      <View style={{ gap: 8 }}><Text style={kit.kicker}>CAPTURE THE GAME</Text><Text style={kit.title}>Two sides.{ '\n' }One match.</Text><Text style={kit.body}>Record the players who played. Add the final side-level score afterward.</Text></View>
      {!action.ready && <ActivityIndicator color={gameColors.orange} />}
      {action.pending ? <GamePanel><GameNotice>A saved match record needs confirmation. Its court and players are locked until you retry.</GameNotice>
        <GameButton label="Retry saved match" busy={action.busy} disabled={!action.ready} onPress={() => void submit()} /></GamePanel> : <>
        {sourceId && <GamePanel><Text style={kit.section}>Linked invitation</Text><Text style={kit.body}>Court and format come from the invitation. Select both sides explicitly.</Text>
          {source.isPending && <ActivityIndicator color={gameColors.orange} />}
          {(source.isError || (!source.isPending && !eligibleSource)) && <><GameNotice>Unable to use this invitation.</GameNotice><GameButton secondary label="Retry source invitation" onPress={() => void source.refetch()} /></>}
        </GamePanel>}
        <GamePanel><Text style={kit.section}>Court</Text>{courts.data?.map(court => <GameChoice key={court.id} label={court.name} selected={draft.courtId === court.id} disabled={disabled || Boolean(sourceId)} onPress={() => setDraft(old => ({ ...old, courtId: court.id }))} />)}
          {courts.isPending && <ActivityIndicator color={gameColors.orange} />}
          {courts.isError && <><GameNotice>Unable to load courts.</GameNotice><GameButton secondary label="Retry courts" onPress={() => void courts.refetch()} /></>}
          {errors.courtId && <GameNotice>{errors.courtId}</GameNotice>}
        </GamePanel>
        <GamePanel><Text style={kit.section}>Format</Text><View style={kit.row}>{pickupFormats.map(value => <GameChoice key={value} label={value} selected={draft.format === value} disabled={disabled || Boolean(sourceId)} onPress={() => chooseFormat(value)} />)}</View></GamePanel>
        {(['A','B'] as const).map(side => <GamePanel key={side}><Text style={kit.section}>Side {side}</Text>
          {draft.players.map((player, index) => player.side === side && <MatchPlayerSlot key={`${draft.format}:${index}`} player={player} index={draft.players.slice(0,index).filter(p => p.side === side).length}
            disabled={disabled} error={errors[`player${index}`]} change={value => { setDraft(old => ({ ...old, players: old.players.map((p,i) => i === index ? value : p) })); setErrors(old => ({ ...old, [`player${index}`]: '' })); }} />)}
        </GamePanel>)}
        {errors.players && <GameNotice>{errors.players}</GameNotice>}{errors.sourceId && <GameNotice>{errors.sourceId}</GameNotice>}
        <GameButton label="Create match record" busy={action.busy} disabled={disabled || courts.isPending || courts.isError || !eligibleSource || Boolean(sourceId && source.isError)} onPress={() => void submit()} />
      </>}
      {action.error && <GameNotice>{action.error}</GameNotice>}
      <Text style={kit.help}>The organizer declares the players and result. This record grants no ranking points or verified attendance.</Text>
    </ScrollView>
  </KeyboardAvoidingView>;
}
