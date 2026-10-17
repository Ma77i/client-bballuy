import { View, useWindowDimensions } from 'react-native';
import Text from '@/components/pickup/GameText';
import Dropdown from '@/components/ui/dropdown';
import { useCourtCatalog } from '@/hooks/catalog';
import { usePublicSessions } from '@/hooks/pickup';
import { sessionGroups } from '@/lib/pickup/discovery';
import { pickupFormats } from '@/lib/pickup/organizer';
import { GameLoading, GameButton, ArcadeNotice, GamePanel, gameColors, kit } from './Kit';
import SessionCard from './SessionCard';

type Props = { games: ReturnType<typeof usePublicSessions>; courtId: string; format: string; onCourtChange(value: string): void; onFormatChange(value: string): void };
export default function DiscoverGames({ games, courtId, format, onCourtChange, onFormatChange }: Props) {
  const courts = useCourtCatalog();
  const { fontScale } = useWindowDimensions();
  const rows = (games.data ?? []).filter(game => (!courtId || game.court_id === courtId) && (!format || game.format === format));
  const groups = sessionGroups(rows);
  const hasGames = groups.immediate.length + groups.upcoming.length + groups.playing.length > 0;
  function cards(key: 'immediate' | 'upcoming' | 'playing', title: string) {
    if (!groups[key].length) return null;
    return <View style={{ gap: 12 }}>{key !== 'immediate' && <Text style={kit.section}>{title}</Text>}{groups[key].map(game =>
      <SessionCard sports key={game.id} game={game} courtName={courts.data?.find(court => court.id === game.court_id)?.name ?? 'Cancha'} />)}</View>;
  }
  return <View style={{ gap: 8 }}>
    <View style={{ flexDirection: fontScale >= 1.5 ? 'column' : 'row', gap: 12 }}>
      <View style={{ flex: 1, minWidth: 0 }}><Dropdown arcade label="Cancha" selectedValue={courtId} onValueChange={onCourtChange}
        options={[{ label: 'Todas', value: '' }, ...(courts.data ?? []).map(court => ({ label: court.name, value: court.id }))]} /></View>
      <View style={{ flex: 1, minWidth: 0 }}><Dropdown arcade label="Formato" selectedValue={format} onValueChange={onFormatChange}
        options={[{ label: 'Todos', value: '' }, ...pickupFormats.map(value => ({ label: value, value }))]} /></View>
    </View>
    {courts.isError && <GamePanel><ArcadeNotice>No pudimos cargar los nombres de las canchas.</ArcadeNotice>
      <GameButton secondary label="Reintentar nombres de canchas" onPress={() => void courts.refetch()} /></GamePanel>}
    {games.isPending && <GameLoading accessibilityLabel="Cargando partidos" color={gameColors.orange} />}
    {games.isError && <GamePanel><ArcadeNotice>No pudimos comprobar los partidos. Los datos anteriores pueden estar desactualizados.</ArcadeNotice>
      <GameButton secondary label="Reintentar partidos" onPress={() => void games.refetch()} /></GamePanel>}
    {games.data && <Text style={[kit.help, { fontSize: 12, lineHeight: 18 }]} accessibilityHint="Se actualiza cada 30 segundos mientras estás viendo.">{games.isFetching ? 'Actualizando…' : `Actualizado ${new Date(games.dataUpdatedAt).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}`}</Text>}
    {!games.isPending && !games.isError && !hasGames && <GamePanel><Text style={kit.section}>{courtId || format ? 'Sin partidos para estos filtros' : 'El próximo partido puede ser tuyo'}</Text>
      <Text style={kit.body}>No hay partidos abiertos ni inicios reportados{courtId || format ? ' para esta selección.' : ' todavía.'}</Text></GamePanel>}
    {cards('immediate', 'Para jugar ahora')}
    {cards('upcoming', 'Planificados')}
    {cards('playing', 'Iniciados · actividad reportada')}
  </View>;
}

