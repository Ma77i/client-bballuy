import { ActivityIndicator, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUpRight, CalendarDays, Plus, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '@/components/AppText';
import Colors from '@/constants/colors';
import { GameButton, GameNotice, GamePanel, gameColors, kit } from '@/components/pickup/Kit';
import { useOrganizedSessions } from '@/hooks/organizer';
import { useCourtCatalog } from '@/hooks/catalog';
import { sessionStateLabel } from '@/lib/pickup/organizer';
import DiscoverGames from '@/components/pickup/DiscoverGames';
import { usePublicSessions } from '@/hooks/pickup';

export default function PlayScreen() {
  const router = useRouter();
  const games = useOrganizedSessions();
  const courts = useCourtCatalog();
  const discovery = usePublicSessions();
  return <SafeAreaView style={kit.page} edges={['top', 'left', 'right']}>
    <Stack.Screen options={{ title: 'Play', headerShown: false }} />
    <ScrollView contentContainerStyle={kit.content}
      refreshControl={<RefreshControl refreshing={(games.isFetching && !games.isPending) || (discovery.isFetching && !discovery.isPending)} onRefresh={() => void Promise.all([games.refetch(), discovery.refetch()])} tintColor={gameColors.orange} />}>
      <View style={{ gap: 6 }}>
        <Text style={kit.kicker}>MAKE THE NEXT GAME HAPPEN</Text>
        <Text style={kit.title}>Your court.{ '\n' }Your next game.</Text>
        <Text style={kit.body}>Find people to play with, or bring a new game together.</Text>
      </View>
      <LinearGradient colors={['#3b261e', '#1d2536']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ borderRadius: 24, borderWidth: 1, borderColor: '#754429', padding: 22, gap: 20, overflow: 'hidden' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={kit.kicker}>OPEN INVITATION</Text><Zap color={gameColors.orange} size={28} />
        </View>
        <Text style={{ color: Colors.text, fontSize: 25, fontFamily: 'Lexend-Bold' }}>A spot for your{ '\n' }kind of basketball.</Text>
        <View style={kit.row}>{['1v1', '2v2', '5v5'].map(format => <Text key={format}
          style={{ color: gameColors.orange, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#372923', fontFamily: 'Lexend-SemiBold' }}>{format}</Text>)}</View>
        <GameButton label="Organize a game" icon={<Plus size={20} color={gameColors.ink} />} onPress={() => router.push('/organize/create')} />
        <GameButton secondary label="My sessions" onPress={() => router.push('/pickup/mine')} />
        <GameButton secondary label="Recorded matches" onPress={() => router.push('/matches/mine')} />
        <Text style={kit.help}>Play now or plan ahead. No team or court membership needed.</Text>
      </LinearGradient>
      <DiscoverGames games={discovery} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={kit.section}>Games you organize</Text>
        <Pressable accessibilityRole="button" onPress={() => void games.refetch()}><Text style={kit.badge}>Refresh</Text></Pressable>
      </View>
      {games.isPending ? <ActivityIndicator accessibilityLabel="Loading your games" color={gameColors.orange} /> : games.isError ? <GamePanel>
        <GameNotice>Unable to load your games.</GameNotice><GameButton secondary label="Retry" onPress={() => void games.refetch()} />
      </GamePanel> : !games.data?.length ? <GamePanel>
        <CalendarDays size={30} color={gameColors.muted} />
        <Text style={kit.section}>Your first invitation starts here.</Text>
        <Text style={kit.body}>Organize at a court you know. Your invitations will stay here so you can manage them.</Text>
      </GamePanel> : games.data.map(game => <Pressable key={game.id} accessibilityRole="button"
        accessibilityLabel={`Manage ${game.format} at ${courts.data?.find(c => c.id === game.court_id)?.name ?? 'court'}`}
        onPress={() => router.push({ pathname: '/organize/[id]', params: { id: game.id } })}>
        <GamePanel>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={kit.badge}>{sessionStateLabel(game.state)}</Text><ArrowUpRight size={20} color={gameColors.muted} />
          </View>
          <Text style={{ color: Colors.text, fontFamily: 'Lexend-Bold', fontSize: 22 }}>{game.format} · {courts.data?.find(c => c.id === game.court_id)?.name ?? 'Court'}</Text>
          <Text style={kit.body}>{game.timing === 'now' ? 'Organized for now' : new Date(game.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</Text>
          <Text style={kit.help}>{game.occupied_places}/{game.capacity} places occupied{game.state === 'open' ? ` · ${game.available_places} available` : ''}</Text>
        </GamePanel>
      </Pressable>)}
    </ScrollView>
  </SafeAreaView>;
}
