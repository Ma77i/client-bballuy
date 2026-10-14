import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight, MapPin } from 'lucide-react-native';
import Text from '@/components/pickup/GameText';
import Colors from '@/constants/colors';
import FormatChoices from './FormatChoices';
import { GenericMedia } from '@/components/foundation/GenericMedia';
import { palette } from '@/constants/design';
import { errorText } from './error-copy';
import { GameLoading as ActivityIndicator, GameButton, GameChoice, ArcadeField as GameField, ArcadeNotice as GameNotice, GamePanel, gameColors, kit } from '@/components/pickup/Kit';
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
    <Stack.Screen options={{ headerBackTitle: 'Volver', title: quick ? 'Jugar ahora' : 'Organizar convocatoria', headerStyle: { backgroundColor: gameColors.ink }, headerTintColor: Colors.text }} />
    <ScrollView contentContainerStyle={kit.content} keyboardShouldPersistTaps="handled">
      <View style={{ gap: 8 }}><Text style={kit.kicker}>ARMÁ TU PRÓXIMO PARTIDO</Text><Text style={kit.title}>{quick ? 'TU PARTIDO. AHORA.' : <>ELEGÍ LA CANCHA.{ '\n' }ARMÁ LA CONVOCATORIA.</>}</Text>
        <Text style={kit.body}>Elegí dónde y cómo jugar. No necesitás un equipo ni agregar la cancha.</Text></View>
      <GenericMedia compact asset="player" size={36} />
      {!action.ready && <ActivityIndicator accessibilityLabel="Consultando solicitud guardada" color={gameColors.orange} />}
      {action.pending && <GameNotice>Hay una solicitud guardada sin confirmar. Comprobala antes de crear otra convocatoria.</GameNotice>}
      {!quick && <GamePanel tone="light">
        <View style={kit.row}><MapPin size={20} color={gameColors.orange} /><Text style={kit.section}>Elegí la cancha</Text></View>
        {courts.isPending ? <ActivityIndicator color={gameColors.orange} /> : courts.isError ? <>
          <GameNotice>No pudimos cargar las canchas.</GameNotice><GameButton secondary label="Reintentar canchas" onPress={() => void courts.refetch()} />
        </> : courts.data?.map(court => <GameChoice key={court.id} label={court.name} selected={draft.courtId === court.id}
          style={{ flexBasis: 'auto', minHeight: 64, borderColor: draft.courtId === court.id ? palette.orange : palette.separator }}
          disabled={disabled} onPress={() => change('courtId', court.id)} />)}
        {errors.courtId && <Text accessibilityRole="alert" style={kit.error}>{errorText(errors.courtId)}</Text>}
      </GamePanel>}
      {!quick && <GamePanel tone="light"><Text style={kit.section}>Elegí el formato</Text>
        <FormatChoices value={draft.format} disabled={disabled} onChange={format => change('format', format)} />
      </GamePanel>}
      {quick && (courts.isError ? <GamePanel tone="light"><GameNotice>No pudimos cargar las canchas.</GameNotice><GameButton secondary label="Reintentar canchas" onPress={() => void courts.refetch()} /></GamePanel> : <GamePanel tone="light"><Text style={kit.section}>{courts.data?.find(court => court.id === draft.courtId)?.name ?? 'Cancha seleccionada'} · {draft.format}</Text><Text style={kit.body}>Una convocatoria para ahora. Iniciá el juego cuando estén listos.</Text>{errors.courtId && <GameNotice>{errorText(errors.courtId)}</GameNotice>}</GamePanel>)}
      {!quick && <GamePanel tone="light"><Text style={kit.section}>¿Cuándo jugamos?</Text>
        <View style={kit.row}><GameChoice label="Ahora" detail="Encontrá con quién jugar hoy" selected={false} disabled={disabled} onPress={openQuickSetup} />
          <GameChoice label="Planificar" detail="Elegí fecha y hora" selected={showConfiguration} disabled={disabled} onPress={() => { change('timing', 'future'); setPlanned(true); }} /></View>
        {showConfiguration && draft.timing === 'future' && <>
          <GameField label="Fecha" help="YYYY-MM-DD" value={draft.date} editable={!disabled} autoCapitalize="none" maxLength={10} error={errorText(errors.date)} onChangeText={value => change('date', value)} />
          <GameField label="Hora" help="HH:MM · hora local" value={draft.time} editable={!disabled} maxLength={5} error={errorText(errors.time)} onChangeText={value => change('time', value)} />
        </>}
        {showConfiguration && <Text style={kit.help}>Quien organiza inicia el juego. La hora planificada no cierra las inscripciones automáticamente.</Text>}
      </GamePanel>}
      {!quick && action.pending && draft.timing === 'now' && <GameButton label="Retomar convocatoria para ahora" onPress={openQuickSetup} />}
      {showConfiguration && <>
      <GamePanel tone="light"><Text style={kit.section}>¿Vas a jugar?</Text>
        <View style={kit.row}><GameChoice label="Voy a jugar" selected={draft.organizerPlays} disabled={disabled} onPress={() => participation(true)} />
          <GameChoice label="Solo organizo" selected={!draft.organizerPlays} disabled={disabled} onPress={() => participation(false)} /></View>
        {draft.timing === 'now' && <GameField label="Personas que ya están" help="Incluite si jugás y contá a las personas invitadas sin cuenta."
          value={draft.presentCount} editable={!disabled} keyboardType="number-pad" maxLength={2} error={errors.presentCount} onChangeText={value => change('presentCount', value)} />}
        <View style={{ padding: 16, borderRadius: 14, backgroundColor: palette.cream, gap: 6 }}>
          <Text variant="display" style={{ color: palette.navy }}>{available !== null && available >= 0 ? available : '—'} lugares disponibles</Text>
          <Text style={kit.help}>{capacity} en total · {draft.timing === 'future' ? 'Tu lugar cuenta solo si vas a jugar.' : 'Las personas presentes cuentan para el límite.'}</Text>
        </View>
      </GamePanel>
      <GamePanel tone="light"><GameField label="Nota para quienes juegan (opcional)" help={`${draft.description.length}/500 caracteres`} value={draft.description} editable={!disabled}
        multiline maxLength={500} error={errorText(errors.description)} onChangeText={value => change('description', value)} /></GamePanel>
      {action.error && <GameNotice>{action.error}</GameNotice>}
      <GameButton label={action.pending ? 'Reintentar comprobación' : 'Crear convocatoria'} busy={action.busy}
        disabled={!action.ready || (!action.pending && (courts.isPending || courts.isError))} icon={<ArrowRight size={20} color={gameColors.ink} />} onPress={() => void submit()} />
      <Text style={kit.help}>Tu nombre y participantes son visibles para quienes tienen sesión iniciada. La convocatoria no reserva la cancha.</Text>
      </>}
    </ScrollView>
  </KeyboardAvoidingView>;
}

export default function OrganizeGameScreen() { return <CreateInvitationScreen />; }
