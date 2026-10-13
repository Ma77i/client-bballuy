import { ActivityIndicator, View } from 'react-native';
import Text from '@/components/AppText';
import { usePublicSessions } from '@/hooks/pickup';
import { dateLabel, sessionGroups } from '@/lib/pickup/discovery';
import { GameButton, GameNotice, GamePanel, gameColors, kit } from './Kit';
import SessionCard from './SessionCard';

export default function CourtActivity({ courtId, courtName }: { courtId: string; courtName: string }) {
  const activity = usePublicSessions();
  const games = sessionGroups(activity.data ?? []).playing.filter(game => game.court_id === courtId);
  return <View style={{ gap: 16 }}>
    <Text style={kit.section}>Court activity</Text>
    {activity.isPending && <ActivityIndicator accessibilityLabel="Checking court activity" color={gameColors.orange} />}
    {activity.isError && <GamePanel><GameNotice>Unable to check current court activity. Any previous reports below may be outdated.</GameNotice>
      <GameButton secondary label="Retry activity" onPress={() => void activity.refetch()} /></GamePanel>}
    {activity.data && <Text style={kit.help}>Last checked {dateLabel(activity.dataUpdatedAt)} · {activity.isFetching ? 'Refreshing…' : 'Checks every 30 seconds while viewing.'}</Text>}
    {!activity.isPending && !activity.isError && !games.length && <Text style={kit.body}>No games currently marked as playing. This does not confirm that the court is empty.</Text>}
    {games.map(game => <SessionCard key={game.id} game={game} courtName={courtName} />)}
  </View>;
}
