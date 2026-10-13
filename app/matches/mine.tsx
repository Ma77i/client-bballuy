import { ActivityIndicator, Pressable, RefreshControl, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Text from '@/components/AppText';
import { useRecordedMatches } from '@/hooks/matches';
import { useCourtCatalog } from '@/hooks/catalog';
import { dateLabel } from '@/lib/pickup/discovery';
import { GameButton, GameNotice, GamePanel, gameColors, kit } from '@/components/pickup/Kit';

export default function MatchesScreen() {
  const matches = useRecordedMatches(), courts = useCourtCatalog(), router = useRouter();
  return <ScrollView style={kit.page} contentContainerStyle={kit.content} refreshControl={<RefreshControl refreshing={matches.isFetching && !matches.isPending} tintColor={gameColors.orange} onRefresh={() => void matches.refetch()} />}>
    <Stack.Screen options={{ title: 'Recorded matches', headerStyle: { backgroundColor: gameColors.ink }, headerTintColor: '#fff' }} />
    <Text style={kit.kicker}>KEEP THE SCORE</Text><Text style={kit.title}>Your recorded matches.</Text><GameButton label="Record a match" onPress={() => router.push('/matches/create')} />
    {matches.isPending && <ActivityIndicator color={gameColors.orange} />}
    {matches.isError && <GamePanel><GameNotice>Unable to check matches. Previous entries may be outdated.</GameNotice><GameButton secondary label="Retry matches" onPress={() => void matches.refetch()} /></GamePanel>}
    {!matches.isPending && !matches.isError && !matches.data?.length && <GamePanel><Text style={kit.section}>No matches recorded yet.</Text><Text style={kit.body}>Record two sides, then save their final score.</Text></GamePanel>}
    {matches.data?.map(game => <Pressable key={game.id} accessibilityRole="button" accessibilityLabel={`View recorded ${game.format} match`} onPress={() => router.push({ pathname: '/matches/[id]', params: { id: game.id } })}>
      <GamePanel><Text style={kit.badge}>{game.state === 'completed' ? 'CLOSED · DECLARED RESULT' : 'AWAITING FINAL SCORE'}</Text><Text style={kit.section}>{game.format} · {courts.data?.find(c => c.id === game.court_id)?.name ?? 'Court'}</Text><Text style={kit.body}>{game.state === 'completed' ? `${game.score_a} – ${game.score_b}` : 'Final score pending'} · {dateLabel(game.created_at)}</Text></GamePanel>
    </Pressable>)}
  </ScrollView>;
}
