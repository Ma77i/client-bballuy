import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight, MapPin } from 'lucide-react-native';
import Text from '@/components/AppText';
import Colors from '@/constants/colors';
import { GameButton, GameChoice, GameField, GameNotice, GamePanel, gameColors, kit } from '@/components/pickup/Kit';
import { useCourtCatalog } from '@/hooks/catalog';
import { useOrganizerAction } from '@/hooks/organizer';
import { capacities, defaultSessionDraft, pickupFormats, restoredSessionDraft, validateSessionDraft, type DraftErrors, type SessionDraft } from '@/lib/pickup/organizer';

export function CreateInvitationScreen({ quick = false }: { quick?: boolean }) {
  const { courtId, format } = useLocalSearchParams<{ courtId?: string; format?: string }>();
  const router = useRouter();
  const courts = useCourtCatalog();
  const action = useOrganizerAction('create');
  const [formDraft, setDraft] = useState(() => {
    const initial = defaultSessionDraft(courtId ?? '');
    if (pickupFormats.some(value => value === format)) initial.format = format as SessionDraft['format'];
    return initial;
  });
  const [planned, setPlanned] = useState(false);
  const draft = action.pending ? restoredSessionDraft(action.pending.input.data, formDraft) : formDraft;
  const [errors, setErrors] = useState<DraftErrors>({});
  const disabled = action.busy || !action.ready || Boolean(action.pending);
  const showConfiguration = quick || planned || Boolean(action.pending && draft.timing === 'future');
  const capacity = capacities[draft.format];
  function openQuickSetup() {
    if (!action.pending && !courts.data?.some(court => court.id === draft.courtId)) {
      setErrors(old => ({ ...old, courtId: 'Choose an available court.' })); return;
    }
    router.push({ pathname: '/organize/quick', params: { courtId: draft.courtId, format: draft.format } });
  }
  const occupied = draft.timing === 'future' ? Number(draft.organizerPlays) : Number(draft.presentCount);
  const available = Number.isFinite(occupied) ? capacity - occupied : null;
  function change<K extends keyof SessionDraft>(field: K, value: SessionDraft[K]) {
    setDraft(old => ({ ...old, [field]: value })); setErrors(old => ({ ...old, [field]: undefined }));
  }
  function participation(plays: boolean) {
    const count = /^\d+$/.test(draft.presentCount) ? Number(draft.presentCount) : Number(draft.organizerPlays);
    setDraft(old => ({ ...old, organizerPlays: plays, presentCount: String(Math.max(0, count + Number(plays) - Number(old.organizerPlays))) }));
    setErrors(old => ({ ...old, presentCount: undefined }));
  }
  async function submit() {
    if (!action.pending) {
      const validation = validateSessionDraft(draft);
      if (!courts.data?.some(court => court.id === draft.courtId)) validation.errors.courtId = 'Choose an available court.';
      setErrors(validation.errors);
      if (Object.keys(validation.errors).length) return;
      const result = await action.run({ action: 'create_session', data: validation.data });
      if (result) router.replace({ pathname: '/organize/[id]', params: { id: result.id, created: '1' } });
    } else {
      setDraft(draft);
      const result = await action.run();
      if (result) router.replace({ pathname: '/organize/[id]', params: { id: result.id, created: '1' } });
    }
  }
  return <KeyboardAvoidingView style={kit.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={96}>
    <Stack.Screen options={{ title: quick ? 'Quick game setup' : 'Organize a game', headerStyle: { backgroundColor: gameColors.ink }, headerTintColor: Colors.text }} />
    <ScrollView contentContainerStyle={kit.content} keyboardShouldPersistTaps="handled">
      <View style={{ gap: 8 }}><Text style={kit.kicker}>GET YOUR GAME TOGETHER</Text><Text style={kit.title}>{quick ? 'Your game. Right now.' : <>Set the court.{ '\n' }Make the invite.</>}</Text>
        <Text style={kit.body}>Start with the essentials. Players do not need a team or to follow this court.</Text></View>
      {!action.ready && <ActivityIndicator accessibilityLabel="Reading saved request" color={gameColors.orange} />}
      {action.pending && <GameNotice>A saved request is waiting for confirmation. Retry it before creating another invitation.</GameNotice>}
      {!quick && <GamePanel>
        <View style={kit.row}><MapPin size={20} color={gameColors.orange} /><Text style={kit.section}>Choose your court</Text></View>
        {courts.isPending ? <ActivityIndicator color={gameColors.orange} /> : courts.isError ? <>
          <GameNotice>Unable to load courts.</GameNotice><GameButton secondary label="Retry courts" onPress={() => void courts.refetch()} />
        </> : courts.data?.map(court => <GameChoice key={court.id} label={court.name} selected={draft.courtId === court.id}
          disabled={disabled} onPress={() => change('courtId', court.id)} />)}
        {errors.courtId && <Text accessibilityRole="alert" style={kit.error}>{errors.courtId}</Text>}
      </GamePanel>}
      {!quick && <GamePanel><Text style={kit.section}>Choose your format</Text>
        <View style={kit.row}>{pickupFormats.map(format => <GameChoice key={format} label={format} detail={`${capacities[format]} players`}
          selected={draft.format === format} disabled={disabled} onPress={() => change('format', format)} />)}</View>
      </GamePanel>}
      {quick && (courts.isError ? <GamePanel><GameNotice>Unable to load courts.</GameNotice><GameButton secondary label="Retry courts" onPress={() => void courts.refetch()} /></GamePanel> : <GamePanel><Text style={kit.section}>{courts.data?.find(court => court.id === draft.courtId)?.name ?? 'Selected court'} · {draft.format}</Text><Text style={kit.body}>An immediate invitation. Start play explicitly when everyone is ready.</Text>{errors.courtId && <GameNotice>{errors.courtId}</GameNotice>}</GamePanel>)}
      {!quick && <GamePanel><Text style={kit.section}>When are you playing?</Text>
        <View style={kit.row}><GameChoice label="Now" detail="Find people today" selected={false} disabled={disabled} onPress={openQuickSetup} />
          <GameChoice label="Plan ahead" detail="Set a date and time" selected={showConfiguration} disabled={disabled} onPress={() => { change('timing', 'future'); setPlanned(true); }} /></View>
        {showConfiguration && draft.timing === 'future' && <>
          <GameField label="Date" help="YYYY-MM-DD" value={draft.date} editable={!disabled} autoCapitalize="none" maxLength={10} error={errors.date} onChangeText={value => change('date', value)} />
          <GameField label="Time" help="HH:MM · your local time" value={draft.time} editable={!disabled} maxLength={5} error={errors.time} onChangeText={value => change('time', value)} />
        </>}
        {showConfiguration && <Text style={kit.help}>The organizer starts play. The planned time does not automatically close sign-ups.</Text>}
      </GamePanel>}
      {!quick && action.pending && draft.timing === 'now' && <GameButton label="Resume quick setup" onPress={openQuickSetup} />}
      {showConfiguration && <>
      <GamePanel><Text style={kit.section}>Are you playing?</Text>
        <View style={kit.row}><GameChoice label="I’m playing" selected={draft.organizerPlays} disabled={disabled} onPress={() => participation(true)} />
          <GameChoice label="Just organizing" selected={!draft.organizerPlays} disabled={disabled} onPress={() => participation(false)} /></View>
        {draft.timing === 'now' && <GameField label="Players already here" help="Include yourself if playing, plus any guests without an account."
          value={draft.presentCount} editable={!disabled} keyboardType="number-pad" maxLength={2} error={errors.presentCount} onChangeText={value => change('presentCount', value)} />}
        <View style={{ padding: 16, borderRadius: 14, backgroundColor: '#30251f', gap: 6 }}>
          <Text style={{ color: gameColors.orange, fontSize: 24, fontFamily: 'Lexend-Bold' }}>{available !== null && available >= 0 ? available : '—'} open places</Text>
          <Text style={kit.help}>{capacity} total · {draft.timing === 'future' ? 'Your place is reserved only if you are playing.' : 'Already-present players count toward the limit.'}</Text>
        </View>
      </GamePanel>
      <GamePanel><GameField label="A note for players (optional)" help={`${draft.description.length}/500 characters`} value={draft.description} editable={!disabled}
        multiline maxLength={500} error={errors.description} onChangeText={value => change('description', value)} /></GamePanel>
      {action.error && <GameNotice>{action.error}</GameNotice>}
      <GameButton label={action.pending ? 'Retry saved invitation' : 'Create invitation'} busy={action.busy}
        disabled={!action.ready || (!action.pending && (courts.isPending || courts.isError))} icon={<ArrowRight size={20} color={gameColors.ink} />} onPress={() => void submit()} />
      <Text style={kit.help}>Your organizer name and participants are visible to signed-in players. This invitation does not reserve the court.</Text>
      </>}
    </ScrollView>
  </KeyboardAvoidingView>;
}

export default function OrganizeGameScreen() { return <CreateInvitationScreen />; }
