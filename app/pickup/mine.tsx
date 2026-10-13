import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Text from '@/components/AppText';
import { useCourtCatalog } from '@/hooks/catalog';
import { usePersonalSessions } from '@/hooks/pickup';
import { dateLabel } from '@/lib/pickup/discovery';
import { GameButton, GameNotice, GamePanel, gameColors, kit } from '@/components/pickup/Kit';
import SessionCard from '@/components/pickup/SessionCard';

export default function MySessionsScreen() {
  const sessions = usePersonalSessions(), courts = useCourtCatalog();
  const router = useRouter();
  return <ScrollView style={kit.page} contentContainerStyle={kit.content}
    refreshControl={<RefreshControl refreshing={sessions.isFetching && !sessions.isPending} tintColor={gameColors.orange} onRefresh={() => void sessions.refetch()} />}>
    <Stack.Screen options={{ title: 'My sessions', headerStyle: { backgroundColor: gameColors.ink }, headerTintColor: '#fff' }} />
    <View style={{ gap: 8 }}><Text style={kit.kicker}>YOUR NEXT RUN</Text><Text style={kit.title}>My sessions</Text>
      <Text style={kit.body}>The games you organize and the invitations where you have a player place.</Text></View>
    {sessions.isPending && <ActivityIndicator accessibilityLabel="Loading my sessions" color={gameColors.orange} />}
    {sessions.isError && <GamePanel><GameNotice>Unable to check your sessions. Previous entries below may be outdated.</GameNotice>
      <GameButton secondary label="Retry my sessions" onPress={() => void sessions.refetch()} /></GamePanel>}
    {sessions.data && <Text style={kit.help}>Last checked {dateLabel(sessions.dataUpdatedAt)}</Text>}
    {!sessions.isPending && !sessions.isError && !sessions.data?.length && <GamePanel><Text style={kit.section}>Your next game starts with an invitation.</Text>
      <Text style={kit.body}>Find a game to join or organize one. Cancelled invitations stay here while you have a recorded place or organize them.</Text></GamePanel>}
    {(['open', 'started', 'cancelled', 'completed'] as const).map(state => {
      const entries = sessions.data?.filter(entry => entry.game.state === state) ?? [];
      const labels = { open: 'Your open invitations', started: 'Playing · organizer reports', cancelled: 'Cancelled', completed: 'Closed' };
      return entries.length > 0 ? <View key={state} style={{ gap: 16 }}><Text style={kit.section}>{labels[state]}</Text>
        {entries.map(entry => <View key={entry.game.id} style={{ gap: 8 }}><Text style={kit.help}>
          {entry.organizing ? 'You organize this game' : 'Your registration'}{entry.joined ? ' · Player place recorded' : ' · Not taking a player place'}
        </Text><SessionCard game={entry.game} courtName={courts.data?.find(court => court.id === entry.game.court_id)?.name ?? 'Court'} /></View>)}
      </View> : null;
    })}
    {courts.isError && <GamePanel><GameNotice>Unable to load court names.</GameNotice><GameButton secondary label="Retry court names" onPress={() => void courts.refetch()} /></GamePanel>}
    <GameButton secondary label="Find a game" onPress={() => router.navigate('/(tabs)/play')} />
  </ScrollView>;
}
