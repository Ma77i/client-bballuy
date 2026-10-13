import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Text from '@/components/AppText';
import { useAuth } from '@/contexts/AuthContext';
import { useCourtCatalog } from '@/hooks/catalog';
import { usePublicSession } from '@/hooks/pickup';
import { dateLabel, scheduledLabel } from '@/lib/pickup/discovery';
import { sessionStateLabel } from '@/lib/pickup/organizer';
import { GameButton, GameNotice, GamePanel, gameColors, kit } from '@/components/pickup/Kit';
import ParticipationControls from '@/components/pickup/ParticipationControls';

export default function PublicGameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const detail = usePublicSession(id);
  const courts = useCourtCatalog();
  const owner = useAuth().session?.user.id;
  const router = useRouter();
  const game = detail.data?.game;
  const court = courts.data?.find(row => row.id === game?.court_id);
  return <ScrollView style={kit.page} contentContainerStyle={kit.content}
    refreshControl={<RefreshControl refreshing={detail.isFetching && !detail.isPending} tintColor={gameColors.orange} onRefresh={() => void detail.refetch()} />}>
    <Stack.Screen options={{ title: 'Game details', headerStyle: { backgroundColor: gameColors.ink }, headerTintColor: '#fff' }} />
    {detail.isPending && <ActivityIndicator accessibilityLabel="Loading game details" color={gameColors.orange} />}
    {detail.isError && <GamePanel><GameNotice>{detail.error.message}{game ? ' Previous details below may be outdated.' : ''}</GameNotice>
      <GameButton secondary label="Retry details" onPress={() => void detail.refetch()} /></GamePanel>}
    {game && <View style={{ gap: 8 }}><Text style={kit.kicker}>{game.state === 'started' ? 'PLAYING · REPORTED BY ORGANIZER' : sessionStateLabel(game.state).toUpperCase()}</Text>
        <Text style={kit.title}>{game.format}{'\n'}{court?.name ?? 'Court'}</Text><Text style={kit.body}>{scheduledLabel(game)}</Text>
        <Text style={kit.help}>Last checked {dateLabel(detail.dataUpdatedAt)}</Text></View>}
    <ParticipationControls key={`${owner}:${id}`} sessionId={id} detail={detail.data} readable={!detail.isError && !detail.isFetching && Boolean(detail.data)} />
    {game && <>
      <GamePanel><Text style={kit.section}>Organized by {game.organizer_name}</Text>
        <Text style={kit.body}>{game.organizer_plays ? 'The organizer has a player place.' : 'The organizer is not taking a player place.'}</Text>
        <Text style={[kit.section, { color: gameColors.orange }]}>{game.state === 'open' ? `${game.available_places} open places` : 'Sign-ups closed'}</Text>
        <Text style={kit.help}>{game.occupied_places}/{game.capacity} places occupied · This invitation does not reserve the court.</Text>
        {game.state === 'started' && <Text style={kit.help}>Play was started by the organizer. The start time is a report, not verified physical attendance.</Text>}
        {game.state === 'cancelled' && <GameNotice>This invitation was cancelled.</GameNotice>}
        {game.state === 'completed' && <Text style={kit.body}>This invitation is closed. Closure alone does not record a match result.</Text>}
      </GamePanel>
      {Boolean(game.description) && <GamePanel><Text style={kit.section}>Organizer note</Text><Text style={kit.body}>{game.description}</Text></GamePanel>}
      <GamePanel><Text style={kit.section}>Player places</Text>
        <Text style={kit.help}>Registrations and present guest places, not confirmed attendance.</Text>
        {detail.data?.rosterChanged && <GameNotice>Player places changed during this check. Refresh to reconcile the list and count.</GameNotice>}
        {!detail.data?.places.length && <Text style={kit.body}>No player places recorded yet.</Text>}
        {detail.data?.places.map(place => <View key={place.id} style={{ gap: 4 }}>
          <Text style={kit.section}>{place.name}</Text><Text style={kit.help}>{place.guest ? 'Present guest · no app account' : 'Registered player'}</Text>
        </View>)}
      </GamePanel>
      {owner === game.organizer_id && <GameButton label="Manage your game" disabled={detail.isError || detail.isFetching}
        onPress={() => router.push({ pathname: '/organize/[id]', params: { id: game.id } })} />}
      {courts.isError && <GamePanel><GameNotice>Unable to load the court name.</GameNotice><GameButton secondary label="Retry court" onPress={() => void courts.refetch()} /></GamePanel>}
      <GameButton secondary label="View court" onPress={() => router.push({ pathname: '/court/[id]', params: { id: game.court_id } })} />
    </>}
  </ScrollView>;
}
