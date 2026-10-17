import { ActivityIndicator, View } from 'react-native';
import Text from '@/components/AppText';
import { usePublicSessions } from '@/hooks/pickup';
import { dateLabel, sessionGroups } from '@/lib/pickup/discovery';
import { GameButton, GameNotice, GamePanel, gameColors, kit } from './Kit';
import SessionCard from './SessionCard';
import { palette } from '@/constants/design';
import { StateView } from '@/components/foundation/Primitives';

export default function CourtActivity({ courtId, courtName, arcade = false }: { courtId: string; courtName: string; arcade?: boolean }) {
  const activity = usePublicSessions();
  const games = sessionGroups(activity.data ?? []).playing.filter(game => game.court_id === courtId);
  return <View style={{ gap: arcade ? 4 : 16 }}>
    <Text variant={arcade ? 'display' : undefined} style={arcade ? { color: palette.text, fontSize: 26, lineHeight: 34 } : kit.section} accessibilityRole="header">{arcade ? 'Actividad reportada' : 'Court activity'}</Text>
    {activity.isPending && (arcade ? <StateView title="Consultando actividad" loading /> : <ActivityIndicator accessibilityLabel="Checking court activity" color={gameColors.orange} />)}
    {activity.isError && <GamePanel><GameNotice>{arcade ? 'No pudimos comprobar la actividad. Los reportes anteriores pueden estar desactualizados.' : 'Unable to check current court activity. Any previous reports below may be outdated.'}</GameNotice>
      <GameButton secondary label={arcade ? 'Reintentar actividad' : 'Retry activity'} onPress={() => void activity.refetch()} /></GamePanel>}
    {activity.data && <Text style={kit.help}>{arcade ? 'Última comprobación' : 'Last checked'} {arcade ? new Date(activity.dataUpdatedAt).toLocaleString('es-UY', { dateStyle: 'medium', timeStyle: 'short' }) : dateLabel(activity.dataUpdatedAt)}{arcade ? activity.isFetching ? ' · Actualizando…' : '' : activity.isFetching ? ' · Refreshing…' : ' · Checks every 30 seconds while viewing.'}</Text>}
    {!activity.isPending && !activity.isError && !games.length && <Text style={arcade ? kit.help : kit.body}>{arcade ? 'Sin partidos reportados en curso. No confirma que la cancha esté vacía.' : 'No games currently marked as playing. This does not confirm that the court is empty.'}</Text>}
    {games.map(game => <SessionCard arcade={arcade} key={game.id} game={game} courtName={courtName} />)}
  </View>;
}
