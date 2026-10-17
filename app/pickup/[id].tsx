import GameSummary from '@/components/pickup/GameSummary';
import { palette } from '@/constants/design';
import { UserRound } from 'lucide-react-native';
import { detailErrorText as errorText } from '@/components/pickup/detail-copy';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Text from '@/components/pickup/GameText';
import { useAuth } from '@/contexts/AuthContext';
import { useCourtCatalog } from '@/hooks/catalog';
import { usePublicSession } from '@/hooks/pickup';
import { dateText as dateLabel, scheduleText as scheduledLabel } from '@/components/pickup/presentation';
import { GameLoading as ActivityIndicator, GameButton, ArcadeNotice as GameNotice, GamePanel, gameColors, kit } from '@/components/pickup/Kit';
import ParticipationControls from '@/components/pickup/ParticipationControls';

export default function PublicGameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const detail = usePublicSession(id);
  const courts = useCourtCatalog();
  const owner = useAuth().session?.user.id;
  const router = useRouter();
  const game = detail.data?.game;
  const court = courts.data?.find(row => row.id === game?.court_id);
  return <ScrollView style={kit.page} contentContainerStyle={[kit.content, { padding: 12, gap: 12 }]}
    refreshControl={<RefreshControl refreshing={detail.isFetching && !detail.isPending} tintColor={gameColors.orange} onRefresh={() => void detail.refetch()} />}>
    <Stack.Screen options={{ headerBackTitle: 'Volver', title: 'Detalle de partido', headerStyle: { backgroundColor: gameColors.ink }, headerTintColor: '#fff' }} />
    {detail.isPending && <ActivityIndicator accessibilityLabel="Cargando partido" color={gameColors.orange} />}
    {detail.isError && <GamePanel tone="light"><GameNotice>{errorText(detail.error.message)}{game ? ' Los datos anteriores pueden estar desactualizados.' : ''}</GameNotice>
      <GameButton secondary label="Reintentar detalle" onPress={() => void detail.refetch()} /></GamePanel>}
    {game && <>
      <GameSummary game={game} courtName={court?.name ?? 'Cancha'} schedule={scheduledLabel(game)} />
      <Text style={kit.help}>Última comprobación {dateLabel(detail.dataUpdatedAt)}</Text>
      {owner === game.organizer_id && <GameButton label="Gestionar partido" foregroundColor={palette.navy}
        style={{ backgroundColor: palette.orange, borderColor: palette.orange }} disabled={detail.isError || detail.isFetching}
        onPress={() => router.push({ pathname: '/organize/[id]', params: { id: game.id } })} />}
    </>}
    <ParticipationControls key={`${owner}:${id}`} sessionId={id} detail={detail.data} readable={!detail.isError && !detail.isFetching && Boolean(detail.data)} />
    {game && <>
      <GamePanel tone="light" style={{ gap: 8 }}>
        <Text style={kit.section}>Organiza: {game.organizer_name}</Text>
        <Text style={kit.help}>{game.organizer_plays ? 'Quien organiza ocupa un lugar.' : 'Quien organiza no ocupa un lugar.'} El partido no reserva la cancha.</Text>
        {game.state === 'started' && <Text style={kit.help}>El inicio es un reporte; no confirma asistencia.</Text>}
        {game.state === 'cancelled' && <GameNotice>Este partido fue cancelado.</GameNotice>}
        {game.state === 'completed' && <Text style={kit.help}>El partido finalizó; el cierre no registra un resultado.</Text>}
        {Boolean(game.description) && <><Text style={kit.section}>Nota de quien organiza</Text><Text style={kit.body}>{game.description}</Text></>}
      </GamePanel>
      <GamePanel tone="light" style={{ gap: 8 }}><Text style={kit.section}>Participantes</Text>
        <Text style={kit.help}>Inscripciones e invitados presentes; no confirman asistencia.</Text>
        {detail.data?.rosterChanged && <GameNotice>Los lugares cambiaron durante la consulta. Actualizá para comprobar la lista y el total.</GameNotice>}
        {!detail.data?.places.length && <Text style={kit.body}>Todavía no hay participantes registrados.</Text>}
        {detail.data?.places.map(place => <View key={place.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48, borderTopWidth: 1, borderTopColor: palette.muted, paddingVertical: 6 }}>
          <UserRound size={20} color={palette.navy} /><View style={{ flex: 1, gap: 2 }}>
            <Text style={kit.body}>{place.name}</Text><Text style={kit.help}>{place.guest ? 'Invitado presente · sin cuenta' : 'Participante registrado'}</Text>
          </View>
        </View>)}
      </GamePanel>
      {courts.isError && <GamePanel tone="light"><GameNotice>No pudimos cargar el nombre de la cancha.</GameNotice><GameButton secondary label="Reintentar cancha" onPress={() => void courts.refetch()} /></GamePanel>}
      <GameButton quiet label="Ver cancha" onPress={() => router.push({ pathname: '/court/[id]', params: { id: game.court_id } })} />
    </>}
  </ScrollView>;
}
