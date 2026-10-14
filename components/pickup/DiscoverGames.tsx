import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Text from '@/components/pickup/GameText';
import { useCourtCatalog } from '@/hooks/catalog';
import { usePublicSessions } from '@/hooks/pickup';
import { sessionGroups } from '@/lib/pickup/discovery';
import { dateText as dateLabel } from './presentation';
import { pickupFormats } from '@/lib/pickup/organizer';
import { GameLoading as ActivityIndicator, GameButton, GameChoice, ArcadeNotice as GameNotice, GamePanel, gameColors, kit } from './Kit';
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
      <SessionCard arcade key={game.id} game={game} courtName={courts.data?.find(court => court.id === game.court_id)?.name ?? 'Cancha'} />)}</View>;
  }
  return <View style={{ gap: 18 }}>
    <Text style={kit.section}>ENCONTRÁ TU PARTIDO</Text>
    <Text style={kit.body}>Podés jugar en cualquier cancha, aunque no la hayas agregado a Mis canchas.</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
      <GameChoice label="Todas las canchas" selected={!courtId} onPress={() => setCourt('')} />
      {courts.data?.map(court => <GameChoice key={court.id} label={court.name} selected={courtId === court.id} onPress={() => setCourt(court.id)} />)}
    </ScrollView>
    <View style={kit.row}><GameChoice label="Todos" selected={!format} onPress={() => setFormat('')} />
      {pickupFormats.map(value => <GameChoice key={value} label={value} selected={format === value} onPress={() => setFormat(value)} />)}</View>
    {courts.isError && <GamePanel><GameNotice>No pudimos cargar los nombres de las canchas. Los datos de las convocatorias se consultan por separado.</GameNotice>
      <GameButton secondary label="Reintentar nombres de canchas" onPress={() => void courts.refetch()} /></GamePanel>}
    {games.isPending && <ActivityIndicator accessibilityLabel="Cargando convocatorias" color={gameColors.orange} />}
    {games.isError && <GamePanel><GameNotice>No pudimos comprobar las convocatorias. Los datos anteriores pueden estar desactualizados.</GameNotice>
      <GameButton secondary label="Reintentar convocatorias" onPress={() => void games.refetch()} /></GamePanel>}
    {games.data && <Text style={kit.help}>Última comprobación {dateLabel(games.dataUpdatedAt)} · {games.isFetching ? 'Actualizando…' : 'Se actualiza cada 30 segundos mientras estás viendo.'}</Text>}
    {!games.isPending && !games.isError && !hasGames && <GamePanel><Text style={kit.section}>{courtId || format ? 'Sin convocatorias para estos filtros.' : 'EL PRÓXIMO PARTIDO PUEDE SER TUYO.'}</Text>
      <Text style={kit.body}>No hay convocatorias abiertas ni partidos reportados en curso{courtId || format ? ' para esta selección' : ' todavía'}. Organizá una para encontrar con quién jugar.</Text></GamePanel>}
    {cards('immediate', 'PARA JUGAR AHORA')}
    {cards('upcoming', 'PLANIFICADAS')}
    {cards('playing', 'Iniciadas · actividad reportada')}
  </View>;
}
