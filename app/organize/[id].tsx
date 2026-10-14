import { errorText } from '@/components/pickup/error-copy';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { CalendarDays, MapPin, Users } from 'lucide-react-native';
import Text from '@/components/pickup/GameText';
import Colors from '@/constants/colors';
import { GameLoading as ActivityIndicator, GameButton, GameChoice, ArcadeField as GameField, ArcadeNotice as GameNotice, GamePanel, gameColors, kit } from '@/components/pickup/Kit';
import { useCourtCatalog } from '@/hooks/catalog';
import { useOrganizedSession, useOrganizerAction } from '@/hooks/organizer';
import { defaultSessionDraft, managementActions, validateSessionDraft,
  type DraftErrors, type OrganizerInput, type SessionDraft } from '@/lib/pickup/organizer';
import { sessionStatus } from '@/components/pickup/presentation';
import FormatChoices from '@/components/pickup/FormatChoices';

type Lifecycle = 'start' | 'cancel' | 'complete_session';
const confirmations: Record<Lifecycle, { title: string; body: string; label: string }> = {
  start: { title: '¿Listos para jugar?', body: 'Iniciar cierra las inscripciones y salidas. Iniciá cuando estén listos para jugar.', label: 'Iniciar juego' },
  cancel: { title: '¿Cancelar la convocatoria?', body: 'Los participantes verán la cancelación. Para cambiar cancha, hora o formato después de una inscripción, creá otra convocatoria.', label: 'Cancelar convocatoria' },
  complete_session: { title: '¿Finalizar la convocatoria?', body: 'Finaliza la convocatoria. No registra un resultado ni confirma asistencia.', label: 'Finalizar convocatoria' },
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
  const [notice, setNotice] = useState(created ? 'Tu convocatoria está creada.' : '');
  const session = game.data;
  const disabled = action.busy || !action.ready || Boolean(action.pending);
  const controls = session ? managementActions(session) : null;
  async function run(input?: OrganizerInput) {
    const result = await action.run(input);
    if (result) { setConfirm(null); setEditing(false); setNotice('Cambio confirmado. Tu convocatoria está actualizada.'); }
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
    <Stack.Screen options={{ headerBackTitle: 'Volver', title: 'Gestionar convocatoria', headerStyle: { backgroundColor: gameColors.ink }, headerTintColor: Colors.text }} />
    <ScrollView contentContainerStyle={kit.content} keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl refreshing={game.isFetching && !game.isPending} onRefresh={() => void game.refetch()} tintColor={gameColors.orange} />}>
      <Text style={kit.kicker}>TU PARTIDO · TU CONVOCATORIA</Text>
      {action.error && <GameNotice>{action.error}</GameNotice>}
      {action.pending && <GamePanel tone="light">
        <Text style={kit.section}>COMPROBÁ TU ÚLTIMA SOLICITUD</Text><Text style={kit.body}>Comprobá la acción guardada antes de hacer otro cambio.</Text>
        <GameButton label="Reintentar comprobación" busy={action.busy} disabled={!action.ready} onPress={() => void run()} />
      </GamePanel>}
      {game.isPending ? <ActivityIndicator accessibilityLabel="Cargando convocatoria" color={gameColors.orange} /> : game.isError || !session ? <GamePanel tone="light">
        <GameNotice>{errorText(game.error?.message) ?? 'Esta convocatoria no está disponible.'}</GameNotice>
        <GameButton secondary label="Reintentar convocatoria" onPress={() => void game.refetch()} />
        <GameButton secondary label="Volver a Jugar" onPress={() => router.replace('/(tabs)/play')} />
      </GamePanel> : <>
        <View style={{ gap: 10 }}><Text style={kit.badge}>{sessionStatus(session)}</Text>
          <Text style={kit.title}>{session.format} en{ '\n' }{courts.data?.find(c => c.id === session.court_id)?.name ?? 'tu cancha'}</Text>
          {Boolean(notice) && <Text accessibilityRole="alert" style={{ color: Colors.success, lineHeight: 22 }}>{notice}</Text>}
        </View>
        <GamePanel tone="light">
          <View style={kit.row}><MapPin size={20} color={gameColors.orange} /><Text style={[kit.body, { flex: 1 }]}>{courts.data?.find(c => c.id === session.court_id)?.name ?? 'Información de cancha no disponible'}</Text></View>
          <View style={kit.row}><CalendarDays size={20} color={gameColors.orange} /><Text style={[kit.body, { flex: 1 }]}>{session.timing === 'now' ? 'Para jugar ahora' : new Date(session.scheduled_at).toLocaleString('es-UY', { dateStyle: 'medium', timeStyle: 'short' })}</Text></View>
          <View style={kit.row}><Users size={20} color={gameColors.orange} /><Text style={kit.body}>{session.occupied_places}/{session.capacity} lugares ocupados</Text></View>
          {session.state === 'open' && <Text style={{ color: gameColors.orange, fontSize: 28, fontFamily: 'Lexend-Bold' }}>{session.available_places} lugares disponibles</Text>}
          <Text style={kit.help}>{session.organizer_plays ? 'Tenés un lugar para jugar.' : 'Organizás sin ocupar un lugar para jugar.'}</Text>
          {session.description ? <Text style={{ color: Colors.text, lineHeight: 23 }}>{session.description}</Text> : null}
        </GamePanel>
        {editing ? <GamePanel tone="light">
          <Text style={kit.section}>EDITAR CONVOCATORIA</Text>
          {controls?.editCore ? <>
            <Text style={kit.help}>Podés cambiar cancha, formato y hora antes de que alguien ocupe un lugar.</Text>
            {courts.data?.map(court => <GameChoice key={court.id} label={court.name} selected={draft.courtId === court.id} disabled={disabled}
              onPress={() => setDraft(old => ({ ...old, courtId: court.id }))} />)}
            {errors.courtId && <Text style={kit.error}>{errorText(errors.courtId)}</Text>}
            <FormatChoices value={draft.format} disabled={disabled} onChange={format => setDraft(old => ({ ...old, format }))} />
            {draft.timing === 'future' && <>
              <GameField label="Fecha" value={draft.date} editable={!disabled} error={errorText(errors.date)} onChangeText={date => setDraft(old => ({ ...old, date }))} />
              <GameField label="Hora" value={draft.time} editable={!disabled} error={errorText(errors.time)} onChangeText={time => setDraft(old => ({ ...old, time }))} />
            </>}
          </> : <Text style={kit.body}>Ya hay lugares ocupados. Para cambiar cancha, hora o formato, cancelá y creá otra convocatoria.</Text>}
          <GameField label="Nota para quienes juegan" value={draft.description} editable={!disabled} multiline maxLength={500} error={errorText(errors.description)}
            onChangeText={description => setDraft(old => ({ ...old, description }))} />
          <GameButton label="Guardar cambios" busy={action.busy} disabled={disabled} onPress={() => void saveEdit()} />
          <GameButton secondary label="Conservar convocatoria" disabled={disabled} onPress={() => setEditing(false)} />
        </GamePanel> : !confirm && <View style={{ gap: 12 }}>
          {controls?.start && <GameButton label="Iniciar juego" disabled={disabled} onPress={() => { setConfirm('start'); setNotice(''); }} />}
          {controls?.complete && <GameButton label="Finalizar convocatoria" disabled={disabled} onPress={() => { setConfirm('complete_session'); setNotice(''); }} />}
          {controls?.edit && <GameButton secondary label="Editar convocatoria" disabled={disabled} onPress={beginEdit} />}
          {controls?.cancel && <GameButton danger label="Cancelar convocatoria" disabled={disabled} onPress={() => { setConfirm('cancel'); setNotice(''); }} />}
        </View>}
        {confirm && <GamePanel tone="light" style={{ borderColor: gameColors.orange }}>
          <Text style={kit.section}>{confirmations[confirm].title}</Text><Text style={kit.body}>{confirmations[confirm].body}</Text>
          <GameButton label={confirmations[confirm].label} danger={confirm === 'cancel'} busy={action.busy} disabled={disabled}
            onPress={() => void run({ action: confirm, data: { session_id: id } })} />
          <GameButton secondary label="Volver" disabled={disabled} onPress={() => setConfirm(null)} />
        </GamePanel>}
        <GameButton secondary label="Organizar otra convocatoria" disabled={disabled} onPress={() => router.push({ pathname: '/organize/create', params: { courtId: session.court_id } })} />
        {['started','completed'].includes(session.state) && <GameButton secondary label="Registrar este partido" disabled={disabled}
          onPress={() => router.push({ pathname: '/matches/create', params: { courtId: session.court_id, format: session.format, sourceId: session.id } })} />}
        <GameButton secondary label="Volver a Jugar" disabled={disabled} onPress={() => router.replace('/(tabs)/play')} />
        <Text style={kit.help}>La convocatoria no reserva la cancha ni confirma asistencia. Solo quien organiza puede gestionarla.</Text>
      </>}
    </ScrollView>
  </KeyboardAvoidingView>;
}
export default function OrganizerDetailRoute() {
  const { id, created } = useLocalSearchParams<{ id: string; created?: string }>();
  return <OrganizerDetail key={id} id={id} created={created === '1'} />;
}
