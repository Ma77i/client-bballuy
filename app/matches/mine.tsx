import MotionLink from '@/components/pickup/MotionLink';
import { RefreshControl, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Text from '@/components/pickup/GameText';
import { useRecordedMatches } from '@/hooks/matches';
import { useCourtCatalog } from '@/hooks/catalog';
import { dateText as dateLabel } from '@/components/pickup/presentation';
import { GameLoading as ActivityIndicator, GameButton, ArcadeNotice as GameNotice, GamePanel, gameColors, kit } from '@/components/pickup/Kit';

export default function MatchesScreen() {
  const matches = useRecordedMatches(), courts = useCourtCatalog(), router = useRouter();
  return <ScrollView style={kit.page} contentContainerStyle={kit.content} refreshControl={<RefreshControl refreshing={matches.isFetching && !matches.isPending} tintColor={gameColors.orange} onRefresh={() => void matches.refetch()} />}>
    <Stack.Screen options={{ headerBackTitle: 'Volver', title: 'Historial de partidos', headerStyle: { backgroundColor: gameColors.ink }, headerTintColor: '#fff' }} />
    <Text style={kit.kicker}>TUS PARTIDOS</Text><Text style={kit.title}>HISTORIAL DE PARTIDOS</Text><GameButton label="Registrar partido" onPress={() => router.push('/matches/create')} />
    {matches.isPending && <ActivityIndicator color={gameColors.orange} />}
    {matches.isError && <GamePanel tone="light"><GameNotice>No pudimos comprobar los partidos. Los datos anteriores pueden estar desactualizados.</GameNotice><GameButton secondary label="Reintentar partidoes" onPress={() => void matches.refetch()} /></GamePanel>}
    {!matches.isPending && !matches.isError && !matches.data?.length && <GamePanel tone="light"><Text style={kit.section}>No matches recorded todavía.</Text><Text style={kit.body}>Registrá ambos lados y después el resultado final.</Text></GamePanel>}
    {matches.data?.map(game => <MotionLink key={game.id} accessibilityRole="button" accessibilityLabel={`Ver partido registrado ${game.format}`} onPress={() => router.push({ pathname: '/matches/[id]', params: { id: game.id } })}>
      <GamePanel tone="light"><Text style={kit.badge}>{game.state === 'completed' ? 'FINALIZADO · RESULTADO DECLARADO' : 'RESULTADO FINAL PENDIENTE'}</Text><Text style={kit.section}>{game.format} · {courts.data?.find(c => c.id === game.court_id)?.name ?? 'Cancha'}</Text><Text style={kit.body}>{game.state === 'completed' ? `${game.score_a} – ${game.score_b}` : 'Resultado final pendiente'} · {dateLabel(game.created_at)}</Text></GamePanel>
    </MotionLink>)}
  </ScrollView>;
}
