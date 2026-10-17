import MatchSummary from '@/components/pickup/MatchSummary';
import { PlayArt } from '@/components/pickup/PlayArt';
import { palette } from '@/constants/design';
import MotionLink from '@/components/pickup/MotionLink';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Text from '@/components/pickup/GameText';
import { useRecordedMatches } from '@/hooks/matches';
import { useCourtCatalog } from '@/hooks/catalog';
import { GameLoading as ActivityIndicator, GameButton, ArcadeNotice as GameNotice, GamePanel, gameColors, kit } from '@/components/pickup/Kit';

export default function MatchesScreen() {
  const matches = useRecordedMatches(), courts = useCourtCatalog(), router = useRouter();
  return <ScrollView style={kit.page} contentContainerStyle={[kit.content, { padding: 12, gap: 12 }]} refreshControl={<RefreshControl refreshing={matches.isFetching && !matches.isPending} tintColor={gameColors.orange} onRefresh={() => void matches.refetch()} />}>
    <Stack.Screen options={{ headerBackTitle: 'Volver', title: 'Historial de partidos', headerStyle: { backgroundColor: gameColors.ink }, headerTintColor: '#fff' }} />
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Text style={[kit.body, { flex: 1 }]}>Tus partidos registrados y resultados declarados.</Text><PlayArt kind="header" style={{ width: 128, height: 72 }} />
    </View>
    <GameButton label="Registrar partido" foregroundColor={palette.navy} style={{ backgroundColor: palette.orange, borderColor: palette.orange }} onPress={() => router.push('/matches/create')} />
    {matches.isPending && <ActivityIndicator color={gameColors.orange} />}
    {matches.isError && <GamePanel tone="light"><GameNotice>No pudimos comprobar los partidos. Los datos anteriores pueden estar desactualizados.</GameNotice><GameButton secondary label="Reintentar partidos" onPress={() => void matches.refetch()} /></GamePanel>}
    {!matches.isPending && !matches.isError && !matches.data?.length && <GamePanel tone="light"><Text style={kit.section}>Todavía no registraste partidos.</Text><Text style={kit.body}>Registrá ambos lados y después el resultado final.</Text></GamePanel>}
    {matches.data?.map(game => <MotionLink key={game.id} accessibilityRole="button" accessibilityLabel={`Ver partido registrado ${game.format}`} onPress={() => router.push({ pathname: '/matches/[id]', params: { id: game.id } })}>
      <MatchSummary game={game} courtName={courts.data?.find(c => c.id === game.court_id)?.name ?? 'Cancha'} />
    </MotionLink>)}
  </ScrollView>;
}
