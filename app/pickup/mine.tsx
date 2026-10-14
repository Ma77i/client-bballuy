import { RefreshControl, ScrollView, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Text from '@/components/pickup/GameText';
import { useCourtCatalog } from '@/hooks/catalog';
import { usePersonalSessions } from '@/hooks/pickup';
import { dateText as dateLabel } from '@/components/pickup/presentation';
import { GameLoading as ActivityIndicator, GameButton, ArcadeNotice as GameNotice, GamePanel, gameColors, kit } from '@/components/pickup/Kit';
import SessionCard from '@/components/pickup/SessionCard';

export default function MySessionsScreen() {
  const sessions = usePersonalSessions(), courts = useCourtCatalog();
  const router = useRouter();
  return <ScrollView style={kit.page} contentContainerStyle={kit.content}
    refreshControl={<RefreshControl refreshing={sessions.isFetching && !sessions.isPending} tintColor={gameColors.orange} onRefresh={() => void sessions.refetch()} />}>
    <Stack.Screen options={{ headerBackTitle: 'Volver', title: 'Mis convocatorias', headerStyle: { backgroundColor: gameColors.ink }, headerTintColor: '#fff' }} />
    <View style={{ gap: 8 }}><Text style={kit.kicker}>TUS PRÓXIMOS PARTIDOS</Text><Text style={kit.title}>Mis convocatorias</Text>
      <Text style={kit.body}>Las convocatorias que organizás y en las que te inscribiste.</Text></View>
    {sessions.isPending && <ActivityIndicator accessibilityLabel="Cargando mis convocatorias" color={gameColors.orange} />}
    {sessions.isError && <GamePanel><GameNotice>No pudimos comprobar tus convocatorias. Los datos anteriores pueden estar desactualizados.</GameNotice>
      <GameButton secondary label="Reintentar mis convocatorias" onPress={() => void sessions.refetch()} /></GamePanel>}
    {sessions.data && <Text style={kit.help}>Última comprobación {dateLabel(sessions.dataUpdatedAt)}</Text>}
    {!sessions.isPending && !sessions.isError && !sessions.data?.length && <GamePanel><Text style={kit.section}>TU PRÓXIMO PARTIDO EMPIEZA ACÁ.</Text>
      <Text style={kit.body}>Buscá dónde inscribirte u organizá. Las convocatorias canceladas siguen acá si las organizás o conservás una inscripción.</Text></GamePanel>}
    {(['open', 'started', 'cancelled', 'completed'] as const).map(state => {
      const entries = sessions.data?.filter(entry => entry.game.state === state) ?? [];
      const labels = { open: 'Abiertas', started: 'Iniciadas · actividad reportada', cancelled: 'Canceladas', completed: 'Finalizadas' };
      return entries.length > 0 ? <View key={state} style={{ gap: 16 }}><Text style={kit.section}>{labels[state]}</Text>
        {entries.map(entry => <View key={entry.game.id} style={{ gap: 8 }}><Text style={kit.help}>
          {entry.organizing ? 'Organizás esta convocatoria' : 'Tu inscripción'}{entry.joined ? ' · Inscripción registrada' : ' · Sin lugar para jugar'}
        </Text><SessionCard arcade game={entry.game} courtName={courts.data?.find(court => court.id === entry.game.court_id)?.name ?? 'Cancha'} /></View>)}
      </View> : null;
    })}
    {courts.isError && <GamePanel><GameNotice>No pudimos cargar los nombres de las canchas.</GameNotice><GameButton secondary label="Reintentar nombres de canchas" onPress={() => void courts.refetch()} /></GamePanel>}
    <GameButton secondary label="Buscar convocatoria" onPress={() => router.navigate('/(tabs)/play')} />
  </ScrollView>;
}
