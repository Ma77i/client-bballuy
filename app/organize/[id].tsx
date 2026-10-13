import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { CalendarDays, MapPin, Users } from 'lucide-react-native';
import Text from '@/components/AppText';
import Colors from '@/constants/colors';
import { GameButton, GameChoice, GameField, GameNotice, GamePanel, gameColors, kit } from '@/components/pickup/Kit';
import { useCourtCatalog } from '@/hooks/catalog';
import { useOrganizedSession, useOrganizerAction } from '@/hooks/organizer';
import { defaultSessionDraft, managementActions, pickupFormats, sessionStateLabel, validateSessionDraft,
  type DraftErrors, type OrganizerInput, type SessionDraft } from '@/lib/pickup/organizer';

type Lifecycle = 'start' | 'cancel' | 'complete_session';
const confirmations: Record<Lifecycle, { title: string; body: string; label: string }> = {
  start: { title: 'Ready to start?', body: 'Starting closes sign-ups and exits from the invitation. Start only when you are ready to play.', label: 'Start game' },
  cancel: { title: 'Cancel this invitation?', body: 'Participants will see the cancellation. To change the court, time or format after someone joined, create a new invitation.', label: 'Cancel invitation' },
  complete_session: { title: 'Close this invitation?', body: 'This marks the invitation as closed. It does not record a score or confirm who attended.', label: 'Close invitation' },
};

function OrganizerDetail({ id, created }: { id: string; created: boolean }) {
  const router = useRouter();
  const game = useOrganizedSession(id);
  const courts = useCourtCatalog();
  const action = useOrganizerAction(id);
  const [confirm, setConfirm] = useState<Lifecycle | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<SessionDraft>(() => defaultSessionDraft());
  const [errors, setErrors] = useState<DraftErrors>({});
  const [notice, setNotice] = useState(created ? 'Your invitation is created.' : '');
  const session = game.data;
  const disabled = action.busy || !action.ready || Boolean(action.pending);
  const controls = session ? managementActions(session) : null;
  async function run(input?: OrganizerInput) {
    const result = await action.run(input);
    if (result) { setConfirm(null); setEditing(false); setNotice('Change confirmed. Your invitation is up to date.'); }
  }
  function beginEdit() {
    if (!session) return;
    const time = new Date(session.scheduled_at);
    const pad = (n: number) => String(n).padStart(2, '0');
    setDraft({ ...defaultSessionDraft(session.court_id), format: session.format as SessionDraft['format'], timing: session.timing as SessionDraft['timing'],
      date: `${time.getFullYear()}-${pad(time.getMonth()+1)}-${pad(time.getDate())}`, time: `${pad(time.getHours())}:${pad(time.getMinutes())}`,
      organizerPlays: session.organizer_plays, presentCount: String(session.occupied_places), description: session.description });
    setErrors({}); setEditing(true); setConfirm(null); setNotice('');
  }
  async function saveEdit() {
    if (!session || !controls) return;
    const input: OrganizerInput = { action: 'edit_session', data: { session_id: id, description: draft.description.trim() } };
    const newErrors: DraftErrors = {};
    if (draft.description.trim().length > 500) newErrors.description = 'Use 500 characters or fewer.';
    if (controls.editCore) {
      const original = new Date(session.scheduled_at);
      const pad = (n: number) => String(n).padStart(2, '0');
      const date = `${original.getFullYear()}-${pad(original.getMonth()+1)}-${pad(original.getDate())}`;
      const time = `${pad(original.getHours())}:${pad(original.getMinutes())}`;
      const timeChanged = draft.timing === 'future' && (draft.date !== date || draft.time !== time);
      const validation = validateSessionDraft({ ...draft, timing: timeChanged ? 'future' : 'now', organizerPlays: false, presentCount: '0' });
      Object.assign(newErrors, validation.errors);
      if (!courts.data?.some(court => court.id === draft.courtId)) newErrors.courtId = 'Choose an available court.';
      if (draft.courtId !== session.court_id) input.data.court_id = draft.courtId;
      if (draft.format !== session.format) input.data.format = draft.format;
      if (timeChanged && validation.data.scheduled_at) input.data.scheduled_at = validation.data.scheduled_at;
    }
    setErrors(newErrors);
    if (!Object.keys(newErrors).length) await run(input);
  }
  return <KeyboardAvoidingView style={kit.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={96}>
    <Stack.Screen options={{ title: 'Manage invitation', headerStyle: { backgroundColor: gameColors.ink }, headerTintColor: Colors.text }} />
    <ScrollView contentContainerStyle={kit.content} keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl refreshing={game.isFetching && !game.isPending} onRefresh={() => void game.refetch()} tintColor={gameColors.orange} />}>
      <Text style={kit.kicker}>YOUR GAME · YOUR INVITATION</Text>
      {action.error && <GameNotice>{action.error}</GameNotice>}
      {action.pending && <GamePanel>
        <Text style={kit.section}>Confirm your last request</Text><Text style={kit.body}>Retry the saved action before making another change.</Text>
        <GameButton label="Retry saved action" busy={action.busy} disabled={!action.ready} onPress={() => void run()} />
      </GamePanel>}
      {game.isPending ? <ActivityIndicator accessibilityLabel="Loading invitation" color={gameColors.orange} /> : game.isError || !session ? <GamePanel>
        <GameNotice>{game.error?.message ?? 'This invitation is unavailable.'}</GameNotice>
        <GameButton secondary label="Retry invitation" onPress={() => void game.refetch()} />
        <GameButton secondary label="Back to your games" onPress={() => router.replace('/(tabs)/play')} />
      </GamePanel> : <>
        <View style={{ gap: 10 }}><Text style={kit.badge}>{sessionStateLabel(session.state)}</Text>
          <Text style={kit.title}>{session.format} at{ '\n' }{courts.data?.find(c => c.id === session.court_id)?.name ?? 'your court'}</Text>
          {Boolean(notice) && <Text accessibilityRole="alert" style={{ color: Colors.success, lineHeight: 22 }}>{notice}</Text>}
        </View>
        <GamePanel>
          <View style={kit.row}><MapPin size={20} color={gameColors.orange} /><Text style={[kit.body, { flex: 1 }]}>{courts.data?.find(c => c.id === session.court_id)?.name ?? 'Court information unavailable'}</Text></View>
          <View style={kit.row}><CalendarDays size={20} color={gameColors.orange} /><Text style={[kit.body, { flex: 1 }]}>{session.timing === 'now' ? 'Organized for now' : new Date(session.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</Text></View>
          <View style={kit.row}><Users size={20} color={gameColors.orange} /><Text style={kit.body}>{session.occupied_places}/{session.capacity} places occupied</Text></View>
          {session.state === 'open' && <Text style={{ color: gameColors.orange, fontSize: 28, fontFamily: 'Lexend-Bold' }}>{session.available_places} open places</Text>}
          <Text style={kit.help}>{session.organizer_plays ? 'You have a player place.' : 'You are organizing without a player place.'}</Text>
          {session.description ? <Text style={{ color: Colors.text, lineHeight: 23 }}>{session.description}</Text> : null}
        </GamePanel>
        {editing ? <GamePanel>
          <Text style={kit.section}>Edit your invitation</Text>
          {controls?.editCore ? <>
            <Text style={kit.help}>Court, format and planned time can change before anyone occupies a place.</Text>
            {courts.data?.map(court => <GameChoice key={court.id} label={court.name} selected={draft.courtId === court.id} disabled={disabled}
              onPress={() => setDraft(old => ({ ...old, courtId: court.id }))} />)}
            {errors.courtId && <Text style={kit.error}>{errors.courtId}</Text>}
            <View style={kit.row}>{pickupFormats.map(format => <GameChoice key={format} label={format} selected={draft.format === format}
              disabled={disabled} onPress={() => setDraft(old => ({ ...old, format }))} />)}</View>
            {draft.timing === 'future' && <>
              <GameField label="Date" value={draft.date} editable={!disabled} error={errors.date} onChangeText={date => setDraft(old => ({ ...old, date }))} />
              <GameField label="Time" value={draft.time} editable={!disabled} error={errors.time} onChangeText={time => setDraft(old => ({ ...old, time }))} />
            </>}
          </> : <Text style={kit.body}>Places have been occupied. To change court, time or format, cancel and create a new invitation.</Text>}
          <GameField label="A note for players" value={draft.description} editable={!disabled} multiline maxLength={500} error={errors.description}
            onChangeText={description => setDraft(old => ({ ...old, description }))} />
          <GameButton label="Save changes" busy={action.busy} disabled={disabled} onPress={() => void saveEdit()} />
          <GameButton secondary label="Keep current invitation" disabled={disabled} onPress={() => setEditing(false)} />
        </GamePanel> : !confirm && <View style={{ gap: 12 }}>
          {controls?.start && <GameButton label="Start game" disabled={disabled} onPress={() => { setConfirm('start'); setNotice(''); }} />}
          {controls?.complete && <GameButton label="Close invitation" disabled={disabled} onPress={() => { setConfirm('complete_session'); setNotice(''); }} />}
          {controls?.edit && <GameButton secondary label="Edit invitation" disabled={disabled} onPress={beginEdit} />}
          {controls?.cancel && <GameButton danger label="Cancel invitation" disabled={disabled} onPress={() => { setConfirm('cancel'); setNotice(''); }} />}
        </View>}
        {confirm && <GamePanel style={{ borderColor: gameColors.orange }}>
          <Text style={kit.section}>{confirmations[confirm].title}</Text><Text style={kit.body}>{confirmations[confirm].body}</Text>
          <GameButton label={confirmations[confirm].label} danger={confirm === 'cancel'} busy={action.busy} disabled={disabled}
            onPress={() => void run({ action: confirm, data: { session_id: id } })} />
          <GameButton secondary label="Go back" disabled={disabled} onPress={() => setConfirm(null)} />
        </GamePanel>}
        <GameButton secondary label="Organize another game" disabled={disabled} onPress={() => router.push({ pathname: '/organize/create', params: { courtId: session.court_id } })} />
        {['started','completed'].includes(session.state) && <GameButton secondary label="Record this match" disabled={disabled}
          onPress={() => router.push({ pathname: '/matches/create', params: { courtId: session.court_id, format: session.format, sourceId: session.id } })} />}
        <GameButton secondary label="Back to your games" disabled={disabled} onPress={() => router.replace('/(tabs)/play')} />
        <Text style={kit.help}>An invitation does not reserve the court or confirm attendance. Only you can manage this invitation.</Text>
      </>}
    </ScrollView>
  </KeyboardAvoidingView>;
}
export default function OrganizerDetailRoute() {
  const { id, created } = useLocalSearchParams<{ id: string; created?: string }>();
  return <OrganizerDetail key={id} id={id} created={created === '1'} />;
}
