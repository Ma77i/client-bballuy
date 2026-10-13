import { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import Text from '@/components/AppText';
import { useCourtCatalog } from '@/hooks/catalog';
import { usePublicSessions } from '@/hooks/pickup';
import { dateLabel, sessionGroups } from '@/lib/pickup/discovery';
import { pickupFormats } from '@/lib/pickup/organizer';
import { GameButton, GameChoice, GameNotice, GamePanel, gameColors, kit } from './Kit';
import SessionCard from './SessionCard';

export default function DiscoverGames({ games }: { games: ReturnType<typeof usePublicSessions> }) {
  const courts = useCourtCatalog();
  const [courtId, setCourt] = useState('');
  const [format, setFormat] = useState('');
  const rows = (games.data ?? []).filter(game => (!courtId || game.court_id === courtId) && (!format || game.format === format));
  const groups = sessionGroups(rows);
  const hasGames = groups.immediate.length + groups.upcoming.length + groups.playing.length > 0;
  function cards(key: 'immediate' | 'upcoming' | 'playing', title: string) {
    if (!groups[key].length) return null;
    return <View style={{ gap: 16 }}><Text style={kit.section}>{title}</Text>{groups[key].map(game =>
      <SessionCard key={game.id} game={game} courtName={courts.data?.find(court => court.id === game.court_id)?.name ?? 'Court'} />)}</View>;
  }
  return <View style={{ gap: 18 }}>
    <Text style={kit.section}>Find your next game</Text>
    <Text style={kit.body}>Open to every signed-in player. Explore any court, even if you do not follow it.</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
      <GameChoice label="All courts" selected={!courtId} onPress={() => setCourt('')} />
      {courts.data?.map(court => <GameChoice key={court.id} label={court.name} selected={courtId === court.id} onPress={() => setCourt(court.id)} />)}
    </ScrollView>
    <View style={kit.row}><GameChoice label="All" selected={!format} onPress={() => setFormat('')} />
      {pickupFormats.map(value => <GameChoice key={value} label={value} selected={format === value} onPress={() => setFormat(value)} />)}</View>
    {courts.isError && <GamePanel><GameNotice>Unable to load court names. Game data remains separate.</GameNotice>
      <GameButton secondary label="Retry court names" onPress={() => void courts.refetch()} /></GamePanel>}
    {games.isPending && <ActivityIndicator accessibilityLabel="Loading available games" color={gameColors.orange} />}
    {games.isError && <GamePanel><GameNotice>Unable to check the latest games. Previous invitations or reports below may be outdated.</GameNotice>
      <GameButton secondary label="Retry available games" onPress={() => void games.refetch()} /></GamePanel>}
    {games.data && <Text style={kit.help}>Last checked {dateLabel(games.dataUpdatedAt)} · {games.isFetching ? 'Refreshing…' : 'Refreshes every 30 seconds while viewing.'}</Text>}
    {!games.isPending && !games.isError && !hasGames && <GamePanel><Text style={kit.section}>{courtId || format ? 'No games match these filters.' : 'The next game could be yours.'}</Text>
      <Text style={kit.body}>No open invitations or reported games in progress{courtId || format ? ' match your selection' : ' yet'}. Organize one to bring players together.</Text></GamePanel>}
    {cards('immediate', 'Open now')}
    {cards('upcoming', 'Plan your next game')}
    {cards('playing', 'Playing · organizer reports')}
  </View>;
}
