import MotionLink from '@/components/pickup/MotionLink';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUpRight, CalendarDays, Plus } from 'lucide-react-native';
import Text from '@/components/pickup/GameText';

import { GameLoading as ActivityIndicator, GameButton, ArcadeNotice as GameNotice, GamePanel, gameColors, kit } from '@/components/pickup/Kit';
import { useOrganizedSessions } from '@/hooks/organizer';
import { useCourtCatalog } from '@/hooks/catalog';
import { sessionStatus } from '@/components/pickup/presentation';
import { GenericMedia } from '@/components/foundation/GenericMedia';
import { palette } from '@/constants/design';
import DiscoverGames from '@/components/pickup/DiscoverGames';
import { usePublicSessions } from '@/hooks/pickup';

export default function PlayScreen() {
  const router = useRouter();
  const games = useOrganizedSessions();
  const courts = useCourtCatalog();
  const discovery = usePublicSessions();
  return <SafeAreaView style={kit.page} edges={['top', 'left', 'right']}>
    <Stack.Screen options={{ headerBackTitle: 'Volver', title: 'Jugar', headerShown: false }} />
    <ScrollView contentContainerStyle={kit.content}
      refreshControl={<RefreshControl refreshing={(games.isFetching && !games.isPending) || (discovery.isFetching && !discovery.isPending)} onRefresh={() => void Promise.all([games.refetch(), discovery.refetch()])} tintColor={gameColors.orange} />}>
      <View style={{ gap: 6 }}>
        <Text style={kit.kicker}>ENCONTRÁ CON QUIÉN JUGAR</Text>
        <Text style={kit.title}>TU CANCHA.{ '\n' }TU PRÓXIMO PARTIDO.</Text>
        <Text style={kit.body}>Buscá una convocatoria o armá tu próximo partido.</Text>
      </View>
      <GamePanel style={{ borderLeftWidth: 5, borderLeftColor: palette.orange, gap: 12 }}>
        <GenericMedia compact asset="player" size={36} />
        <Text variant="display" style={{ color: palette.orange }}>1v1 · 2v2 · 5v5</Text>
        <GameButton label="Organizar convocatoria" icon={<Plus size={20} color={gameColors.ink} />} onPress={() => router.push('/organize/create')} />
        <GameButton secondary label="Mis convocatorias" onPress={() => router.push('/pickup/mine')} />
        <GameButton secondary label="Historial de partidos" onPress={() => router.push('/matches/mine')} />
        <Text style={kit.help}>Jugá ahora o planificá. No necesitás un equipo ni agregar la cancha.</Text>
      </GamePanel>
      <DiscoverGames games={discovery} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={kit.section}>CONVOCATORIAS QUE ORGANIZÁS</Text>
        <GameButton secondary label="Actualizar mis convocatorias" busy={games.isFetching && !games.isPending} onPress={() => void games.refetch()} />
      </View>
      {games.isPending ? <ActivityIndicator accessibilityLabel="Cargando tus convocatorias" color={gameColors.orange} /> : games.isError ? <GamePanel>
        <GameNotice>No pudimos cargar tus convocatorias.</GameNotice><GameButton secondary label="Reintentar" onPress={() => void games.refetch()} />
      </GamePanel> : !games.data?.length ? <GamePanel>
        <CalendarDays size={30} color={gameColors.muted} />
        <Text style={kit.section}>TU PRIMERA CONVOCATORIA EMPIEZA ACÁ.</Text>
        <Text style={kit.body}>Organizá en una cancha que conozcas. Tus convocatorias quedan acá para gestionarlas.</Text>
      </GamePanel> : games.data.map(game => <MotionLink key={game.id} accessibilityRole="button"
        accessibilityLabel={`Gestionar ${game.format} en ${courts.data?.find(c => c.id === game.court_id)?.name ?? 'cancha'}`}
        onPress={() => router.push({ pathname: '/organize/[id]', params: { id: game.id } })}>
        <GamePanel tone="light" style={{ borderLeftWidth: 5, borderLeftColor: palette.orange }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={kit.badge}>{sessionStatus(game)}</Text><ArrowUpRight accessible={false} size={20} color={palette.navy} />
          </View>
          <Text variant="display">{game.format} · {courts.data?.find(c => c.id === game.court_id)?.name ?? 'Cancha'}</Text>
          <Text style={kit.body}>{game.timing === 'now' ? 'Para jugar ahora' : new Date(game.scheduled_at).toLocaleString('es-UY', { dateStyle: 'medium', timeStyle: 'short' })}</Text>
          <Text style={kit.help}>{game.occupied_places}/{game.capacity} lugares ocupados{game.state === 'open' ? ` · ${game.available_places} disponibles` : ''}</Text>
        </GamePanel>
      </MotionLink>)}
    </ScrollView>
  </SafeAreaView>;
}
