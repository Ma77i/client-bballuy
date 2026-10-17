import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, View, useWindowDimensions } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight, CalendarDays, Zap, UserRound, Users, Check } from 'lucide-react-native';
import Text from '@/components/pickup/GameText';
import Colors from '@/constants/colors';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PlannedSchedule from './PlannedSchedule';
import FormatChoices from './FormatChoices';
import { PlayArt } from './PlayArt';
import Dropdown from '@/components/ui/dropdown';
import { palette } from '@/constants/design';
import { errorText } from './error-copy';
import { GameLoading as ActivityIndicator, GameButton, GameChoice, ArcadeField as GameField, ArcadeNotice as GameNotice, GamePanel, gameColors, kit } from '@/components/pickup/Kit';
import { useCourtCatalog } from '@/hooks/catalog';
import { useOrganizerAction } from '@/hooks/organizer';
import { capacities, defaultSessionDraft, pickupFormats, restoredSessionDraft, validateSessionDraft, type DraftErrors, type SessionDraft } from '@/lib/pickup/organizer';

export function CreateInvitationScreen({ quick = false }: { quick?: boolean }) {
  const { courtId, format } = useLocalSearchParams<{ courtId?: string; format?: string }>();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { width, fontScale } = useWindowDimensions();
  const expanded = width < 350 || fontScale >= 1.4;
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
  return <KeyboardAvoidingView style={kit.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={headerHeight}>
    <Stack.Screen options={{ headerBackTitle: 'Volver', title: quick ? 'Jugar ahora' : 'Armar partido', headerStyle: { backgroundColor: gameColors.ink }, headerTintColor: Colors.text }} />
    <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: Math.max(insets.bottom, 12) + 24, gap: 16, maxWidth: 680, width: '100%', alignSelf: 'center' }} keyboardShouldPersistTaps="handled" keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'} automaticallyAdjustKeyboardInsets={false}>
      <View style={{ flexDirection: expanded ? 'column' : 'row', gap: 8, alignItems: 'center' }}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[kit.kicker, { letterSpacing: 0 }]}>BBallUY ARCADE</Text>
          <Text variant="display" style={{ fontSize: 34, lineHeight: 38 }}>ARMAR PARTIDO</Text>
          <Text style={[kit.body, { fontSize: 14, lineHeight: 20 }]}>{quick ? 'Completá los detalles.' : 'Elegí dónde y cuándo jugar.'}</Text>
        </View>
        <PlayArt kind="header" style={{ width: expanded ? '100%' : '35%', height: expanded ? 88 : 96 }} />
      </View>
      {!action.ready && <ActivityIndicator accessibilityLabel="Consultando solicitud guardada" color={gameColors.orange} />}
      {action.pending && <GameNotice>Partido sin confirmar. Reintentá la comprobación antes de armar otro.</GameNotice>}
      <View style={{ gap: 8 }}>
        {courts.isPending ? <ActivityIndicator accessibilityLabel="Cargando canchas" color={gameColors.orange} /> : courts.isError ? <GamePanel tone="light">
          <GameNotice>No pudimos cargar las canchas.</GameNotice><GameButton secondary label="Reintentar canchas" onPress={() => void courts.refetch()} />
        </GamePanel> : <Dropdown arcade label="Cancha" placeholder="Elegí una cancha" disabled={disabled}
          selectedValue={draft.courtId} onValueChange={value => change('courtId', value)}
          options={(courts.data ?? []).map(court => ({ label: court.name, value: court.id }))} />}
        {errors.courtId && <Text accessibilityRole="alert" style={kit.error}>{errorText(errors.courtId)}</Text>}
      </View>
      {!quick && <View style={{ gap: 8 }}><Text style={kit.section}>Formato</Text>
        <FormatChoices illustrated value={draft.format} disabled={disabled} onChange={format => change('format', format)} />
      </View>}
      {quick && <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Check size={18} color={palette.orange} aria-hidden /><Text style={kit.help}>Jugar ahora · {draft.format} · {capacity} lugares en total</Text>
      </View>}
      {!quick && <View style={{ gap: 8 }}><Text style={kit.section}>¿Cuándo?</Text>
        <View style={[kit.row, { alignItems: 'stretch' }]}>
          <GameChoice tone="light" label="Jugar ahora" detail="Ir a configuración rápida" icon={<Zap size={24} />} selected={false} disabled={disabled}
            style={{ minWidth: expanded ? '100%' : 144, borderColor: palette.cream }} onPress={openQuickSetup} />
          <GameChoice tone="light" label="Planificar" detail="Elegí fecha y hora" icon={<CalendarDays size={24} />} selected={showConfiguration} disabled={disabled}
            style={{ minWidth: expanded ? '100%' : 144, borderColor: showConfiguration ? palette.orange : palette.cream }} onPress={() => { change('timing', 'future'); setPlanned(true); }} />
        </View>
        {showConfiguration && draft.timing === 'future' && <GamePanel tone="light" style={{ padding: 12, gap: 8, borderColor: palette.cream }}>
          <PlannedSchedule value={{ date: draft.date, time: draft.time }} disabled={disabled} expanded={expanded} errors={{ date: errors.date, time: errors.time }}
            onChange={selection => { setDraft(old => ({ ...old, ...selection })); setErrors(old => ({ ...old, date: undefined, time: undefined })); }} />
          <Text style={kit.help}>Quien organiza inicia el partido.</Text>
        </GamePanel>}
      </View>}
      {!quick && action.pending && draft.timing === 'now' && <GameButton label="Retomar partido para ahora" onPress={openQuickSetup} />}
      {showConfiguration && <>
        <View style={{ gap: 8 }}><Text style={kit.section}>¿Cómo vas a participar?</Text>
          <View style={[kit.row, { alignItems: 'stretch' }]}>
            <GameChoice tone="light" label="Juego" detail="Mi lugar cuenta" icon={<UserRound size={24} />} selected={draft.organizerPlays} disabled={disabled}
              style={{ minWidth: expanded ? '100%' : 144, borderColor: draft.organizerPlays ? palette.orange : palette.cream }} onPress={() => participation(true)} />
            <GameChoice tone="light" label="Solo organizo" detail="Armo el partido sin jugar" icon={<Users size={24} />} selected={!draft.organizerPlays} disabled={disabled}
              style={{ minWidth: expanded ? '100%' : 144, borderColor: !draft.organizerPlays ? palette.orange : palette.cream }} onPress={() => participation(false)} />
          </View>
        </View>
        <GamePanel tone="light" style={{ padding: 12, gap: 8, borderColor: palette.cream }}>
          {draft.timing === 'now' && <GameField compact label="Personas ya presentes" help="Incluite si jugás; contá a quienes ya están sin cuenta."
            value={draft.presentCount} editable={!disabled} keyboardType="number-pad" maxLength={2} error={errors.presentCount} onChangeText={value => change('presentCount', value)} />}
          <Text variant="label">{available !== null && available >= 0 ? available : '—'} lugares disponibles · {capacity} en total</Text>
          {draft.timing === 'future' && <Text style={kit.help}>Tu lugar cuenta solo si jugás.</Text>}
        </GamePanel>
        <GamePanel tone="light" style={{ padding: 12, borderColor: palette.cream }}><GameField compact label="Descripción (opcional)" help={`${draft.description.length}/500 caracteres`} value={draft.description} editable={!disabled}
          multiline style={{ minHeight: 72 }} maxLength={500} error={errors.description} onChangeText={value => change('description', value)} /></GamePanel>
        <Text style={[kit.help, { fontSize: 12, lineHeight: 18 }]}>Tu nombre y participantes son visibles para otras cuentas.</Text>
        {action.error && <GameNotice>{errorText(action.error)?.replace(/La convocatoria/g, 'El partido').replace(/la convocatoria/g, 'el partido')}</GameNotice>}
        <Text variant="label" accessibilityLabel={`Formato confirmado: ${draft.format}, ${capacity} lugares en total`} style={{ color: palette.orange }}>{draft.format} · {capacity} lugares en total</Text>
        <GameButton label={action.pending ? 'Reintentar comprobación' : 'Armar partido'} busy={action.busy}
          foregroundColor={palette.navy} style={{ backgroundColor: palette.orange, borderColor: palette.orange }}
          disabled={!action.ready || (!action.pending && (courts.isPending || courts.isError))} icon={<ArrowRight size={20} color={gameColors.ink} />} onPress={() => { Keyboard.dismiss(); void submit(); }} />
        <Text style={kit.help}>Armar un partido no reserva la cancha.</Text>
      </>}
    </ScrollView>
  </KeyboardAvoidingView>;
}

export default function OrganizeGameScreen() { return <CreateInvitationScreen />; }

